<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Models\Teacher;
use Illuminate\Http\Request;
use App\Imports\ClassesImport;
use App\Models\TaskAssignment;
use App\Helpers\NotificationHelper;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;

class ClassroomController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => Classes::with(['department', 'homeroomTeacher.user'])->get()
        ]);
    }

    public function show($id)
    {
        $classroom = Classes::find($id);
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
            'class_name' => 'required|string|unique:classes,class_name',
            'department_id' => 'required|exists:departments,id',
            'homeroom_teacher_id' => 'nullable|exists:teachers,id|unique:classes,homeroom_teacher_id',
            'max_students' => 'required|integer|min:10|max:30',
            'grade_level' => 'required|integer|max:12|min:10'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 400);
        }

        $classroom = Classes::create($request->all());
        $teacher = Teacher::find($classroom->homeroom_teacher_id);
        if ($teacher && $teacher->user_id) {
            NotificationHelper::send(
                $teacher->user_id,
                'assigned_as_homeroom',
                "Anda telah ditetapkan sebagai wali kelas {$classroom->class_name}."
            );
        } else {
            Log::error("Invalid homeroom teacher or missing user_id for teacher ID: " . $classroom->homeroom_teacher_id);
        }



        return response()->json(['status' => 'success', 'message' => 'Kelas berhasil dibuat', 'data' => $classroom]);
    }

    public function update(Request $request, $id)
    {
        $classroom = Classes::find($id);
        if (!$classroom) {
            return response()->json(['status' => 'error', 'message' => 'Class not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'class_name' => 'required|string|unique:classes,class_name,' . $id,
            'department_id' => 'required|exists:departments,id',
            'homeroom_teacher_id' => 'nullable|exists:teachers,id',
            'max_students' => 'required|integer|min:1',
            'grade_level' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 400);
        }

        $oldHomeroomTeacherId = $classroom->homeroom_teacher_id;
        $newHomeroomTeacherId = $request->homeroom_teacher_id;

        $classroom->update([
            'class_name' => $request->class_name,
            'department_id' => $request->department_id,
            'homeroom_teacher_id' => $request->homeroom_teacher_id,
            'max_students' => $request->max_students,
            'grade_level' => $request->grade_level
        ]);

        if ($newHomeroomTeacherId && $newHomeroomTeacherId !== $oldHomeroomTeacherId) {
            NotificationHelper::send(
                $newHomeroomTeacherId,
                'assigned_as_homeroom',
                "Anda sekarang menjadi wali kelas {$classroom->class_name}."
            );
        }

        return response()->json(['status' => 'success', 'message' => 'Class updated successfully', 'data' => $classroom]);
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
