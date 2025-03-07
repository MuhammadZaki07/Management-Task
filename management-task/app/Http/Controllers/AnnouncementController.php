<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Announcement;
use Illuminate\Http\Request;
use App\Helpers\NotificationHelper;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AnnouncementController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $announcements = Announcement::where(function ($query) use ($user) {
            $query->whereJsonContains('sent_to', $user->role)
                ->orWhereJsonContains('sent_to', $user->id)
                ->orWhere('sent_by', $user->id);
        })
            ->get();

        return response()->json([
            'unread' => $announcements->where('read_status', false)->where('sent_by', '!=', $user->id)->values(),
            'read' => $announcements->where('read_status', true)->values()->merge(
                $announcements->where('sent_by', $user->id)->values()
            ),
        ]);
    }

    public function show($id)
    {
        $announcement = Announcement::findOrFail($id);
        if (!$announcement) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }
        $announcement->read_status = true;
        $announcement->save();

        return response()->json($announcement);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'sent_to' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $announcement = Announcement::create([
            'title' => $request->title,
            'message' => $request->message,
            'sent_by' => Auth::id(),
            'sent_to' => json_encode($request->sent_to),
        ]);

        if (isset($request->sent_to['role'])) {
            $role = $request->sent_to['role'];
            if ($role === 'all') {
                $users = User::pluck('id');
            } else {
                $users = User::where('role', $role)->pluck('id');
            }
        } elseif (isset($request->sent_to['users'])) {
            $users = $request->sent_to['users'];
        } elseif (isset($request->sent_to['class'])) {
            $users = User::whereHas('student', function ($query) use ($request) {
                $query->when($request->sent_to['class'] === 'all', function ($q) {
                    $q->whereNotNull('class_id');
                }, function ($q) use ($request) {
                    $q->whereIn('class_id', (array) $request->sent_to['class']);
                });
            })->pluck('id');
        }
         else {
            $users = [];
        }

        foreach ($users as $userId) {
            NotificationHelper::send($userId, 'new_announcement', "Pengumuman baru: {$request->title}");
        }

        return response()->json($announcement, 201);
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $announcement = Announcement::find($id);

        if (!$announcement) {
            return response()->json(['message' => 'Pengumuman tidak ditemukan'], 404);
        }

        $announcement->title = $request->title;
        $announcement->message = $request->message;
        $announcement->sent_by = Auth::id();
        $announcement->save();

        if ($request->has('sent_to') && is_array($request->sent_to)) {
            foreach ($request->sent_to as $group => $userIds) {
                foreach ($userIds as $userId) {
                    NotificationHelper::send($userId, 'announcement', "Pengumuman diperbarui: {$request->title}");
                }
            }
        }

        return response()->json($announcement, 200);
    }

    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);

        if (Auth::id() != $announcement->sent_by && !Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $announcement->delete();

        return response()->json(['message' => 'Announcement deleted successfully']);
    }
}
