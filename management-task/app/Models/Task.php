<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'lesson_id', 'teacher_id', 'due_date', 'files'];
    protected $casts = [
        'files' => 'array',
    ];
    public function submissions()
    {
        return $this->hasMany(TaskSubmission::class, 'task_id', 'id');
    }


    public function assignments()
    {
        return $this->hasMany(TaskAssignment::class);
    }

    public function assignedClasses()
    {
        return $this->hasManyThrough(Classes::class, TaskAssignment::class, 'task_id', 'id', 'id', 'class_id');
    }


    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }



    public function lesson()
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }
    public function class()
    {
        return $this->belongsTo(Classes::class);
    }
}
