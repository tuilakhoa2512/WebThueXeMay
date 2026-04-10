<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //  LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không đúng'
            ], 401);
        }

        //  tạo token
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'token' => $token,
            'user' => $user
        ]);
    }

    // Register
public function register(Request $request)
{
    $request->validate([
        'fullname' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:6|confirmed',
        'phone' => 'nullable|string|max:15'
    ]);

    // tạo user
    $user = User::create([
        'role_id' => 2, // mặc định user thường
        'fullname' => $request->fullname,
        'email' => $request->email,
        'password' => $request->password, // đã auto hash nhờ $casts
        'phone' => $request->phone,
        'status' => 1
    ]);

    // tạo token luôn (auto login sau khi register)
    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'message' => 'Đăng ký thành công',
        'token' => $token,
        'user' => $user
    ], 201);
}
}

