<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\VerificationCode;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;

class OtpController extends Controller
{
    // 1. GỬI OTP
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $email = $request->email;

        // xóa OTP cũ
        VerificationCode::where('contact', $email)->delete();

        // tạo OTP
        $otp = rand(100000, 999999);

        VerificationCode::create([
            'contact' => $email,
            'otp_code' => $otp,
            'expired_at' => now()->addMinutes(5),
            'is_used' => 0
        ]);

        // gửi mail (test có thể dùng log)
        Mail::raw("Mã OTP của bạn là: $otp", function ($message) use ($email) {
            $message->to($email)
                ->subject('OTP xác thực');
        });

        return response()->json([
            'message' => 'Đã gửi OTP'
        ]);
    }

    // verify OTP
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp_code' => 'required'
        ]);

        $otp = VerificationCode::where('contact', $request->email)
            ->where('otp_code', $request->otp_code)
            ->where('is_used', 0)
            ->where('expired_at', '>', now())
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'OTP không hợp lệ hoặc đã hết hạn'
            ], 400);
        }

        // đánh dấu đã dùng
        $otp->update(['is_used' => 1]);

        return response()->json([
            'message' => 'Xác thực OTP thành công'
        ]);
    }

    // Reset password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp_code' => 'required',
            'password' => 'required|confirmed|min:6'
        ]);

        $otp = VerificationCode::where('contact', $request->email)
            ->where('otp_code', $request->otp_code)
            ->where('is_used', 1) // phải verify trước
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'OTP chưa được xác thực'
            ], 400);
        }

        $user = User::where('email', $request->email)->first();

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'message' => 'Đổi mật khẩu thành công'
        ]);
    }
}