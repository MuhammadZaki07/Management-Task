<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classes extends Model
{
    protected $table = 'classes';

    protected $fillable = [
        'class_name',
        'department_id',
        'homeroom_teacher_id',
        'max_students',
        'grade_level',
        'academic_year_id'
    ];

    public function students()
    {
        return $this->hasMany(Student::class, 'class_id');
    }

    public function homeroomTeacher()
    {
        return $this->belongsTo(Teacher::class, 'homeroom_teacher_id')->with('user');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }
    public function announcements()
    {
        return $this->hasMany(Announcement::class, 'class_id');
    }


    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }
}
