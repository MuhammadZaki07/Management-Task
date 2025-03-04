<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Task;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    /**
     * Get all lessons.
     */
    public function index()
    {
        $lessons = Lesson::all();
        return response()->json([
            'status' => 'success',
            'data' => $lessons
        ]);
    }

    /**
     * Store a new lesson.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:lessons,name',
            'curiculumn' => 'required|string',
        ]);

        $lesson = Lesson::create([
            'name' => $request->name,
            'curiculumn' => $request->curiculumn,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Mata pelajaran berhasil ditambahkan',
            'data' => $lesson,
        ]);
    }

    /**
     * Show a specific lesson.
     */
    public function show($id)
    {
        $lesson = Lesson::find($id);
        if (!$lesson) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lesson not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $lesson
        ]);
    }

    /**
     * Update an existing lesson.
     */
    public function update(Request $request, Lesson $lesson)
    {
        $request->validate([
            'name' => 'sometimes|required|string|unique:lessons,name,' . $lesson->id,
            'curiculumn' => 'sometimes|required|string',
        ]);

        $lesson->update([
            'name' => $request->name,
            'curiculumn' => $request->curiculumn,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Mata pelajaran berhasil diperbarui',
            'data' => $lesson,
        ]);
    }

    /**
     * Delete a lesson.
     */
    public function destroy(Request $request)
    {
        $ids = $request->ids;

        if (is_array($ids)) {
            $lessons = Lesson::whereIn('id', $ids)->get();
        } else {
            $lessons = Lesson::where('id', $ids)->get();
        }

        foreach ($lessons as $lesson) {
            if ($lesson->tasks()->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Some lessons still have related tasks!'
                ], 403);
            }
        }

        foreach ($lessons as $lesson) {
            $lesson->delete();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Lessons successfully deleted'
        ]);
    }
}
