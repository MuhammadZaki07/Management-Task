<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentRecipient extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_id', 'class_id', 'student_id'
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function class()
    {
        return $this->belongsTo(Classes::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
