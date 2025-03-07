<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function getAcademicYears()
    {
        $academicYears = AcademicYear::where('status', 'active')->get(['id', 'year']);
        return response()->json($academicYears);
    }
}
