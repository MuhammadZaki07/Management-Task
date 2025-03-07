<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use App\Helpers\HistoryHelper;
use App\Services\StudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Helpers\NotificationHelper;
use App\Models\Classes;
use App\Models\TaskGrade;
use App\Models\TaskSubmission;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function profile()
    {
        $user = Auth::user();
        $student = Student::with(['class', 'department'])->where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'Profil siswa tidak ditemukan'], 404);
        }

        return response()->json([
            'id' => $student->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'age' => $user->age,
            'no_tlp' => $user->no_tlp,
            'gender' => $user->gender,
            'student' => [
                'id' => $student->student_id,
            ],
            'class' => [
                'id' => $student->class->id ?? null,
                'grade_level' => $student->class->grade_level ?? null,
                'class_name' => $student->class->class_name ?? null,
            ],
            'department' => $student->department->department_name ?? null,
        ]);

    }
    public function index()
    {
        $students = Student::with(['user', 'department', 'class'])->get();

        return response()->json(['status' => 'success', 'data' => $students]);
    }

    public function studentsPerYear(): JsonResponse
    {
        try {
            $years = range(2025, 2030);

            $students = Student::selectRaw('YEAR(students.created_at) as year, users.gender, COUNT(*) as count')
                ->join('users', 'users.id', '=', 'students.user_id')
                ->whereYear('students.created_at', '>=', 2025)
                ->groupBy('year', 'users.gender')
                ->get();

            Log::info('Students Data:', $students->toArray());

            $data = [];
            foreach ($years as $year) {
                $data[$year] = ['male' => 0, 'female' => 0];
            }

            foreach ($students as $student) {
                if ($student->gender === 'L') {
                    $data[$student->year]['male'] = (int) $student->count;
                } elseif ($student->gender === 'P') {
                    $data[$student->year]['female'] = (int) $student->count;
                }
            }

            return response()->json([
                'status' => 'success',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching students per year:', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $student = Student::with('user')->find($id);
        if (!$student) {
            return response()->json(['status' => 'error', 'message' => 'Student not found'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $student]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'gender' => 'required|in:L,P',
            'age' => 'required|integer|min:5|max:20',
            'no_tlp' => 'required|string|max:15|unique:users,no_tlp',
            'class_id' => 'nullable|exists:classes,id',
            'department_id' => 'required|exists:departments,id',
        ]);

        Log::info('Incoming student creation request', [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'gender' => $validated['gender'],
            'no_tlp' => $validated['no_tlp'],
            'age' => $validated['age'],
            'class_id' => $validated['class_id'],
            'department_id' => $validated['department_id']
        ]);

        // Handle missing or null class_id, providing a warning log
        if ($validated['class_id'] == null) {
            Log::warning("Class ID is missing, proceeding without class assignment.");
        }

        // Ensure department_id is not null
        if ($validated['department_id'] == null) {
            Log::error('Department ID is missing');
            return response()->json(['error' => 'Department ID is required'], 422);
        }

        // Start transaction to ensure atomicity
        return DB::transaction(function () use ($validated) {
            try {
                // Create user record
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'role' => 'student',
                    'gender' => $validated['gender'],
                    'age' => $validated['age'],
                    'no_tlp' => $validated['no_tlp'],
                ]);

                $student = Student::create([
                    'user_id' => $user->id,
                    'class_id' => $validated['class_id'] ?? null,
                    'department_id' => $validated['department_id'],
                ]);

                Log::info('Student created successfully', ['student' => $student]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Student created successfully',
                    'data' => $student
                ], 201);
            } catch (\Exception $e) {
                // Log the error if something goes wrong
                Log::error('Error creating student: ' . $e->getMessage(), [
                    'exception' => $e
                ]);

                return response()->json([
                    'status' => 'error',
                    'message' => 'Error creating student',
                    'error' => $e->getMessage()
                ], 500);
            }
        });
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $user = $student->user;

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6|confirmed',
            'gender' => 'sometimes|in:L,P',
            'age' => 'sometimes|integer|min:15|max:20',
            'no_tlp' => 'sometimes|string|max:15|unique:users,no_tlp,' . $user->id,
            'class_id' => 'sometimes|nullable',
            'department_id' => 'sometimes|exists:departments,id',
        ]);

        return DB::transaction(function () use ($user, $student, $validated) {
            $originalData = $user->toArray();
            $studentOriginalData = $student->toArray();

            $user->update([
                'name' => $validated['name'] ?? $user->name,
                'email' => $validated['email'] ?? $user->email,
                'gender' => $validated['gender'] ?? $user->gender,
                'age' => $validated['age'] ?? $user->age,
                'no_tlp' => $validated['no_tlp'] ?? $user->no_tlp,
                'password' => isset($validated['password']) ? Hash::make($validated['password']) : $user->password,
            ]);

            $student->update([
                'class_id' => $validated['class_id'] ?? $student->class_id,
                'department_id' => $validated['department_id'] ?? $student->department_id,
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
            if ($student->class_id !== $studentOriginalData['class_id']) {
                $changes[] = 'class_id';
            }
            if ($student->department_id !== $studentOriginalData['department_id']) {
                $changes[] = 'department_id';
            }

            if (!empty($changes)) {
                HistoryHelper::log(
                    $user->id,
                    'student_updated',
                    'Student ' . $user->name . ' has been updated. Changes: ' . implode(', ', $changes)
                );
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Student updated successfully',
                'data' => $student
            ]);
        });
    }
    public function destroy(Request $request)
    {
        $ids = $request->ids;

        if (empty($ids)) {
            return response()->json(['status' => 'error', 'message' => 'No IDs provided.'], 400);
        }

        foreach ($ids as $id) {
            $student = Student::find($id);
            if (!$student) {
                return response()->json(['status' => 'error', 'message' => 'Student not found for ID ' . $id], 404);
            }

            $studentName = $student->user->name;

            if (!$student->class_id) {
                HistoryHelper::log(
                    Auth::user()->id,
                    'student_deleted',
                    "Murid $studentName telah dihapus dari sistem (tanpa kelas)."
                );

                $student->user->delete();
                $student->delete();

                continue;
            }

            if ($student->taskSubmissions()->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Student masih memiliki tugas yang dikumpulkan!'
                ], 403);
            }

            if ($student->grades()->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Student masih memiliki nilai yang diberikan!'
                ], 403);
            }

            $teacherIds = Teacher::whereHas('classes', function ($query) use ($student) {
                $query->where('id', $student->class_id);
            })->pluck('user_id');

            HistoryHelper::log(
                Auth::user()->id,
                'student_deleted',
                "Murid $studentName telah dihapus dari sistem."
            );

            $student->user->delete();
            $student->delete();

            if ($teacherIds->isNotEmpty()) {
                NotificationHelper::sendMultiple(
                    $teacherIds->toArray(),
                    'student_deleted',
                    "Murid $studentName telah dihapus dari sistem."
                );
            }
        }

        return response()->json(['status' => 'success', 'message' => 'Students deleted successfully']);
    }

    public function forceDestroy(Request $request)
    {
        $ids = $request->ids;

        if (empty($ids)) {
            return response()->json(['status' => 'error', 'message' => 'No IDs provided.'], 400);
        }

        foreach ($ids as $id) {
            $student = Student::find($id);
            if (!$student) {
                return response()->json(['status' => 'error', 'message' => 'Student not found for ID ' . $id], 404);
            }

            $studentName = $student->user->name;

            $student->submissions()->delete();

            $teacherIds = Teacher::whereHas('classes', function ($query) use ($student) {
                $query->whereIn('id', $student->classes->pluck('id'));
            })->pluck('user_id');

            HistoryHelper::log(
                Auth::user()->id,
                'student_deleted_force',
                "Murid $studentName telah dihapus paksa dari sistem beserta data terkait."
            );

            $student->user->delete();
            $student->delete();

            if ($teacherIds->isNotEmpty()) {
                NotificationHelper::sendMultiple(
                    $teacherIds->toArray(),
                    'student_deleted_force',
                    "Murid $studentName telah dihapus paksa dari sistem beserta data terkait."
                );
            }
        }

        return response()->json(['status' => 'success', 'message' => 'Students deleted forcefully and all related data removed']);
    }

    public function promoteStudents(Request $request)
    {
        $request->validate([
            'classes' => 'required|array',
            'classes.*.old_class_id' => 'required|exists:classes,id',
            'classes.*.new_class_name' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $newClasses = [];

            foreach ($request->classes as $classData) {
                $oldClass = Classes::find($classData['old_class_id']);

                if ($oldClass->grade_level == 12) {
                    $students = Student::where('class_id', $oldClass->id)->get();
                    foreach ($students as $student) {
                        $student->status = 'graduated';
                        $student->save();
                    }
                    return response()->json([
                        'status' => 'success',
                        'message' => 'Class already at grade 12, students marked as graduated.',
                    ], 200);
                }

                $newGradeLevel = $oldClass->grade_level + 1;
                $newClassName = $newGradeLevel . '-' . substr($oldClass->class_name, 3);
                $academicYear = now()->year + 1;

                $academicYearRecord = AcademicYear::where('year', $academicYear)->first();
                if (!$academicYearRecord) {
                    $academicYearRecord = AcademicYear::create([
                        'year' => $academicYear,
                        'status' => 'active',
                    ]);
                }

                $homeroomTeacherId = $oldClass->homeroom_teacher_id;
                $newClass = Classes::create([
                    'class_name' => $newClassName,
                    'department_id' => $oldClass->department_id,
                    'academic_year_id' => $academicYearRecord->id,
                    'grade_level' => $newGradeLevel,
                    'homeroom_teacher_id' => $homeroomTeacherId,
                ]);
                $newClasses[$oldClass->id] = $newClass->id;
                $students = Student::where('class_id', $oldClass->id)->get();
                foreach ($students as $student) {
                    Student::create([
                        'user_id' => $student->user_id,
                        'class_id' => $newClass->id,
                        'department_id' => $student->department_id,
                        'status' => 'active',
                    ]);
                }
            }

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Students promoted successfully!',
                'new_classes' => $newClasses,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Promotion failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    public function getTasksByScore(Request $request)
    {
        $user = Auth::user();
        $type = $request->query('type');

        if (!in_array($type, ['below', 'above'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid type parameter. Use "below" or "above".'
            ], 400);
        }

        $operator = $type === 'below' ? '<' : '>=';
        $message = $type === 'below' ? 'Tasks with scores below KKM' : 'Tasks with scores above KKM';

        $tasks = TaskGrade::whereHas('taskSubmission', function ($query) use ($user) {
                $query->where('student_id', $user->id);
            })
            ->where('score', $operator, 75)
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $tasks
        ]);
    }

}
