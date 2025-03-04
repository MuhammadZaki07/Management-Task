<?php

namespace App\Imports;

use App\Models\Classes;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Validator;

class ClassesImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        $validator = Validator::make($row, [
            'class_name' => 'required|string|unique:classes,class_name',
            'department_id' => 'required|exists:departments,id',
            'homeroom_teacher_id' => 'nullable|exists:teachers,id',
            'max_students' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return null;
        }

        return new Classes([
            'class_name' => $row['class_name'],
            'department_id' => $row['department_id'],
            'homeroom_teacher_id' => $row['homeroom_teacher_id'],
            'max_students' => $row['max_students']
        ]);
    }
}
