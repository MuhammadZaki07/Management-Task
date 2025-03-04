<?php

namespace App\Http\Controllers;

use App\Helpers\HistoryHelper;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Models\TaskAssignment;
use App\Models\TaskSubmission;
use Illuminate\Support\Facades\DB;
use App\Helpers\NotificationHelper;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with('assignments')->get();
        return response()->json($tasks);
    }

    public function show(Task $task)
    {
        return response()->json($task->load('assignments', 'submissions'));
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|string',
            'due_date' => 'required|date',
            'assign_to_classes' => 'array',
            'assign_to_students' => 'array',
        ]);

        $task = DB::transaction(function () use ($validated) {
            $task = Task::create([
                'teacher_id' => Auth::user()->teacher->id,
                'lesson_id' => $validated['lesson_id'],
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'file' => $validated['file'] ?? null,
                'due_date' => $validated['due_date'],
            ]);

            $teacherName = Auth::user()->name;

            HistoryHelper::log(
                Auth::id(),
                'tugas_diberikan',
                "Tugas '{$task->title}' telah diberikan oleh {$teacherName} pada pelajaran {$task->lesson->title}"
            );

            if (!empty($validated['assign_to_classes'])) {
                $classAssignments = array_map(fn($classId) => [
                    'task_id' => $task->id,
                    'class_id' => $classId,
                    'target_type' => 'class',
                    'created_at' => now(),
                    'updated_at' => now(),
                ], $validated['assign_to_classes']);

                TaskAssignment::insert($classAssignments);

                $students = Student::whereIn('class_id', $validated['assign_to_classes'])->pluck('user_id');
                foreach ($students as $studentId) {
                    NotificationHelper::send($studentId, 'new_task', "Ada tugas baru dari $teacherName: " . $task->title);
                }
            }

            if (!empty($validated['assign_to_students'])) {
                $studentAssignments = array_map(fn($studentId) => [
                    'task_id' => $task->id,
                    'student_id' => $studentId,
                    'target_type' => 'individual',
                    'created_at' => now(),
                    'updated_at' => now(),
                ], $validated['assign_to_students']);

                TaskAssignment::insert($studentAssignments);

                foreach ($validated['assign_to_students'] as $studentId) {
                    NotificationHelper::send($studentId, 'new_task', "Ada tugas baru dari $teacherName: " . $task->title);
                }
            }

            return $task;
        });

        return response()->json([
            'message' => 'Tugas berhasil dibuat dan dikirim!',
            'task' => $task
        ], 201);
    }


    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|string',
            'due_date' => 'nullable|date',
            'assign_to_classes' => 'array',
            'assign_to_students' => 'array',
        ]);

        $task = Task::findOrFail($id);

        $isGraded = TaskSubmission::whereHas('taskAssignment', function ($query) use ($id) {
            $query->where('task_id', $id);
        })->where('status', 'graded')->exists();

        if ($isGraded) {
            return response()->json([
                'message' => 'Tugas tidak bisa diubah karena sudah dinilai!'
            ], 403);
        }

        DB::transaction(function () use ($task, $validated, $id, $request) {
            // Menyimpan riwayat sebelum tugas diperbarui
            HistoryHelper::log(
                Auth::id(),
                'tugas_diubah',
                "Tugas '{$task->title}' telah diubah. Judul sebelumnya: '{$task->title}', Deskripsi sebelumnya: '{$task->description}'"
            );

            // Update tugas
            $task->update([
                'title' => $validated['title'] ?? $task->title,
                'description' => $validated['description'] ?? $task->description,
                'file' => $validated['file'] ?? $task->file,
                'due_date' => $validated['due_date'] ?? $task->due_date,
            ]);

            $teacherName = Auth::user()->name;
            $taskTitle = $task->title;

            // Menangani assignment ke kelas
            if (isset($validated['assign_to_classes'])) {
                TaskAssignment::where('task_id', $id)->whereNotNull('class_id')->delete();

                $classAssignments = array_map(fn($classId) => [
                    'task_id' => $id,
                    'class_id' => $classId,
                    'target_type' => 'class',
                    'created_at' => now(),
                    'updated_at' => now(),
                ], $validated['assign_to_classes']);

                TaskAssignment::insert($classAssignments);

                $students = Student::whereIn('class_id', $validated['assign_to_classes'])->pluck('user_id');
                foreach ($students as $studentId) {
                    NotificationHelper::send($studentId, 'new_task', "Tugas '$taskTitle' telah diperbarui oleh $teacherName.");
                }
            }

            // Menangani assignment ke siswa individual
            if (isset($validated['assign_to_students'])) {
                TaskAssignment::where('task_id', $id)->whereNotNull('student_id')->delete();

                $studentAssignments = array_map(fn($studentId) => [
                    'task_id' => $id,
                    'student_id' => $studentId,
                    'target_type' => 'individual',
                    'created_at' => now(),
                    'updated_at' => now(),
                ], $validated['assign_to_students']);

                TaskAssignment::insert($studentAssignments);

                foreach ($validated['assign_to_students'] as $studentId) {
                    NotificationHelper::send($studentId, 'new_task', "Tugas '$taskTitle' telah diperbarui oleh $teacherName.");
                }
            }
        });

        return response()->json([
            'message' => 'Tugas berhasil diperbarui!',
            'task' => $task
        ], 200);
    }

    public function destroy(Task $task)
    {
        $hasGradedSubmissions = $task->submissions()->where('status', 'graded')->exists();

        if ($hasGradedSubmissions) {
            return response()->json(['message' => 'Task tidak bisa dihapus karena ada submission yang sudah dinilai!'], 403);
        }

        $studentIds = $task->assignments()->pluck('student_id')->filter()->toArray();

        DB::transaction(function () use ($task, $studentIds) {
            // Menyimpan riwayat penghapusan tugas
            HistoryHelper::log(
                Auth::id(),
                'tugas_dihapus',
                "Tugas '{$task->title}' telah dihapus. Penghapusan dilakukan oleh " . Auth::user()->name
            );

            // Menghapus tugas, assignments, dan submissions
            $task->assignments()->delete();
            $task->submissions()->delete();
            $task->delete();
        });

        foreach ($studentIds as $studentId) {
            NotificationHelper::send(
                $studentId,
                'task_deleted',
                'Tugas "' . $task->title . '" telah dihapus oleh guru.'
            );
        }

        NotificationHelper::send(
            $task->teacher_id,
            'task_deleted',
            'Tugas "' . $task->title . '" telah dihapus dari sistem.'
        );

        return response()->json(['message' => 'Task deleted successfully']);
    }

}
