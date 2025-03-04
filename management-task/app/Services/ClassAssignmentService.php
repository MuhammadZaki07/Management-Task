<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Classes;
use App\Models\Department;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;

class ClassAssignmentService
{
    public function assignStudentsToClasses()
    {
        return DB::transaction(function () {
            $students = Student::whereNull('class_id')->where('status', 'active')->get();
            $departments = Department::pluck('department_name', 'id')->toArray();

            if (empty($departments)) {
                return ['status' => 'error', 'message' => 'Tidak ada jurusan yang tersedia'];
            }

            // Mapping nama jurusan ke singkatan
            $departmentShortNames = [
                'Rekayasa Perangkat Lunak'     => 'RPL',
                'Teknik Komputer dan Jaringan' => 'TKJ',
                'Multimedia'                   => 'MM',
                'Akuntansi dan Keuangan Lembaga' => 'AKL',
                'Perhotelan'                   => 'PH',
                'Teknik Kendaraan Ringan'      => 'TKR',
                'Teknik Elektronika Industri'  => 'TEI',
                'Tata Boga'                    => 'TB',
                'Desain Komunikasi Visual'     => 'DKV',
                'Farmasi'                       => 'FAR',
            ];

            $existingClasses = Classes::all()->groupBy('department_id');
            $classCapacity = [];

            foreach ($existingClasses as $deptId => $classList) {
                foreach ($classList as $class) {
                    $classCapacity[$class->id] = $class->students()->count();
                }
            }

            foreach ($students as $student) {
                if (!array_key_exists($student->department_id, $departments)) {
                    continue;
                }
                $departmentFullName = $departments[$student->department_id];
                $departmentShortName = $departmentShortNames[$departmentFullName] ?? substr($departmentFullName, 0, 3);
                $gradeLevel = 10;
                $availableClass = null;

                if (isset($existingClasses[$student->department_id])) {
                    foreach ($existingClasses[$student->department_id] as $class) {
                        if ($class->grade_level == $gradeLevel && (($classCapacity[$class->id] ?? 0) < $class->max_students)) {
                            $availableClass = $class;
                            break;
                        }
                    }
                }

                if (!$availableClass) {
                    $existingClassNames = isset($existingClasses[$student->department_id])
                        ? $existingClasses[$student->department_id]->pluck('class_name')->toArray()
                        : [];
                    $nextClassLetter = $this->getNextClassLetter($existingClassNames, $gradeLevel, $departmentShortName);

                    $homeroomTeacher = Teacher::where('department_id', $student->department_id)->inRandomOrder()->first();

                    $availableClass = Classes::create([
                        'class_name'      => "{$gradeLevel}-{$departmentShortName}-{$nextClassLetter}",
                        'department_id'   => $student->department_id,
                        'homeroom_teacher_id' => $homeroomTeacher ? $homeroomTeacher->id : null,
                        'max_students'    => 30,
                        'grade_level'     => $gradeLevel
                    ]);

                    if (!isset($existingClasses[$student->department_id])) {
                        $existingClasses[$student->department_id] = collect();
                    }
                    $existingClasses[$student->department_id][] = $availableClass;
                    $classCapacity[$availableClass->id] = 0;
                }

                $student->class_id = $availableClass->id;
                $student->save();
                $classCapacity[$availableClass->id]++;
            }

            return ['status' => 'success', 'message' => 'Siswa berhasil dibagi ke dalam kelas'];
        });
    }

    private function getNextClassLetter($existingClassNames, $gradeLevel, $departmentShortName)
    {
        $alphabet = range('A', 'Z');
        $usedLetters = [];

        foreach ($existingClassNames as $name) {
            if (preg_match("/{$gradeLevel}-{$departmentShortName}-([A-Z])$/", $name, $matches)) {
                $usedLetters[] = $matches[1] ?? '';
            }
        }

        foreach ($alphabet as $letter) {
            if (!in_array($letter, $usedLetters)) {
                return $letter;
            }
        }

        return 'Z';
    }
}
