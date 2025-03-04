<?php

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Foundation\Inspiring;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

app()->booted(function () {
    app(Schedule::class)->useCache('file');
});

return function (Schedule $schedule) {
    $schedule->command('remind:task-deadline')
        ->everyMinute()
        ->appendOutputTo(storage_path('logs/scheduler.log'));
};
