<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\TaskAssignment;
use App\Models\Student;
use App\Helpers\NotificationHelper;
use Carbon\Carbon;

class RemindTaskDeadline extends Command
{
    protected $signature = 'remind:task-deadline';
    protected $description = 'Mengirim notifikasi kepada siswa yang belum mengumpulkan tugas yang mendekati deadline';

    public function handle()
    {
        $tomorrow = Carbon::now()->addDay()->toDateString();

        $tasks = TaskAssignment::whereHas('task', function ($query) use ($tomorrow) {
            $query->whereDate('due_date', $tomorrow);
        })->get();

        foreach ($tasks as $task) {
            $taskTitle = $task->task->title;
            $studentIds = [];

            if ($task->class_id) {
                $students = Student::where('class_id', $task->class_id)->pluck('user_id')->toArray();
            } elseif ($task->student_id) {
                $students = [$task->student_id];
            } else {
                $this->warn("Tugas '{$taskTitle}' tidak memiliki kelas atau siswa, dilewati.");
                continue;
            }

            $studentsWithoutSubmission = Student::whereIn('user_id', $students)
                ->whereDoesntHave('submissions', function ($query) use ($task) {
                    $query->where('task_assignment_id', $task->id);
                })
                ->pluck('user_id')
                ->toArray();

            if (!empty($studentsWithoutSubmission)) {
                NotificationHelper::sendMultiple(
                    $studentsWithoutSubmission,
                    'task_reminder',
                    "Jangan lupa! Deadline tugas '{$taskTitle}' besok."
                );

                $this->info("Notifikasi dikirim ke " . count($studentsWithoutSubmission) . " siswa untuk tugas '{$taskTitle}'.");
            }
        }

        return Command::SUCCESS;
    }
}
