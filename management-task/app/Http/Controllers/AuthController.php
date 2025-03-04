<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Admin;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            return $this->response(400, 'Invalid field(s) in request', [], $validator->errors());
        }

        $user = User::where('email', $request->email)->first();
        if ($user && Hash::check($request->password, $user->password)) {
            $token = $user->createToken('auth_token')->plainTextToken;
            return $this->response(200, 'success', 'Successfully logged in', [
                'user' => $user,
                'token' => $token
            ]);
        }
        return $this->response(401, 'authentication_failed', 'The username or password you entered is incorrect');
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
}
