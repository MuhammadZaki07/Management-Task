<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskComment extends Model
{
    use HasFactory;
    protected $table = "task_comments";

    protected $fillable = ['assignment_id', 'student_id', 'comment'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
