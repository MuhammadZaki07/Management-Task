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
                Log::info("Jurusan yang dipilih: " . $departmentId);  // Debugging log

                // Ambil semua siswa dalam jurusan yang dipilih
                $students = Student::where('department_id', $departmentId)->where('status', 'active')->get();

                // Log untuk melihat apakah siswa ditemukan
                Log::info("Jumlah siswa dalam jurusan yang dipilih: " . $students->count());
            }
            // Jika opsi 'individual', ambil siswa berdasarkan ID individu
            elseif ($data['option'] == 'individual') {
                if (!isset($data['student_ids'])) {
                    return response()->json(["status" => "error", "message" => "Student IDs tidak diberikan."]);
                }

                $studentIds = $data['student_ids'];
                Log::info("Murid yang dipilih untuk dipromosikan: " . implode(", ", $studentIds));  // Debugging log

                // Ambil siswa berdasarkan ID individu
                $students = Student::whereIn('id', $studentIds)->where('status', 'active')->get();

                // Log untuk melihat apakah siswa ditemukan
                Log::info("Jumlah siswa yang ditemukan: " . $students->count());
            }
            // Jika opsi 'all', proses semua siswa
            else {
                $students = Student::where('status', 'active')->get();
            }

            // Jika tidak ada siswa yang ditemukan
            if ($students->isEmpty()) {
                Log::warning("Tidak ada siswa aktif yang ditemukan.");
                return response()->json(["status" => "error", "message" => "Tidak ada siswa aktif yang ditemukan."]);
            }

            // Proses untuk setiap siswa
            foreach ($students as $student) {
                // Ambil kelas siswa yang sedang aktif
                $currentClass = Classes::find($student->class_id);
                if (!$currentClass) {
                    Log::warning("Kelas tidak ditemukan untuk siswa: " . $student->name);
                    continue;
                }

                Log::info("Siswa yang diproses: " . $student->name . " (ID: " . $student->id . ")");
                Log::info("Kelas saat ini: " . $currentClass->class_name);

                // Tentukan kelas baru berdasarkan kelas saat ini
                if ($currentClass->grade_level == 10) {
                    $newGradeLevel = 11;
                } elseif ($currentClass->grade_level == 11) {
                    $newGradeLevel = 12;
                } elseif ($currentClass->grade_level == 12) {
                    $newGradeLevel = null;  // Setel menjadi NULL untuk siswa yang sudah lulus
                } else {
                    Log::warning("Kelas tidak dikenali untuk siswa: " . $student->name);
                    continue;
                }

                // Cek apakah kelas baru sudah ada, jika belum buat
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
