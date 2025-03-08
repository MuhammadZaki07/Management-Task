<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskSubmission extends Model
{
    protected $fillable = [
        'task_assignment_id',
        'student_id',
        'submission_text',
        'submission_file',
        'status',
    ];

    public function taskAssignment()
    {
        return $this->belongsTo(TaskAssignment::class, 'task_assignment_id');
    }

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id', 'id');
    }


    public function student()
    {
        return $this->belongsTo(Student::class);
    }


    public function grading()
    {
        return $this->hasOne(TaskGrade::class, 'task_submission_id');
    }

    public function canRequestRevision()
    {
        return $this->grading && $this->grading->score < 75 && $this->status === 'pending';
    }
}
