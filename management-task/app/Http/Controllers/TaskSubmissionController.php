<?php

namespace App\Http\Controllers;

use App\Helpers\HistoryHelper;
use Illuminate\Http\Request;
use App\Models\TaskSubmission;
use App\Helpers\NotificationHelper;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class TaskSubmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_assignment_id' => 'required|exists:task_assignments,id',
            'submission_text' => 'nullable|string',
            'submission_file' => 'nullable|string',
        ]);

        $studentId = Auth::user()->student->id;

        $existingSubmission = TaskSubmission::where([
            'task_assignment_id' => $validated['task_assignment_id'],
            'student_id' => $studentId,
        ])->first();

        if ($existingSubmission) {
            if ($existingSubmission->status === 'revision rejected') {
                return response()->json([
                    'message' => 'Permintaan revisi ditolak, Anda tidak bisa mengirim ulang tugas ini!'
                ], 403);
            }

            return response()->json([
                'message' => 'Anda sudah mengumpulkan tugas ini!',
                'submission' => $existingSubmission
            ], 400);
        }

        $submission = TaskSubmission::create([
            'task_assignment_id' => $validated['task_assignment_id'],
            'student_id' => $studentId,
            'submission_text' => $validated['submission_text'] ?? null,
            'submission_file' => $validated['submission_file'] ?? null,
            'status' => 'pending',
        ]);

        HistoryHelper::log(
            $studentId,
            'tugas_dikumpulkan',
            "Murid " . Auth::user()->name . " telah mengumpulkan tugas '{$submission->taskAssignment->task->title}'."
        );

        NotificationHelper::send(
            $submission->taskAssignment->teacher_id,
            'submission_received',
            'Murid ' . Auth::user()->name . ' telah mengumpulkan tugas.'
        );

        return response()->json([
            'message' => 'Tugas berhasil dikumpulkan!',
            'submission' => $submission
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $submission = TaskSubmission::with('taskAssignment.task')->findOrFail($id);
        return response()->json($submission);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'submission_text' => 'nullable|string',
            'submission_file' => 'nullable|string',
        ]);

        $submission = TaskSubmission::findOrFail($id);

        if ($submission->status === 'graded') {
            return response()->json(['message' => 'Submission tidak bisa diubah karena sudah dinilai!'], 403);
        }

        HistoryHelper::log(
            $submission->student_id,
            'tugas_dikirim_ulang',
            "Murid " . Auth::user()->name . " telah mengirim ulang tugas '{$submission->taskAssignment->task->title}' setelah revisi."
        );

        $submission->update([
            'submission_text' => $validated['submission_text'] ?? $submission->submission_text,
            'submission_file' => $validated['submission_file'] ?? $submission->submission_file,
            'status' => 'pending',
        ]);

        $teacherId = $submission->taskAssignment->task->teacher_id ?? null;

        if ($teacherId) {
            NotificationHelper::send(
                $teacherId,
                'submission_resubmitted',
                'Murid ' . Auth::user()->name . ' telah mengirim ulang tugas setelah revisi.'
            );
        }

        return response()->json([
            'message' => 'Submission berhasil diperbarui!',
            'submission' => $submission
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $submission = TaskSubmission::findOrFail($id);

        if ($submission->status === 'graded') {
            return response()->json(['message' => 'Submission tidak bisa dihapus karena sudah dinilai!'], 403);
        }

        $teacherId = $submission->taskAssignment->teacher_id;
        $taskTitle = $submission->taskAssignment->task->title;

        HistoryHelper::log(
            $submission->student_id,
            'tugas_dihapus',
            'Murid ' . Auth::user()->name . ' telah menghapus tugas "' . $taskTitle . '".'
        );

        $submission->delete();

        NotificationHelper::send(
            $teacherId,
            'submission_deleted',
            'Murid ' . Auth::user()->name . ' telah menghapus tugas "' . $taskTitle . '".'
        );

        return response()->json(['message' => 'Submission berhasil dihapus!']);
    }


    public function requestRevision($submissionId)
    {
        $submission = TaskSubmission::findOrFail($submissionId);

        if ($submission->student_id !== Auth::user()->student->id) {
            return response()->json(['message' => 'Anda tidak berhak mengajukan revisi untuk tugas ini!'], 403);
        }

        if (!$submission->canRequestRevision()) {
            return response()->json(['message' => 'Tugas ini tidak bisa direvisi!'], 400);
        }

        HistoryHelper::log(
            $submission->student_id,
            'revisi_diminta',
            'Murid ' . Auth::user()->name . ' mengajukan revisi untuk tugas "' . $submission->taskAssignment->task->title . '".'
        );

        $submission->update(['status' => 'revision']);

        $teacherId = $submission->grading->teacher_id ?? null;

        if ($teacherId) {
            NotificationHelper::send(
                $teacherId,
                'revision_requested',
                'Murid ' . Auth::user()->name . ' mengajukan revisi untuk tugas.'
            );
        }

        return response()->json([
            'message' => 'Permintaan revisi telah diajukan!',
            'submission' => $submission
        ], 200);
    }

    public function reviewRevision(Request $request, $submissionId)
    {
        $validated = $request->validate([
            'approved' => 'required|boolean',
            'feedback' => 'nullable|string',
        ]);

        $submission = TaskSubmission::findOrFail($submissionId);
        $teacherId = Auth::user()->teacher->id;

        if ($submission->grading->teacher_id !== $teacherId) {
            return response()->json([
                'message' => 'Anda tidak berhak meninjau revisi ini!'
            ], 403);
        }

        $status = $validated['approved'] ? 'pending' : 'graded';
        $message = $validated['approved'] ? 'Revisi disetujui, siswa bisa mengirim ulang tugas.' : 'Revisi ditolak, siswa tidak bisa mengirim ulang.';
        $notifType = $validated['approved'] ? 'revision_approved' : 'revision_rejected';

        HistoryHelper::log(
            $submission->student_id,
            'revisi_ditinjau',
            'Guru ' . Auth::user()->name . ' telah meninjau revisi tugas "' . $submission->taskAssignment->task->title . '" dan ' . ($validated['approved'] ? 'disetujui' : 'ditolak') . '.'
        );

        $submission->update(['status' => $status]);

        if (!empty($validated['feedback'])) {
            $submission->grading->update(['feedback' => $validated['feedback']]);
        }

        NotificationHelper::send(
            $submission->student_id,
            $notifType,
            'Revisi kamu telah ' . ($validated['approved'] ? 'disetujui!' : 'ditolak!')
        );

        return response()->json([
            'message' => $message,
            'submission' => $submission
        ], 200);
    }

    public function getComplateTask()
    {
        $studentId = Auth::id();

        $completedTasks = TaskSubmission::where('student_id', $studentId)
            ->where('status', 'graded')
            ->where('updated_at', '>=', Carbon::now()->subDays(7))
            ->with(['taskAssignment.task'])
            ->get()
            ->map(function ($submission) {
                return [
                    'task_id' => $submission->taskAssignment->task->id,
                    'task_title' => $submission->taskAssignment->task->title,
                    'graded_at' => $submission->updated_at,
                ];
            });

        return response()->json($completedTasks);
    }

}
