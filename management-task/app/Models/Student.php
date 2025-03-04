<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'department_id',
        'class_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function class()
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }
    public function submissions()
    {
        return $this->hasMany(TaskSubmission::class, 'student_id');
    }


    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
