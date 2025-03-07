<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    protected $fillable = ['year', 'status'];

    public function classes()
    {
        return $this->hasMany(Classes::class, 'academic_year_id');
    }
}
