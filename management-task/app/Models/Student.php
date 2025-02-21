<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'departement_id',
        'class_id',
        'gender',
        'age',
        'no_tlp'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
