<?php

namespace App\Imports;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class TeacherImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        $user = User::create([
            'name' => $row['name'],
            'email' => $row['email'],
            'password' => Hash::make($row['password']),
            'role' => 'teacher',
            'gender' => $row['gender'],
            'age' => $row['age'],
            'no_tlp' => $row['no_tlp'],
        ]);

        return new Teacher([
            'user_id' => $user->id,
            'department_id' => $row['department_id'],
        ]);
    }
}
