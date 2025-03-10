<?php

namespace App\Services;

use App\Models\Classes;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StudentService
{
    public function promoteStudents($data)
    {
        DB::beginTransaction(); // Mulai transaksi database
        try {
            // Jika opsi 'department', ambil jurusan dan proses semua siswa dalam jurusan itu
            if ($data['option'] == 'department') {
                if (!isset($data['department_id'])) {
                    return response()->json(["status" => "error", "message" => "Department ID tidak diberikan."]);
                }

                $departmentId = $data['department_id'];

                $students = Student::where('department_id', $departmentId)->where('status', 'active')->get();
            } elseif ($data['option'] == 'individual') {
                if (!isset($data['student_ids'])) {
                    return response()->json(["status" => "error", "message" => "Student IDs tidak diberikan."]);
                }

                $studentIds = $data['student_ids'];
                $students = Student::whereIn('id', $studentIds)->where('status', 'active')->get();
            } else {
                $students = Student::where('status', 'active')->get();
            }
            if ($students->isEmpty()) {
                Log::warning("Tidak ada siswa aktif yang ditemukan.");
                return response()->json(["status" => "error", "message" => "Tidak ada siswa aktif yang ditemukan."]);
            }
            foreach ($students as $student) {
                $currentClass = Classes::find($student->class_id);
                if (!$currentClass) {
                    Log::warning("Kelas tidak ditemukan untuk siswa: " . $student->name);
                    continue;
                }

                Log::info("Siswa yang diproses: " . $student->name . " (ID: " . $student->id . ")");
                Log::info("Kelas saat ini: " . $currentClass->class_name);

                if ($currentClass->grade_level == 10) {
                    $newGradeLevel = 11;
                } elseif ($currentClass->grade_level == 11) {
                    $newGradeLevel = 12;
                } elseif ($currentClass->grade_level == 12) {
                    $newGradeLevel = null;
                } else {
                    Log::warning("Kelas tidak dikenali untuk siswa: " . $student->name);
                    continue;
                }

                $newClassName = preg_replace('/\b' . $currentClass->grade_level . '\b/', $newGradeLevel == null ? 'Graduated' : $newGradeLevel, $currentClass->class_name);

                $newClass = Classes::firstOrCreate(
                    [
                        'class_name' => $newClassName,
                        'department_id' => $currentClass->department_id,
                        'grade_level' => $newGradeLevel,
                    ],
                    [
                        'homeroom_teacher_id' => $currentClass->homeroom_teacher_id,
                        'max_students' => $currentClass->max_students
                    ]
                );

                if (!$newClass->exists) {
                    Log::error("Gagal menemukan atau membuat kelas baru: " . $newClassName);
                    continue;
                }

                Log::info("Kelas baru ditemukan atau dibuat: " . $newClass->class_name);

                // Update kelas siswa dan set grade_level menjadi NULL jika lulus
                $student->update(['class_id' => $newClass->id, 'grade_level' => $newGradeLevel]);
                Log::info("Siswa " . $student->name . " (ID: " . $student->id . ") dipindahkan ke kelas " . $newClass->class_name);
            }

            DB::commit(); // Sukses, simpan perubahan
            return response()->json(["status" => "success", "message" => "Siswa berhasil dinaikkan ke kelas berikutnya."]);
        } catch (\Exception $e) {
            DB::rollBack(); // Batalkan transaksi jika terjadi error
            Log::error("Terjadi kesalahan saat memproses promosi siswa: " . $e->getMessage());
            return response()->json(["status" => "error", "message" => "Terjadi kesalahan saat memproses."]);
        }
    }
}
