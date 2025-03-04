<?php

namespace App\Http\Controllers;

use App\Services\ClassAssignmentService;

class ClassAssignmentController extends Controller
{
    protected $classAssignmentService;

    public function __construct(ClassAssignmentService $classAssignmentService)
    {
        $this->classAssignmentService = $classAssignmentService;
    }

    public function assign()
    {
        $service = new ClassAssignmentService();
        $service->assignStudentsToClasses();

        return response()->json(['message' => 'Siswa berhasil dimasukkan ke kelas!']);
    }
}
