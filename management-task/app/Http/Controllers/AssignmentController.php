<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Support\FacadesLog;
use App\Helpers\NotificationHelper;
use App\Models\AssignmentRecipient;
use Illuminate\Support\Facades\Log;
use App\Models\AssignmentSubmission;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $teacherId = $request->user()->teacher->id;

        $assignments = Assignment::with([
            'lesson',
            'recipients.class',
            'teacher.user'
        ])
            ->where('teacher_id', $teacherId)
            ->get()
            ->map(function ($task) {
                $task->assigned_classes = $task->recipients
                    ->whereNotNull('class_id')
                    ->map(function ($recipient) {
                        return [
                            'id' => $recipient->class_id,
                            'class_name' => $recipient->class->class_name ?? null
                        ];
                    })
                    ->values();
                $task->assignments = $task->recipients->whereNotNull('student_id')->values();

                return $task;
            });

        return response()->json($assignments);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json(['message' => 'Teacher not found'], 403);
        }

        $request->merge(['teacher_id' => $teacher->id]);

        $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'lesson_id' => 'required|exists:lessons,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'deadline' => 'nullable|date',
            'assign_to_classes' => 'array',
            'assign_to_classes.*' => 'exists:classes,id',
            'assign_to_students' => 'array',
            'assign_to_students.*' => 'exists:students,id',
            'files.*' => 'file|max:2048',
        ]);

        $uploadedFiles = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('assignments', 'public');
                $uploadedFiles[] = $path;
            }
        }

        $assignment = Assignment::create([
            'teacher_id' => $teacher->id,
            'lesson_id' => $request->lesson_id,
            'title' => $request->title,
            'description' => $request->description,
            'deadline' => $request->deadline,
            'files' => json_encode($uploadedFiles),
            'status' => 'active',
        ]);

        $assignedStudents = [];

        if ($request->filled('assign_to_classes')) {
            foreach ($request->assign_to_classes as $class_id) {
                AssignmentRecipient::create([
                    'assignment_id' => $assignment->id,
                    'class_id' => $class_id
                ]);

                $studentsInClass = Student::where('class_id', $class_id)->pluck('id')->toArray();
                $assignedStudents = array_merge($assignedStudents, $studentsInClass);
            }
        }

        if ($request->filled('assign_to_students')) {
            foreach ($request->assign_to_students as $student_id) {
                AssignmentRecipient::create([
                    'assignment_id' => $assignment->id,
                    'student_id' => $student_id
                ]);

                $assignedStudents[] = $student_id;
            }
        }

        $assignedStudents = array_unique($assignedStudents);

        NotificationHelper::sendMultiple(
            $assignedStudents,
            'new_task',
            "Anda memiliki tugas baru: {$request->title}."
        );

        return response()->json($assignment, 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $teacher = Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $assignment = Assignment::where('id', $id)->where('teacher_id', $teacher->id)->first();

        if (!$assignment) {
            return response()->json(['message' => 'Assignment not found'], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:active,non-active',
        ]);

        $assignment->update([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
        ]);

        return response()->json(['message' => 'Assignment updated successfully', 'assignment' => $assignment]);
    }

    public function show($id)
    {
        $user = Auth::user();

        $assignment = Assignment::with([
            'teacher.user',
            'lesson.class',
            'recipients',
            'submissions' => function ($query) use ($user) {
                if ($user->student) {
                    $query->where('student_id', $user->student->id);
                }
            }
        ])->findOrFail($id);

        return response()->json($assignment);
    }

    public function submit(Request $request, $assignmentId)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:20480',
        ]);

        $student = Auth::user()->student;
        $submission = AssignmentSubmission::where('assignment_id', $assignmentId)
            ->where('student_id', $student->id)
            ->first();

        if ($submission && $submission->status === 'success') {
            return response()->json(['message' => 'You cannot edit a successful submission.'], 403);
        }

        $filePaths = $submission ? json_decode($submission->file_path, true) : [];

        if ($request->hasFile('files')) {
            if ($submission) {
                foreach ($filePaths as $oldFile) {
                    Storage::disk('public')->delete($oldFile);
                }
                $filePaths = [];
            }

            foreach ($request->file('files') as $file) {
                $path = $file->store('submissions', 'public');
                $filePaths[] = $path;
            }
        } else {
            Log::error('No files found in request.');
        }

        $newSubmission = AssignmentSubmission::updateOrCreate(
            ['assignment_id' => $assignmentId, 'student_id' => $student->id],
            [
                'file_path' => json_encode($filePaths),
                'status' => 'pending',
            ]
        );

        $teacher = $newSubmission->assignment->teacher;

        if ($teacher) {
            NotificationHelper::send(
                $teacher->user_id,
                'submission_received',
                "Student {$student->user->name} has submitted the assignment '{$newSubmission->assignment->title}'."
            );
        }

        return response()->json(['message' => 'Submission uploaded successfully!']);
    }

    public function deleteSubmission($assignmentId)
    {
        $student = Auth::user()->student;

        $submission = AssignmentSubmission::where('assignment_id', $assignmentId)
            ->where('student_id', $student->id)
            ->first();

        if (!$submission) {
            return response()->json(['message' => 'Submission not found.'], 404);
        }

        if ($submission->status === 'success') {
            return response()->json(['message' => 'Cannot delete a successful submission.'], 403);
        }

        foreach (json_decode($submission->file_path, true) as $file) {
            Storage::disk('public')->delete($file);
        }

        $submission->delete();

        return response()->json(['message' => 'Submission deleted successfully.']);
    }

    public function grade(Request $request, $id)
    {
        $request->validate([
            'score' => 'required|integer|min:0|max:100',
            'feedback' => 'nullable|string'
        ]);

        $submission = AssignmentSubmission::findOrFail($id);
        $submission->update([
            'score' => $request->score,
            'feedback' => $request->feedback,
            'status' => 'success'
        ]);

        return response()->json($submission);
    }

    public function studentAssignments(Request $request)
    {
        $user = Auth::user();
        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $tasks = Assignment::where('status', 'active')
            ->whereHas('recipients', function ($query) use ($student) {
                $query->where('student_id', $student->id)
                    ->orWhereHas('class', function ($q) use ($student) {
                        $q->whereHas('students', function ($qs) use ($student) {
                            $qs->where('id', $student->id);
                        });
                    });
            })
            ->with(['lesson', 'teacher.user', 'recipients'])
            ->get();

        return response()->json($tasks);
    }

    public function destroy($id)
    {
        $assignment = Assignment::find($id);

        if (!$assignment) {
            return response()->json(['message' => 'Assignment not found'], 404);
        }

        $files = json_decode($assignment->files, true);
        if ($files) {
            foreach ($files as $file) {
                Storage::disk('public')->delete($file);
            }
        }

        $assignment->delete();

        return response()->json(['message' => 'Assignment deleted successfully']);
    }

    public function download(Request $request)
    {
        $filePath = $request->query('file');
        if (!$filePath) {
            return response()->json(['error' => 'File path is required'], 400);
        }

        $storagePath = storage_path("app/public/" . $filePath);
        if (!file_exists($storagePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }
        $fileExtension = pathinfo($storagePath, PATHINFO_EXTENSION);
        $isMedia = in_array(strtolower($fileExtension), ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi']);
        $downloadName = $isMedia ? "media_TMS.{$fileExtension}" : "document_TMS.{$fileExtension}";

        return response()->download($storagePath, $downloadName);
    }

    public function getSubmissions($assignment_id)
    {
        $submissions = AssignmentSubmission::with([
            'student.user',
            'student.class',
            'student.department'
        ])->where('assignment_id', $assignment_id)->get();

        $assignment = Assignment::with(['lesson', 'lesson.class', 'lesson.department'])->findOrFail($assignment_id);

        return response()->json([
            'class_id' => $assignment->lesson->class_id,
            'lesson' => $assignment->lesson,
            'department' => $assignment->lesson->department,
            'class' => $assignment->lesson->class,
            'submissions' => $submissions
        ]);
    }

    public function requestRevision($submissionId)
    {
        $submission = AssignmentSubmission::find($submissionId);

        if (!$submission) {
            return response()->json(['message' => 'Submission tidak ditemukan.'], 404);
        }

        if ($submission->score === null || $submission->score >= 75) {
            return response()->json(['message' => 'Submission tidak memenuhi syarat revisi.'], 400);
        }

        $submission->status = 'revision';
        $submission->save();

        $teacher = $submission->assignment->teacher;

        if ($teacher) {
            NotificationHelper::send(
                $teacher->user_id,
                'revision_requested',
                "student {$submission->student->user->name} submit revisions to assignments '{$submission->assignment->title}'."
            );
        }

        return response()->json(['message' => 'Revision successfully submitted. Notification has been sent to teacher.'], 200);
    }

    public function gradeSubmission(Request $request, $submissionId)
    {
        $request->validate([
            'score' => 'required|numeric|min:0|max:100',
            'feedback' => 'required|string',
        ]);

        $submission = AssignmentSubmission::find($submissionId);
        if (!$submission) {
            return response()->json(['message' => 'Submission not found.'], 404);
        }

        $submission->score = $request->score;
        $submission->feedback = $request->feedback;

        if ($request->score >= 75) {
            $submission->status = 'success';
        } else {
            $submission->status = 'revision_requested';
        }

        $submission->save();

        NotificationHelper::send(
            $submission->student->user_id,
            'submission_reviewed',
            'Your assignment has been reviewed. Check your feedback!'
        );

        return response()->json(['message' => 'Submission updated successfully.']);
    }

    public function handleRevision(Request $request, $submissionId)
    {
        Log::info('Request Data:', $request->all());

        $request->validate([
            'action' => 'required|in:accept,reject',
        ]);

        $submission = AssignmentSubmission::find($submissionId);
        if (!$submission) {
            return response()->json(['message' => 'Submission not found.'], 404);
        }

        Log::info('Submission Found:', ['id' => $submissionId, 'status' => $submission->status]);

        if ($submission->status !== 'revision') {
            return response()->json(['message' => 'Invalid action. Submission is not in revision request status.'], 400);
        }

        if ($request->action === 'accept') {
            $submission->status = 'pending';
            $submission->score = null;
            $submission->feedback = null;
            NotificationHelper::send(
                $submission->student->user_id,
                'revision_approved',
                'Your revision request has been accepted. You can resubmit your assignment.'
            );
        } else {
            $submission->status = 'rejected';
            NotificationHelper::send(
                $submission->student->user_id,
                'revision_rejected',
                'Your revision request has been rejected.'
            );
        }

        $submission->save();
        return response()->json(['message' => 'Revision status updated successfully.']);
    }

    public function getValueTask()
    {
        $studentId = Auth::user()->student->id;

        $assessments = AssignmentSubmission::where('student_id', $studentId)
            ->whereNotNull('score')
            ->with(['assignment.teacher', 'assignment.lesson']) // Perbaikan: subject → lesson
            ->get()
            ->map(function ($submission) {
                return [
                    'id' => $submission->id,
                    'task' => $submission->assignment->title,
                    'teacher' => $submission->assignment->teacher->user->name ?? 'Unknown Teacher',
                    'lesson' => $submission->assignment->lesson->name ?? 'Unknown Lesson',
                    'value' => $submission->score,
                ];
            });

        return response()->json($assessments);
    }

    public function getCompletedTasks()
    {
        $user = Auth::user();

        $completedTasks = AssignmentSubmission::where('student_id', $user->student_id)
            ->where('status', 'success')
            ->select(
                DB::raw('DATE(updated_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($completedTasks);
    }

    public function getTaskChartData()
    {
        $user = Auth::user();

        $tasks = Assignment::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as total_tasks')
            )
            ->where('teacher_id', $user->id)
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($tasks);
    }

}
