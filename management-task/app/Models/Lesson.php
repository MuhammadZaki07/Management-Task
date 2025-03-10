<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = [
        'name',
        'curiculumn'
    ];

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'department_lesson');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function class()
    {
        return $this->belongsTo(Classes::class);
    }
}
