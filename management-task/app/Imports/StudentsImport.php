<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;

class StudentsImport implements ToModel, WithHeadingRow
{
    private $departmentId;
    private $classId;
    private $duplicateEmails = [];

    public function __construct($departmentId, $classId)
    {
        $this->departmentId = $departmentId;
        $this->classId = $classId;
    }

    public function model(array $row)
    {
        if (User::where('email', $row['email'])->exists() || in_array($row['email'], $this->duplicateEmails)) {
            throw new \Exception("Duplicate email found: {$row['email']}");
        }

        $this->duplicateEmails[] = $row['email'];

        $user = User::create([
            'name' => $row['name'],
            'email' => $row['email'],
            'password' => Hash::make($row['password'] ?? 'password123'),
            'role' => 'student',
            'age' => $row['age'] ?? null,
            'no_tlp' => $row['no_tlp'] ?? null,
            'gender' => $row['gender'] ?? null,
        ]);


        return new Student([
            'user_id' => $user->id,
            'department_id' => $this->departmentId,
            'class_id' => $this->classId,
        ]);
    }
}
