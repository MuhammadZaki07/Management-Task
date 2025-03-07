<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Classes;
use App\Models\Teacher;
use Illuminate\Http\Request;
use App\Imports\ClassesImport;
use App\Models\TaskAssignment;
use App\Helpers\NotificationHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;

class ClassroomController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => Classes::with(['department', 'homeroomTeacher.user','academicYear'])->get()
        ]);
    }

    public function show($id)
    {
        $classroom = Classes::with('department','academicYear','homeroomTeacher.user')->findOrFail($id);
        if (!$classroom) {
            return response()->json(['status' => 'error', 'message' => 'Class not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $classroom
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'class_name' => 'required|string',
            'department_id' => 'required|exists:departments,id',
            'homeroom_teacher_id' => 'nullable|exists:teachers,id',
            'max_students' => 'required|integer|min:1',
            'grade_level' => 'required|integer|min:10|max:12',
            'academic_year' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 400);
        }

        DB::beginTransaction();

        try {
            $academicYear = AcademicYear::firstOrCreate(['year' => $request->academic_year]);

            if (!$academicYear) {
                throw new \Exception("Gagal membuat tahun ajaran");
            }
            $class = Classes::create([
                'class_name' => $request->class_name,
                'department_id' => $request->department_id,
                'homeroom_teacher_id' => $request->homeroom_teacher_id,
                'max_students' => $request->max_students,
                'grade_level' => $request->grade_level,
                'academic_year_id' => $academicYear->id,
            ]);

            Log::info('Data berhasil dibuat:', $class->toArray());
            DB::commit();

            return response()->json(['status' => 'success', 'message' => 'Kelas berhasil dibuat', 'data' => $class]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat membuat kelas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'class_name' => 'required|string',
            'department_id' => 'required|exists:departments,id',
            'homeroom_teacher_id' => 'nullable|exists:teachers,id',
            'max_students' => 'required|integer|min:1',
            'grade_level' => 'required|integer|min:10|max:12',
            'academic_year' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 400);
        }

        DB::beginTransaction();

        try {
            $class = Classes::findOrFail($id);
            $academicYear = AcademicYear::firstOrCreate(['year' => $request->academic_year]);

            $class->update([
                'class_name' => $request->class_name,
                'department_id' => $request->department_id,
                'homeroom_teacher_id' => $request->homeroom_teacher_id,
                'max_students' => $request->max_students,
                'grade_level' => $request->grade_level,
                'academic_year_id' => $academicYear->id,
            ]);

            DB::commit();

            return response()->json(['status' => 'success', 'message' => 'Kelas berhasil diperbarui', 'data' => $class]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memperbarui kelas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        $ids = $request->ids;

        if (empty($ids)) {
            return response()->json(['status' => 'error', 'message' => 'No IDs provided.'], 400);
        }

        foreach ($ids as $id) {
            $classroom = Classes::find($id);

            if (!$classroom) {
                return response()->json(['status' => 'error', 'message' => 'Class not found for ID ' . $id], 404);
            }

            if ($classroom->taskAssignments()->exists()) {
                return response()->json(['status' => 'error', 'message' => 'Class ' . $classroom->class_name . ' masih memiliki tugas yang diberikan!'], 403);
            }

            $className = $classroom->class_name;

            $classroom->students()->update(['class_id' => null]);

            TaskAssignment::where('class_id', $id)->delete();

            $classroom->delete();

            $teacher = Teacher::find($classroom->homeroom_teacher_id);
            if ($teacher && $teacher->user_id) {
                NotificationHelper::send(
                    $teacher->user_id,
                    'homeroom_removed',
                    "Kelas {$className} telah dihapus. Anda bukan lagi wali kelas ini."
                );
            }
        }

        return response()->json(['status' => 'success', 'message' => 'Classes deleted successfully']);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv'
        ]);

        try {
            Excel::import(new ClassesImport, $request->file('file'));
            return response()->json(['status' => 'success', 'message' => 'Kelas berhasil diimpor']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
