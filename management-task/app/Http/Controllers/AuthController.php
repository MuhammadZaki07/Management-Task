<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Admin;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    public function getData(Request $request)
    {
        return $this->response(200, 'success', 'User data retrieved successfully', ['user' => $request->user()]);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|string',
            'password' => 'required|string|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'message' => 'Invalid field(s) in request',
                'errors' => $validator->errors()
            ], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Authentication failed',
                'errors' => ['email' => 'This email is not registered.']
            ], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 401,
                'message' => 'Authentication failed',
                'errors' => ['password' => 'The password you entered is incorrect.']
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'message' => 'Successfully logged in',
            'data' => [
                'user' => $user,
                'token' => $token
            ]
        ], 200);
    }

    public function registration(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,teacher,student',
            'gender' => 'required|in:L,P',
            'no_tlp' => 'required|string|max:15',
            'age' => 'nullable|integer|min:18',
            'department_id' => 'nullable|exists:departments,id',
            'class_id' => 'nullable|exists:classes,id'
        ]);

        if ($validation->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validation->errors()], 400);
        }

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'gender' => $request->gender,
                'age' => $request->age,
                'no_tlp' => $request->no_tlp,
            ]);

            if ($request->role === 'admin') {
                Admin::create(['user_id' => $user->id]);
            } elseif ($request->role === 'teacher') {
                Teacher::create([
                    'user_id' => $user->id,
                    'department_id' => $request->department_id,
                ]);
            } elseif ($request->role === 'student') {
                Student::create([
                    'user_id' => $user->id,
                    'department_id' => $request->department_id,
                    'class_id' => $request->class_id,
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'User registered successfully',
                'data' => $user
            ], 201);
        });
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->currentAccessToken()->delete();
            return $this->response(200, 'success', 'Logout successful');
        }
        return $this->response(401, 'invalid_token', 'Invalid or expired token');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|max:255|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:15',
            'gender' => 'required|in:L,P',
            'password' => 'nullable|min:6|confirmed',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->no_tlp = $request->phone;
        $user->gender = $request->gender;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully.',
            'logout' => $request->filled('password'),
        ], 200);
    }
    public function index()
    {
        $admins = User::where('role', 'admin')->get();
        return response()->json($admins);
    }

    public function destroy(Request $request)
    {
        $ids = $request->input('ids');
        if (!$ids || !is_array($ids)) {
            return response()->json(['message' => 'No admins selected for deletion.'], 400);
        }

        User::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Admins deleted successfully.']);
    }

    public function updateAdmin(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
        ]);

        $admin = User::where('role', 'admin')->find($id);
        if (!$admin) {
            return response()->json(['message' => 'Admin tidak ditemukan'], 404);
        }

        $admin->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json(['message' => 'Admin berhasil diperbarui', 'admin' => $admin]);
    }
}
