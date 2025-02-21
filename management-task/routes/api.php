<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassesController;
use App\Http\Middleware\AdminMidleware;
use Illuminate\Support\Facades\Route;


Route::get('/user',[AuthController::class,'getData'])->middleware('auth:sanctum');
Route::post('/login',[AuthController::class,'login']);

Route::middleware(['auth:sanctum',AdminMidleware::class])->group(function () {
    Route::resource('class',ClassesController::class);
});
