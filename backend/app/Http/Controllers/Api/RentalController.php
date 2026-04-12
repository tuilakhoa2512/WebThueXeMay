<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\DB;
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
            'start_date' => 'required|date|after_or_equal:now',
            'end_date' => 'required|date|after:start_date',
        ]);
    
        $user = $request->user();
    
        // lấy vehicle
        $vehicle = Vehicle::findOrFail($request->vehicle_id);
    
        // check xe có khả dụng không
        if ($vehicle->status != 0) {
            return response()->json([
                'message' => 'Xe hiện không khả dụng'
            ], 400);
        }
    
        // Check trùng lịch
        $isConflict = Rental::where('vehicle_id', $request->vehicle_id)
            ->whereIn('status', [0, 1, 2])
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
    
        DB::beginTransaction();
    
        try {
            // tính số ngày (>= 1)
            $start = Carbon::parse($request->start_date);
            $end = Carbon::parse($request->end_date);
    
            $days = max(1, $start->diffInDays($end) + 1);
    
            $total = $days * $vehicle->price_per_day;
    
            // tạo rental
            $rental = Rental::create([
                'user_id' => $user->id,
                'vehicle_id' => $request->vehicle_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => 0,
                'total_price' => $total
            ]);
    
            DB::commit();
    
            // load lại sau khi đã thêm đơn
            $rental->load(['vehicle']);
    
            return response()->json([
                'message' => 'Đặt xe thành công',
                'data' => $rental
            ]);
    
        } catch (\Exception $e) {
            DB::rollBack();
    
            return response()->json([
                'message' => 'Lỗi khi đặt xe',
                'error' => $e->getMessage()
            ], 500);
        }
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
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $rental = Rental::with(['vehicle', 'user'])
            ->findOrFail($id);

        if ($rental->user_id != $user->id && $user->role_id != 1) {
            return response()->json(['message' => 'Không có quyền'], 403);
        }

        return response()->json($rental);
    }

    //Hủy đơn
    public function cancel(Request $request, $id)
    {
        $user = $request->user();

        $rental = Rental::findOrFail($id);

        // check quyền (chỉ chủ đơn)
        if ($rental->user_id !== $user->id) {
            return response()->json([
                'message' => 'Không có quyền'
            ], 403);
        }

        // chỉ hủy khi pending
        if ($rental->status !== 'pending') {
            return response()->json([
                'message' => 'Chỉ được hủy khi đang chờ xác nhận'
            ], 400);
        }

        $rental->update([
            'status' => 4 // canceled
        ]);

        return response()->json([
            'message' => 'Bạn đã hủy đơn'
        ]);
    }

    //Admin xem tất cả
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role_id != 1) {
            return response()->json(['message' => 'Không có quyền'], 403);
        }

        $rentals = Rental::with(['user', 'vehicle'])
            ->latest()
            ->get();

        return response()->json($rentals);
    }

    //Admin xác nhận
    public function confirm($id)
    {
        $user = request()->user();
        if ($user->role_id != 1) {
            return response()->json(['message' => 'Không có quyền'], 403);
        }

        $rental = Rental::findOrFail($id);
        if ($rental->status !== 'pending'){
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

        // chỉ reject khi pending
        if ($rental->status !== 'pending') {
            return response()->json([
                'message' => 'Không hợp lệ'
            ], 400);
        }

        $rental->update([
            'status' => 4 // canceled
        ]);

        return response()->json([
            'message' => 'Admin đã từ chối đơn'
        ]);
    }

    public function start($id)
    {
        $rental = Rental::findOrFail($id);
    
        if ($rental->status !== 'confirmed') {
            return response()->json([
                'message' => 'Chỉ có thể bắt đầu khi đã xác nhận'
            ], 400);
        }
    
        $rental->update([
            'status' => 2
        ]);
    
        //  update vehicle
        $rental->vehicle->update([
            'status' => 1 // đang được thuê
        ]);
    
        return response()->json([
            'message' => 'Đã bắt đầu thuê (renting)'
        ]);
    }

    public function complete($id)
    {
        $rental = Rental::findOrFail($id);

        if ($rental->status !== 'renting') {
            return response()->json([
                'message' => 'Chỉ có thể hoàn thành khi đang thuê'
            ], 400);
        }

        $rental->update([
            'status' => 3
        ]);

        // 🔥 trả xe về available
        $rental->vehicle->update([
            'status' => 0
        ]);

        return response()->json([
            'message' => 'Đã hoàn thành đơn thuê'
        ]);
    }
}