<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('class_name', 100);
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->foreignId('homeroom_teacher_id')->nullable()->constrained('teachers')->onDelete('set null');
            $table->foreignId('academic_year_id')->constrained()->onDelete('cascade');
            $table->integer('max_students')->default(30);
            $table->integer('grade_level')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
