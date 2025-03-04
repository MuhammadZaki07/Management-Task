<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassAssignmentController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentImportController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskGradeController;
use App\Http\Controllers\TaskSubmissionController;
use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'registration']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/getData', [AuthController::class, 'getData']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::resource('announcements', AnnouncementController::class);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::resource('departments', DepartementController::class);
    Route::resource('teachers', TeacherController::class);
    Route::resource('students', StudentController::class);
    Route::resource('classes', ClassroomController::class);
    Route::resource('lessons', LessonController::class);
    Route::post('/admins', [AdminController::class, 'store']);
    Route::put('/admins/{id}', [AdminController::class, 'update']);
    Route::get('/students-per-year', [StudentController::class, 'studentsPerYear']);
    Route::get('/gender-statistics', [TeacherController::class, 'getGenderStatistics']);
    Route::post('/students/import', [StudentImportController::class, 'import']);
    Route::post('/import-teachers', [TeacherController::class, 'import']);
    Route::post('/classes/import', [ClassroomController::class, 'import']);
    Route::post('/assign-classes', [ClassAssignmentController::class, 'assign']);
    Route::post('/students/promote', [StudentController::class, 'promoteStudents']);
    Route::delete('/teachers/{id}/force', [TeacherController::class, 'forceDestroy']);
    Route::delete('/students/{id}/force', [StudentController::class, 'forceDestroy']);
    Route::get('/available-homeroom', [TeacherController::class, 'getAvailableHomeroomTeachers']);
});

Route::middleware(['auth:sanctum', 'role:teacher'])->group(function () {
    Route::resource('tasks', TaskController::class);
    Route::resource('task-grading', TaskGradeController::class);
    Route::post('/submissions/{submissionId}/review-revision', [TaskSubmissionController::class, 'reviewRevision']);
});

Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    Route::resource('task-submissions', TaskSubmissionController::class)->only(['store', 'update', 'show', 'destroy']);
    Route::post('/submissions/{submissionId}/request-revision', [TaskSubmissionController::class, 'requestRevision']);
});


