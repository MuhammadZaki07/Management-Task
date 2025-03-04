<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartementController extends Controller
{
    public function index()
    {
        return response()->json(['status' => 'success', 'data' => Department::all()]);
    }

    public function show($id)
    {
        $department = Department::find($id);
        if (!$department) {
            return response()->json(['status' => 'error', 'message' => 'Department not found'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $department]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'department_name' => 'required|string|unique:departments,department_name',
            'lesson_ids' => 'array',
            'lesson_ids.*' => 'exists:lessons,id',
        ]);

        $department = Department::create([
            'department_name' => $request->department_name,
        ]);

        if ($request->has('lesson_ids')) {
            $department->lessons()->attach($request->lesson_ids);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Departemen berhasil dibuat',
            'data' => $department->load('lessons'),
        ], 201);
    }

    public function update(Request $request, Department $department)
    {
        $request->validate([
            'department_name' => 'sometimes|required|string|unique:departments,department_name,' . $department->id,
            'lesson_ids' => 'array',
            'lesson_ids.*' => 'exists:lessons,id',
        ]);

        $department->update([
            'department_name' => $request->department_name,
        ]);

        if ($request->has('lesson_ids')) {
            $department->lessons()->sync($request->lesson_ids);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Departemen berhasil diperbarui',
            'data' => $department->load('lessons'),
        ], 200);
    }

    public function destroy(Request $request)
    {
        $ids = is_array($request->id) ? $request->id : [$request->id];

        $departments = Department::whereIn('id', $ids)->get();

        if ($departments->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Department not found'
            ], 404);
        }

        foreach ($departments as $department) {
            if ($department->classes()->exists() || $department->teachers()->exists() || $department->lessons()->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete one or more departments because they still have related data'
                ], 400);
            }
        }

        Department::whereIn('id', $ids)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Department(s) deleted successfully'
        ]);
    }
}
