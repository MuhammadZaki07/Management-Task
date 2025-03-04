<?php
namespace App\Helpers;

use App\Models\History;

class HistoryHelper
{
    public static function log($userId, $action, $details)
    {
        History::create([
            'user_id' => $userId,
            'action' => $action,
            'details' => $details,
        ]);
    }
}
