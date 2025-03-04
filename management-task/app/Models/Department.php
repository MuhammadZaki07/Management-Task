<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['department_name'];

    public function lessons()
    {
        return $this->belongsToMany(Lesson::class, 'department_lesson');
    }
}
