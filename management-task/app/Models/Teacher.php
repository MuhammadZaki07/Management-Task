<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Teacher extends Model
{
    protected $fillable = [
        'user_id',
        'department_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function classes(): HasMany
    {
        return $this->hasMany(Classes::class, 'homeroom_teacher_id');
    }

    public function homeroomClasses(): HasMany
    {
        return $this->hasMany(Classes::class, 'homeroom_teacher_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'teacher_id');
    }

    public function taskGrades(): HasMany
    {
        return $this->hasMany(TaskGrade::class, 'teacher_id');
    }

}
