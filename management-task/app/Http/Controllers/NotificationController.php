<?php

namespace App\Http\Controllers;

use App\Events\NewNotification;
use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'notifications' => $notifications
        ]);
    }

    public function markAsRead($id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$notification) {
            return response()->json(['status' => 'error', 'message' => 'Notification not found'], 404);
        }

        $notification->update(['is_read' => true]);

        return response()->json(['status' => 'success', 'message' => 'Notification marked as read']);
    }

    public function sendNotification(Request $request)
    {
        $notification = Notification::create([
            'user_id' => $request->user_id,
            'message' => $request->message,
            'is_read' => false,
        ]);

        broadcast(new NewNotification($notification))->toOthers();

        return response()->json(['success' => true, 'message' => 'Notification sent!', 'notification' => $notification]);
    }

    public function destroy(Request $request)
    {
        $ids = $request->input('ids');

        if (!is_array($ids) || empty($ids)) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 400);
        }

        $deleted = Notification::whereIn('id', $ids)
            ->where('user_id', Auth::id())
            ->delete();

        if ($deleted) {
            return response()->json(['status' => 'success', 'message' => 'Notifications deleted']);
        } else {
            return response()->json(['status' => 'error', 'message' => 'No notifications found'], 404);
        }
    }
}
