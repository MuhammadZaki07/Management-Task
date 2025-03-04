<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskAssignment extends Model
{
    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public function class()
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }

}
