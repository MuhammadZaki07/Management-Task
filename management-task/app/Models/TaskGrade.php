<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskGrade extends Model
{
    protected $fillable = [
        'task_submission_id',
        'teacher_id',
        'score',
        'feedback',
    ];

    public function taskSubmission()
    {
        return $this->belongsTo(TaskSubmission::class, 'task_submission_id');
    }
}
