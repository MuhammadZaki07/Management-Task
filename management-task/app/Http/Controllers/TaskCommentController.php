<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\TaskComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskCommentController extends Controller
{
    public function store(Request $request, $assignmentId)
    {
        $request->validate([
            'comment' => 'required|string|max:1000',
        ]);

        $student = Auth::user()->student;
        $assignment = Assignment::findOrFail($assignmentId);

        if (!$assignment->classes()->where('class_id', $student->class_id)->exists()) {
            return response()->json(['message' => 'You are not allowed to comment on this task.'], 403);
        }

        TaskComment::create([
            'assignment_id' => $assignmentId,
            'student_id' => $student->id,
            'comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Comment added successfully!']);
    }

    public function index($assignmentId)
    {
        $student = Auth::user()->student;
        $assignment = Assignment::findOrFail($assignmentId);

        if (!$assignment->classes()->where('class_id', $student->class_id)->exists()) {
            return response()->json(['message' => 'You are not allowed to view these comments.'], 403);
        }

        $comments = TaskComment::where('assignment_id', $assignmentId)
            ->with('student.user')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($comments);
    }
}
