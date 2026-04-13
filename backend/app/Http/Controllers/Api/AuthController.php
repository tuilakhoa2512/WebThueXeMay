<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password as FacadesPassword;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    //  LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
            'password' => ['required', 'string']
        ], [
            'email.exists' => 'Email không tồn tại'
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
        'fullname' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'unique:users,email'],
        'password' => ['required','confirmed',Password::min(6)
        ],
        'phone' => ['nullable', 'regex:/^[0-9]{9,11}$/']
    ], [
        'phone.regex' => 'Số điện thoại không hợp lệ'
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

public function profile(Request $request)
{
    return response()->json($request->user());
}

public function updateProfile(Request $request)
{
    $user = $request->user();

    $request->validate([
        'fullname' => ['required', 'string', 'max:255'],
        'phone' => ['nullable', 'regex:/^[0-9]{9,11}$/']
    ], [
        'phone.regex' => 'Số điện thoại không hợp lệ'
    ]);

    $user->update([
        'fullname' => $request->fullname,
        'phone' => $request->phone,
    ]);

    return response()->json([
        'message' => 'Cập nhật thông tin thành công',
        'user' => $user
    ]);
}

public function uploadAvatar(Request $request)
{
    $user = $request->user();

    $request->validate([
        'image' => 'required|image|mimes:jpg,jpeg,png|max:2048'
    ]);
    // XÓA ẢNH CŨ (nếu có)
    if ($user->image && Storage::disk('public')->exists($user->image)) {
        Storage::disk('public')->delete($user->image);
    }

    // UPLOAD ẢNH MỚI
    $path = $request->file('image')->store('users', 'public');

    // UPDATE DB
    $user->update([
        'image' => $path
    ]);

    return response()->json([
        'message' => 'Upload avatar thành công',
        'image_url' => asset('storage/' . $path),
        'user' => $user
    ]);
}

public function changePassword(Request $request)
{
    $user = $request->user();

    $request->validate([
        'old_password' => ['required', 'string'],
        'new_password' => ['required','string','confirmed',
            Password::min(6) // Có thể tăng lên tùy ý
                ->letters()
                ->numbers()
                // ->mixedCase()
                // ->symbols()
        ],
    ], [
        'old_password.required' => 'Vui lòng nhập mật khẩu cũ',
        'new_password.required' => 'Vui lòng nhập mật khẩu mới',
        'new_password.confirmed' => 'Xác nhận mật khẩu không khớp',
    ]);
    //check mật khẩu cũ
    if (!Hash::check($request->old_password, $user->password)) {
        return response()->json([
            'message' => 'Mật khẩu cũ không đúng'
        ], 400);
    }

    // không cho trùng mật khẩu cũ
    if (Hash::check($request->new_password, $user->password)) {
        return response()->json([
            'message' => 'Mật khẩu mới không được trùng mật khẩu cũ'
        ], 400);
    }

    $user->update([
        'password' => Hash::make($request->new_password)
    ]);

    return response()->json([
        'message' => 'Đổi mật khẩu thành công'
    ]);
}
}

