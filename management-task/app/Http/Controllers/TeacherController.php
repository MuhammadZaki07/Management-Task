<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Teacher;
use Illuminate\Http\Request;
use App\Helpers\HistoryHelper;
use App\Imports\TeacherImport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;

class TeacherController extends Controller
{
    public function profile()
    {
        $teacher = Teacher::where('user_id', Auth::id())
            ->with(['user', 'department','lesson'])
            ->first();

        if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }

        return response()->json([
            'id' => $teacher->user->id,
            'name' => $teacher->user->name,
            'gender' => $teacher->user->gender,
            'email' => $teacher->user->email,
            'phone' => $teacher->user->no_tlp,
            'department' => $teacher->department->department_name ?? 'No Department Found',
            'age' => $teacher->user->age ?? 'N/A',
            'lesson' => $teacher->lesson->name ?? 'N/A',
            'lesson_id' => $teacher->lesson_id
        ]);
    }

    public function index()
    {
        return response()->json(['status' => 'success', 'data' => Teacher::with('user','lesson')->get()]);
    }

    public function getGenderStatistics()
    {
        $data = DB::table('teachers')
            ->join('users', 'teachers.user_id', '=', 'users.id')
            ->selectRaw("users.gender, COUNT(*) as count")
            ->groupBy('users.gender')
            ->get();

        $total = $data->sum('count');

        $formattedData = $data->map(function ($item) use ($total) {
            return [
                'gender' => $item->gender,
                'count' => $item->count,
                'percentage' => $total > 0 ? round(($item->count / $total) * 100, 2) : 0
            ];
        });

        return response()->json(["total" => $total, "data" => $formattedData]);
    }

    public function show($id)
    {
        $teacher = Teacher::with('user')->find($id);
        if (!$teacher) {
            return response()->json(['status' => 'error', 'message' => 'Teacher not found'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $teacher]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:6|confirmed',
            'email' => 'required|email|unique:users',
            'no_tlp' => 'required|string|max:15|unique:users,no_tlp',
            'gender' => 'required|in:L,P',
            'age' => 'required|integer|min:18',
            'department_id' => 'nullable|exists:departments,id',
            'lesson_id' => 'required|exists:lessons,id',
        ]);

        return DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'teacher',
                'gender' => $validated['gender'],
                'age' => $validated['age'],
                'no_tlp' => $validated['no_tlp'],
            ]);

            $teacher = Teacher::create([
                'user_id' => $user->id,
                'department_id' => $validated['department_id'],
                'lesson_id' => $validated['lesson_id']
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Teacher created successfully',
                'data' => $teacher
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);
        $user = $teacher->user;
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6|confirmed',
            'gender' => 'sometimes|in:L,P',
            'age' => 'sometimes|integer|min:18',
            'no_tlp' => 'sometimes|string|max:15|unique:users,no_tlp,' . $user->id,
            'department_id' => 'nullable|exists:departments,id',
            'lesson_id' => 'sometimes|exists:lessons,id',
        ]);

        return DB::transaction(function () use ($user, $teacher, $validated) {
            $originalData = $user->toArray();
            $teacherOriginalData = $teacher->toArray();

            $user->update([
                'name' => $validated['name'] ?? $user->name,
                'email' => $validated['email'] ?? $user->email,
                'gender' => $validated['gender'] ?? $user->gender,
                'age' => $validated['age'] ?? $user->age,
                'no_tlp' => $validated['no_tlp'] ?? $user->no_tlp,
                'password' => isset($validated['password']) ? Hash::make($validated['password']) : $user->password,
            ]);

            $teacher->update([
                'department_id' => $validated['department_id'] ?? $teacher->department_id,
                'lesson_id' => $validated['lesson_id'] ?? $teacher->lesson_id,
            ]);

            $changes = [];

            if ($user->name !== $originalData['name']) {
                $changes[] = 'name';
            }
            if ($user->email !== $originalData['email']) {
                $changes[] = 'email';
            }
            if ($user->gender !== $originalData['gender']) {
                $changes[] = 'gender';
            }
            if ($user->age !== $originalData['age']) {
                $changes[] = 'age';
            }
            if ($user->no_tlp !== $originalData['no_tlp']) {
                $changes[] = 'no_tlp';
            }
            if ($teacher->department_id !== $teacherOriginalData['department_id']) {
                $changes[] = 'department_id';
            }

            if (!empty($changes)) {
                HistoryHelper::log(
                    $user->id,
                    'teacher_updated',
                    'Guru ' . $user->name . ' telah diperbarui. Perubahan: ' . implode(', ', $changes)
                );
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Teacher updated successfully',
                'data' => $teacher
            ]);
        });
    }

    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);

        if ($teacher->classes()->exists() || $teacher->tasks()->exists() || $teacher->announcements()->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Guru masih memiliki kelas/tugas/pengumuman!',
            ], 403);
        }

        if ($teacher->user) {
            $teacher->user->delete();
        }
        $teacher->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Guru berhasil dihapus.',
        ]);
    }

    public function forceDestroy($id)
    {
        $teacher = Teacher::findOrFail($id);

        $teacher->classes()->delete();
        $teacher->tasks()->delete();
        $teacher->taskGrades()->delete();
        $teacher->user()->delete();

        HistoryHelper::log(
            $teacher->user_id,
            'teacher_deleted',
            'Guru ' . $teacher->name . ' telah dihapus dari sistem bersama semua data terkait.'
        );

        $teacher->delete();

        return response()->json(['status' => 'success', 'message' => 'Teacher and related data deleted successfully']);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        $fileName = $request->file('file')->getClientOriginalName();

        Excel::import(new TeacherImport, $request->file('file'));

        HistoryHelper::log(
            Auth::user()->id,
            'teacher_import',
            'Guru telah diimpor menggunakan file: ' . $fileName
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Import berhasil!',
        ]);
    }

    public function getAvailableHomeroomTeachers()
    {
        $teachers = Teacher::whereDoesntHave('homeroomClasses')->with('user')->get();
        return response()->json([
            'status' => 'success',
            'data' => $teachers,
        ]);
    }
}
