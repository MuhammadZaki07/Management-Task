<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', [
                'task_graded', 'revision_approved', 'revision_rejected',
                'new_task', 'new_announcement', 'submission_received',
                'revision_requested', 'system_alert','task_deleted','message','task_reminder','teacher_deleted','assigned_as_homeroom','homeroom_removed'
            ]);
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
