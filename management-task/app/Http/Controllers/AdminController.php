<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Http\Request;
use App\Helpers\HistoryHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'gender' => 'required|in:L,P',
            'age' => 'required|integer|min:18',
            'no_tlp' => 'required|string|max:15|unique:users,no_tlp',
        ]);

        return DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'admin',
                'gender' => $validated['gender'],
                'age' => $validated['age'],
                'no_tlp' => $validated['no_tlp'],
            ]);

            Admin::create(['user_id' => $user->id]);

            HistoryHelper::log(
                Auth::user()->id,
                'admin_created',
                'Admin baru telah dibuat: ' . $validated['name'],
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Admin created successfully',
                'data' => $user
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $admin = Admin::where('user_id', $id)->first();
        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Admin not found'], 404);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:6',
            'gender' => 'sometimes|in:L,P',
            'age' => 'sometimes|integer|min:18',
            'no_tlp' => 'required|string|max:15|unique:users,no_tlp',
        ]);

        return DB::transaction(function () use ($user, $validated) {
            $oldData = $user->toArray();

            $user->update([
                'name' => $validated['name'] ?? $user->name,
                'email' => $validated['email'] ?? $user->email,
                'password' => isset($validated['password']) ? Hash::make($validated['password']) : $user->password,
                'gender' => $validated['gender'] ?? $user->gender,
                'age' => $validated['age'] ?? $user->age,
                'no_tlp' => $validated['no_tlp'] ?? $user->no_tlp,
            ]);

            HistoryHelper::log(
                Auth::user()->id,
                'admin_updated',
                'Admin ' . $user->name . ' telah diperbarui.',
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Admin updated successfully',
                'data' => $user
            ]);
        });
    }

    public function delete($id)
    {
        $admin = Admin::where('user_id', $id)->first();

        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'Admin not found'], 404);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
        }

        if ($user->tasks()->exists()) {
            return response()->json(['status' => 'error', 'message' => 'Admin masih memiliki tugas yang diberikan!'], 403);
        }

        if ($user->announcements()->exists()) {
            return response()->json(['status' => 'error', 'message' => 'Admin masih memiliki pengumuman yang dibuat!'], 403);
        }

        return DB::transaction(function () use ($user, $admin) {
            $oldData = $user->toArray();
            $adminName = $user->name;

            $user->delete();
            $admin->delete();

            HistoryHelper::log(
                Auth::user()->id,
                'admin_deleted',
                'Admin ' . $adminName . ' telah dihapus.'
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Admin deleted successfully'
            ]);
        });
    }

}
