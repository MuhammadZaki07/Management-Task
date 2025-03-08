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
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with(['teacher.user', 'lesson', 'assignments.student.user', 'class', 'assignedClasses'])->get();
        return response()->json($tasks);
    }

    public function show(Task $task)
    {
        $task->load([
            'teacher.user',
            'teacher.department',
            'assignments.submissions.student.user',
            'assignments.submissions.student.department',
            'submissions'
        ]);

        return response()->json($task);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'files' => 'nullable|array',
            'files.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx,gif|max:2048',
            'due_date' => 'nullable|date',
            'assign_to_classes' => 'array',
            'assign_to_students' => 'array',
        ]);

        $filePaths = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('tasks', 'public');
                $filePaths[] = $path;
            }
        }

        $task = DB::transaction(function () use ($validated, $filePaths) {
            $dueDate = isset($validated['due_date']) ? Carbon::parse($validated['due_date'])->endOfDay() : null;
            $task = Task::create([
                'teacher_id' => Auth::user()->teacher->id,
                'lesson_id' => $validated['lesson_id'],
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'files' => json_encode($filePaths),
                'due_date' => $dueDate,
            ]);

            $teacherName = Auth::user()->name;

            HistoryHelper::log(Auth::id(), 'tugas_diberikan', "Tugas '{$task->title}' telah diberikan oleh {$teacherName}");

            $this->assignTask($task->id, $validated);

            return $task;
        });

        return response()->json(['message' => 'Task Success Created!', 'task' => $task], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date_format:Y-m-d H:i:s',
        ]);

        $task = Task::findOrFail($id);
        $isGraded = TaskSubmission::whereHas('taskAssignment', function ($query) use ($id) {
            $query->where('task_id', $id);
        })->where('status', 'graded')->exists();

        if ($isGraded) {
            return response()->json(['message' => 'Tugas tidak bisa diubah karena sudah dinilai!'], 403);
        }

        DB::transaction(function () use ($task, $validated, $request) {
            $teacherName = Auth::user()->name;
            HistoryHelper::log(Auth::id(), 'tugas_diubah', "Tugas '{$task->title}' telah diubah oleh {$teacherName}");

            $task->update([
                'title' => $validated['title'] ?? $task->title,
                'description' => $validated['description'] ?? $task->description,
                'due_date' => $request->has('due_date') && $request->due_date !== null ? $validated['due_date'] : null, // 🔥 FIX: Jika tidak dikirim, jadikan NULL
            ]);
        });

        return response()->json(['message' => 'Tugas berhasil diperbarui!', 'task' => $task], 200);
    }

    private function assignTask($taskId, $validated)
    {
        TaskAssignment::where('task_id', $taskId)->delete();

        $teacherName = Auth::user()->name;
        $task = Task::find($taskId);
        $taskTitle = $task->title;

        // Assign ke kelas
        if (!empty($validated['assign_to_classes'])) {
            $classAssignments = array_map(fn($classId) => [
                'task_id' => $taskId,
                'class_id' => $classId,
                'target_type' => 'class',
                'created_at' => now(),
                'updated_at' => now(),
            ], $validated['assign_to_classes']);

            TaskAssignment::insert($classAssignments);
            $students = Student::whereIn('class_id', $validated['assign_to_classes'])->pluck('user_id');
            foreach ($students as $studentId) {
                NotificationHelper::send($studentId, 'new_task', "Tugas '$taskTitle' diperbarui oleh $teacherName.");
            }
        }

        if (!empty($validated['assign_to_students'])) {
            $studentAssignments = array_map(fn($studentId) => [
                'task_id' => $taskId,
                'student_id' => $studentId,
                'target_type' => 'individual',
                'created_at' => now(),
                'updated_at' => now(),
            ], $validated['assign_to_students']);

            TaskAssignment::insert($studentAssignments);
            foreach ($validated['assign_to_students'] as $studentId) {
                NotificationHelper::send($studentId, 'new_task', "Tugas '$taskTitle' diperbarui oleh $teacherName.");
            }
        }
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function getTaskChartData()
    {
        $user = Auth::user();
        $tasks = DB::table('tasks')
            ->select(DB::raw('YEARWEEK(created_at, 1) as week_number'), DB::raw('COUNT(*) as total_tasks'))
            ->where('teacher_id', $user->id)
            ->groupBy('week_number')
            ->orderBy('week_number')
            ->get();

        $formattedData = $tasks->map(function ($task, $index) {
            return [
                'week' => "Week " . ($index + 1),
                'total_tasks' => $task->total_tasks,
            ];
        });

        return response()->json($formattedData);
    }

    public function download(Request $request)
    {
        $filePath = $request->query('file');
        Log::info("Requested file path: " . $filePath);

        if (!$filePath) {
            return response()->json(['error' => 'No file specified'], 400);
        }

        $fullPath = public_path("storage/" . $filePath);
        Log::info("Full path resolved: " . $fullPath);

        if (!file_exists($fullPath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $extension = pathinfo($fullPath, PATHINFO_EXTENSION);
        $isMedia = in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov']);
        $newFileName = $isMedia ? "media_TMS.$extension" : "document_TMS.$extension";

        return response()->download($fullPath, $newFileName);
    }
}
