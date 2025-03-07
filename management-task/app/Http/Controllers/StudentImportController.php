<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;
use App\Imports\StudentsImport;
class StudentImportController extends Controller
{
    public function import(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:xlsx,xls',
            'department_id' => 'required|exists:departments,id',
            'class_id' => 'required|exists:classes,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 400);
        }

        try {
            Excel::import(new StudentsImport($request->department_id, $request->class_id), $request->file('file'));

            return response()->json([
                'status' => 'success',
                'message' => 'Students imported successfully!',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => "Import failed: " . $e->getMessage(),
            ], 400);
        }

    }
}
