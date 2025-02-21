<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Admins;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function getData(Request $request)
    {
        return response()->json($request->user());
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|string',
            'password' => 'password|min:8|string|required'
        ]);

        if ($validator->fails()) {
            return $this->response(400, 'Invalid field(s) in request', [], $validator->errors());
        }

        $user = User::where('email', $request->email)->first();
        if ($user && Hash::check($request->password, $user->password)) {
            $token = $user->createToken('auth_token')->plainTextToken;
            return $this->response(200, 'success', 'succesfuly login!!', [
                'data' => $user,
                'token' => $token
            ]);
        }
        return $this->response( 401, 'authentication_failed', 'The username or password you entered is incorrect');
    }

    public function regristation(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,teacher,student',
            'gender' => 'required|string',
            'telephone' => 'required|string',
            'age' => 'nullable|integer',
            'department_id' => 'exists:departement,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role
        ]);

        if($validation->fails()){
            return $this->response(400, 'Invalid field(s) in request', [], $validation->errors());
        }

        if ($request->role === 'admin') {
            Admin::create([
                'user_id' => $user->id,
                'gender' => $request->gender,
                'age' => $request->age,
                'no_tlp' => $request->telephone
            ]);
        } elseif ($request->role === 'teacher') {
            Teacher::create([
                'user_id' => $user->id,
                'gender' => $request->gender,
                'age' => $request->age,
                'no_tlp' => $request->telephone,
                'departement_id' => $request->departement_id
            ]);
        } elseif ($request->role === 'student') {
            Student::create([
                'user_id' => $user->id,
                'departement_id' => $request->departement_id,
                'class_id' => $request->class_id,
                'gender' => $request->gender,
                'no_tlp' => $request->telephone,
                'age' => $request->age
            ]);
        }

        return response()->json(['message' => 'User created successfully!']);
    }

    public function logout(Request $request){
        $user = $request->user();
        if ($user) {
            $user->currentAccessToken()->delete();
            return $this->response(200, 'success', 'Logout successful');
        }
        return $this->response(401, "invalid_token", "Invalid or expired token");
    }
}
