<?php

namespace App\Http\Controllers;

use App\Helpers\HistoryHelper;
use App\Models\TaskGrade;
use Illuminate\Http\Request;
use App\Models\TaskSubmission;
use App\Helpers\NotificationHelper;
use Illuminate\Support\Facades\Auth;

class TaskGradeController extends Controller
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
            'task_submission_id' => 'required|exists:task_submissions,id',
            'score' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);

        $teacherId = Auth::user()->teacher->id;
        $grading = TaskGrade::where('task_submission_id', $validated['task_submission_id'])->first();

        if ($grading) {
            $grading->update([
                'score' => $validated['score'],
                'feedback' => $validated['feedback'] ?? $grading->feedback,
            ]);
            $message = 'Nilai revisi telah diperbarui!';
        } else {
            $grading = TaskGrade::create([
                'task_submission_id' => $validated['task_submission_id'],
                'teacher_id' => $teacherId,
                'score' => $validated['score'],
                'feedback' => $validated['feedback'] ?? null,
            ]);
            $message = 'Tugas berhasil dinilai!';
        }

        if ($grading->taskSubmission) {
            HistoryHelper::log(
                $grading->taskSubmission->student_id,
                'tugas_dinilai',
                "Tugas '{$grading->taskSubmission->task->title}' dinilai oleh {$grading->teacher->name} dengan nilai {$validated['score']}" // Detail aksi
            );

            $grading->taskSubmission->update(['status' => 'graded']);

            NotificationHelper::send(
                $grading->taskSubmission->student_id,
                'task_graded',
                'Tugas kamu telah dinilai oleh ' . Auth::user()->name
            );
        }

        return response()->json([
            'message' => $message,
            'grading' => $grading
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
            'score' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);

        $teacherId = Auth::user()->teacher->id;

        $grading = TaskGrade::findOrFail($id);

        if ($grading->teacher_id !== $teacherId) {
            return response()->json([
                'message' => 'Anda tidak berhak mengedit nilai ini!'
            ], 403);
        }

        $oldScore = $grading->score;
        $oldFeedback = $grading->feedback;
        $newScore = $validated['score'];
        $newFeedback = $validated['feedback'] ?? $oldFeedback;

        HistoryHelper::log(
            $grading->taskSubmission->student_id,
            'nilai_diperbarui',
            "Nilai untuk tugas '{$grading->taskSubmission->task->title}' diperbarui dari {$oldScore} ke {$newScore}. Feedback: {$oldFeedback} => {$newFeedback}" // Detail aksi
        );

        $grading->update([
            'score' => $newScore,
            'feedback' => $newFeedback,
        ]);

        return response()->json([
            'message' => 'Nilai berhasil diperbarui!',
            'grading' => $grading
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
