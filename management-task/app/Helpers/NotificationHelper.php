<?php

namespace App\Helpers;

use App\Models\Notification;

class NotificationHelper
{
    public static function send($userId, $type, $message)
    {
        Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'message' => $message,
        ]);
    }

    public static function sendMultiple(array $userIds, string $type, string $message)
    {
        $notifications = array_map(fn($userId) => [
            'user_id' => $userId,
            'type' => $type,
            'message' => $message,
            'created_at' => now(),
            'updated_at' => now(),
        ], $userIds);

        Notification::insert($notifications);
    }
}
