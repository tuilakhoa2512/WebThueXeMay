<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rental;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    //Thanh toán bằng tiền mặt
    public function cashPayment(Request $request)
    {
        $request->validate([
            'rental_id' => 'required|exists:rentals,id'
        ]);

        $user = $request->user();

        $rental = Rental::find($request->rental_id);

        if (!$rental) {
            return response()->json(['message' => 'Không tìm thấy rental'], 404);
        }

        if ($rental->user_id != $user->id) {
            return response()->json(['message' => 'Không có quyền'], 403);
        }

        if ($rental->getRawOriginal('status') != 0) {
            return response()->json(['message' => 'Rental không hợp lệ'], 400);
        }

        // tạo payment nếu chưa có
        $payment = Payment::firstOrCreate(
            ['rental_id' => $rental->id],
            [
                'amount' => $rental->total_price,
                'payment_method' => 'cash',
                'status' => 0
            ]
        );

        DB::beginTransaction();

        try {
            $payment->update([
                'status' => 1 // paid
            ]);

            $rental->update([
                'status' => 1 // confirmed
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Thanh toán tiền mặt thành công',
                'payment' => $payment
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi hệ thống'], 500);
        }
    }

    //Tạo link thanh toán VNPay
    public function createVnpay(Request $request, $rental_id)
    {
        $user = $request->user();
    
        $rental = Rental::find($rental_id);
    
        if (!$rental) {
            return response()->json(['message' => 'Không tìm thấy rental'], 404);
        }
    
        if ($rental->user_id != $user->id) {
            return response()->json(['message' => 'Không có quyền'], 403);
        }
    
        if ($rental->getRawOriginal('status') != 0) {
            return response()->json(['message' => 'Rental không hợp lệ'], 400);
        }
    
        // tạo payment nếu chưa có
        $payment = Payment::firstOrCreate(
            ['rental_id' => $rental->id],
            [
                'amount' => $rental->total_price,
                'payment_method' => 'vnpay',
                'status' => 0
            ]
        );
        // ENV
        $vnp_TmnCode = env('VNP_TMN_CODE');
        $vnp_HashSecret = env('VNP_HASH_SECRET');
        $vnp_Url = env('VNP_URL');
        $vnp_ReturnUrl = env('VNP_RETURN_URL');
    
        // Data
        $vnp_TxnRef = $rental->id;
        $vnp_OrderInfo = "Thanh_toan_rental_" . $rental->id; // tránh dấu cách
        $vnp_Amount = (int)($payment->amount * 100);
    
        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => now()->format('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => "127.0.0.1",
            "vnp_Locale" => "vn",
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => "other",
            "vnp_ReturnUrl" => $vnp_ReturnUrl,
            "vnp_TxnRef" => $vnp_TxnRef,
            "vnp_BankCode" => "NCB",
            "vnp_ExpireDate" => now()->addMinutes(60)->format('YmdHis'),
            "vnp_SecureHashType" => "SHA512",
        ];
        // clone data để hash
        $hashDataArr = $inputData;
        unset($hashDataArr['vnp_SecureHashType']);
        ksort($hashDataArr);
        $hashdata = "";
        $i = 0;
        foreach ($hashDataArr as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&';
            }
            $hashdata .= $key . "=" . rawurlencode($value);
            $i = 1;
        }
        ksort($inputData);
        $query = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $query .= '&';
            }
            $query .= rawurlencode($key) . "=" . rawurlencode($value);
            $i = 1;
        }
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        $paymentUrl = $vnp_Url . "?" . $query . '&vnp_SecureHash=' . $vnpSecureHash;
    
        return response()->json([
            'payment_url' => $paymentUrl
        ]);
    }

    public function vnpayReturn(Request $request)
    {
        return $this->handleVnpay($request);
    }

    public function ipn(Request $request)
    {
        $this->handleVnpay($request);

        return response()->json([
            'RspCode' => '00',
            'Message' => 'Confirm Success'
        ]);
    }

    private function handleVnpay(Request $request)
    {
        $vnp_HashSecret = env('VNP_HASH_SECRET');

        $inputData = $request->all();
        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? null;

        unset($inputData['vnp_SecureHash'], $inputData['vnp_SecureHashType']);

        ksort($inputData);
        $hashData = urldecode(http_build_query($inputData));

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($secureHash !== $vnp_SecureHash) {
            return response()->json(['message' => 'Sai chữ ký'], 400);
        }

        $rental_id = $request->vnp_TxnRef;
        $respCode = $request->vnp_ResponseCode;
        $vnpAmount = (int)$request->vnp_Amount;

        $payment = Payment::where('rental_id', $rental_id)->first();

        if (!$payment) {
            return response()->json(['message' => 'Không tìm thấy payment'], 404);
        }

        // check amount
        if ($vnpAmount !== (int)($payment->amount * 100)) {
            return response()->json(['message' => 'Sai số tiền'], 400);
        }

        // tránh xử lý lại
        if ($payment->status == 1) {
            return response()->json(['message' => 'Đã xử lý']);
        }

        if ($respCode == '00') {

            DB::beginTransaction();

            try {
                $payment->update(['status' => 1]);

                $payment->rental->update([
                    'status' => 1 // confirmed
                ]);

                DB::commit();

                return response()->json([
                    'message' => 'Thanh toán VNPay thành công'
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['message' => 'Lỗi xử lý'], 500);
            }
        }

        $payment->update(['status' => 2]);

        return response()->json([
            'message' => 'Thanh toán VNPay thất bại'
        ]);
    }
}