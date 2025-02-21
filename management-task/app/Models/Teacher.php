<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = [
        'user_id',
        'departement_id',
        'age',
        'no_tlp',
        'gender'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
