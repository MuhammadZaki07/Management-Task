<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassAssignmentController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentImportController;
use App\Http\Controllers\TaskCommentController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskGradeController;
use App\Http\Controllers\TaskSubmissionController;
use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/getData', [AuthController::class, 'getData']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::resource('announcements', AnnouncementController::class);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::put('/user/update/{id}', [AuthController::class, 'update']);
    Route::resource('teachers', TeacherController::class);
    Route::resource('classes', ClassroomController::class);
    Route::resource('students', StudentController::class);
    Route::resource('lessons', LessonController::class);
    Route::post('/assignments/grade/{id}', [AssignmentController::class, 'grade']);
    Route::get('/download', [AssignmentController::class, 'download']);
    Route::get('/assignments/{id}', [AssignmentController::class, 'show']);
    Route::post('/assignments/{assignment}/comment', [TaskCommentController::class, 'store']);
    Route::get('/assignments/{assignment}/comments', [TaskCommentController::class, 'index']);
    Route::get('/assignments/{id}/submissions', [AssignmentController::class, 'getSubmissions']);
    Route::post('/send-notification', [NotificationController::class, 'sendNotification']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::resource('departments', DepartementController::class);
    Route::post('/register', [AuthController::class, 'registration']);
    Route::delete('/admins/destroy', [AuthController::class, 'destroy']);
    Route::put('/adminsUpdate/{id}', [AuthController::class, 'updateAdmin']);
    Route::get('/users', [AuthController::class, 'index']);
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
    Route::post('/students/force-destroy', [StudentController::class, 'forceDestroy']);
    Route::get('/available-homeroom', [TeacherController::class, 'getAvailableHomeroomTeachers']);
});

Route::middleware(['auth:sanctum', 'role:teacher'])->group(function () {
    Route::get('tasks/teacher/chart', [AssignmentController::class, 'getTaskChartData']);
    Route::get('/teacher', [TeacherController::class, 'profile']);
    Route::get('/assignments', [AssignmentController::class, 'index']);
    Route::post('/assignments', [AssignmentController::class, 'store']);
    Route::put('/assignments/{id}', [AssignmentController::class, 'update']);
    Route::delete('/assignments/{id}', [AssignmentController::class, 'destroy']);
    Route::post('/submissions/{submissionId}/grade', [AssignmentController::class, 'gradeSubmission']);
    Route::post('/submissions/{submissionId}/review-revision', [AssignmentController::class, 'reviewRevision']);
    Route::post('/submissions/{submissionId}/handle-revision', [AssignmentController::class, 'handleRevision']);
});

Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    Route::get('/profile', [StudentController::class, 'profile']);
    Route::get('/student-id', [StudentController::class, 'getStudentId']);
    Route::get('/tasks-student/scores', [StudentController::class, 'getTasksByScore']);
    Route::get('/student-assignments', [AssignmentController::class, 'studentAssignments']);
    Route::post('/assignments/{assignmentId}/submit', [AssignmentController::class, 'submit']);
    Route::delete('/assignments/{assignmentId}/delete', [AssignmentController::class, 'deleteSubmission']);
    Route::post('/submissions/{submissionId}/request-revision', [AssignmentController::class, 'requestRevision']);
    Route::get('/assessments/getvalue', [AssignmentController::class, 'getValueTask']);
    Route::get('/completed-tasks', [AssignmentController::class, 'getCompletedTasks']);
});
