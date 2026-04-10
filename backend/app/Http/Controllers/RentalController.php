<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rental;
use App\Models\Vehicle;
use Carbon\Carbon;

class RentalController extends Controller
{
    //Tạo đơn thuê
    public function store(Request $request)
    {
        $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $user = $request->user();

        // Check trùng lịch
        $isConflict = Rental::where('vehicle_id', $request->vehicle_id)
            ->whereIn('status', [0, 1, 2]) // pending, confirmed, renting
            ->where(function ($query) use ($request) {
                $query->where('start_date', '<=', $request->end_date)
                      ->where('end_date', '>=', $request->start_date);
            })
            ->exists();

        if ($isConflict) {
            return response()->json([
                'message' => 'Xe đã có người đặt trong thời gian này'
            ], 400);
        }

        $vehicle = Vehicle::findOrFail($request->vehicle_id);

        // Tính số ngày
        $days = Carbon::parse($request->start_date)
            ->diffInDays(Carbon::parse($request->end_date)) + 1;

        $total = $days * $vehicle->price_per_day;

        // Tạo đơn thuê
        $rental = Rental::create([
            'user_id' => $user->id,
            'vehicle_id' => $request->vehicle_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => 0,
            'total_price' => $total
        ]);

        return response()->json([
            'message' => 'Đặt xe thành công',
            'data' => $rental
        ]);
    }

    //User xem đơn của mình
    public function myRentals(Request $request)
    {
        $user = $request->user();

        $rentals = Rental::with('vehicle')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json($rentals);
    }

    //Xem chi tiết
    public function show($id)
    {
        $rental = Rental::with(['vehicle', 'user'])
            ->findOrFail($id);

        return response()->json($rental);
    }

    //Hủy đơn
    public function cancel(Request $request, $id)
    {
        $user = $request->user();

        $rental = Rental::findOrFail($id);

        // check quyền
        if ($rental->user_id !== $user->id) {
            return response()->json([
                'message' => 'Không có quyền'
            ], 403);
        }

        // chỉ hủy khi pending
        if ($rental->status != 0) {
            return response()->json([
                'message' => 'Chỉ được hủy khi đang chờ xác nhận'
            ], 400);
        }

        $rental->update([
            'status' => 4 // canceled
        ]);

        return response()->json([
            'message' => 'Đã hủy đơn'
        ]);
    }

    //Admin xem tất cả
    public function index()
    {
        $rentals = Rental::with(['user', 'vehicle'])
            ->latest()
            ->get();

        return response()->json($rentals);
    }

    //Admin xác nhận
    public function confirm($id)
    {
        $rental = Rental::findOrFail($id);

        if ($rental->status != 0) {
            return response()->json([
                'message' => 'Không hợp lệ'
            ], 400);
        }

        $rental->update([
            'status' => 1 // confirmed
        ]);

        return response()->json([
            'message' => 'Đã xác nhận'
        ]);
    }

    //Admin từ chối
    public function reject($id)
    {
        $rental = Rental::findOrFail($id);

        if ($rental->status != 0) {
            return response()->json([
                'message' => 'Không hợp lệ'
            ], 400);
        }

        $rental->update([
            'status' => 4 // canceled
        ]);

        return response()->json([
            'message' => 'Đã từ chối'
        ]);
    }
}