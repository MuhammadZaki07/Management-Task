<?php

namespace App\Imports;

use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class StudentsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        $user = User::create([
            'name' => $row['name'],
            'email' => $row['email'],
            'password' => Hash::make($row['password']),
            'role' => 'student',
            'gender' => $row['gender'],
            'age' => $row['age'],
            'no_tlp' => $row['no_tlp'],
        ]);

        return new Student([
            'user_id' => $user->id,
            'department_id' => $row['department_id'],
            'class_id' => null,
        ]);
    }
}
