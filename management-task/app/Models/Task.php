<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'lesson_id', 'teacher_id', 'due_date'];

    public function assignments()
    {
        return $this->hasMany(TaskAssignment::class);
    }
    

    public function submissions()
    {
        return $this->hasMany(TaskSubmission::class);
    }
}
