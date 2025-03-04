<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('students')->truncate();
        DB::table('users')->where('role', 'student')->delete(); // Hanya hapus siswa
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $students = [
            ['name' => 'Ahmad', 'email' => 'ahmad@example.com', 'password' => 'password', 'gender' => 'L', 'age' => 16, 'no_tlp' => '08123456789', 'department_id' => 1, 'class_id' => null],
            ['name' => 'Budi', 'email' => 'budi@example.com', 'password' => 'password', 'gender' => 'L', 'age' => 17, 'no_tlp' => '08123456788', 'department_id' => 1, 'class_id' => null],
            ['name' => 'Citra', 'email' => 'citra@example.com', 'password' => 'password', 'gender' => 'P', 'age' => 16, 'no_tlp' => '08123456787', 'department_id' => 2, 'class_id' => null],
        ];

        foreach ($students as $data) {
            // Cek apakah email sudah ada
            $user = User::where('email', $data['email'])->first();

            if (!$user) {
                $user = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Hash::make($data['password']),
                    'role' => 'student',
                    'gender' => $data['gender'],
                    'age' => $data['age'],
                    'no_tlp' => $data['no_tlp'],
                ]);
            }

            Student::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'department_id' => $data['department_id'],
                    'class_id' => $data['class_id'],
                ]
            );
        }
    }

}
