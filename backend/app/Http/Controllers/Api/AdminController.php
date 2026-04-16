<?php

namespace App\Http\Controllers\Api;

use App\Models\Rental;
use App\Models\Payment;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        // Lọc
        $days = $request->input('days', 7);
        $fromDate = Carbon::now()->subDays($days);
    
        // Thẻ thống kê
        $totalRentals = Rental::count();
    
        $totalRevenue = Payment::where('status', 1)->sum('amount');
    
        $rentingVehicles = Rental::where('status', Rental::STATUS_RENTING)->count();
    
        $newUsers = User::where('created_at', '>=', $fromDate)->count();
    
        // Biểu đồ doanh thu
        $revenueByDay = Payment::selectRaw('DATE(created_at) as date, SUM(amount) as total')
            ->where('status', 1)
            ->where('created_at', '>=', $fromDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    
        // Biểu đồ trạng thái thuê
        $rentalsByStatus = Rental::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->get();
    
        // xe đang hot
        $topVehicles = Rental::selectRaw('vehicle_id, COUNT(*) as total')
            ->with('vehicle:id,name')
            ->groupBy('vehicle_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get();
    
        // Danh sách khách hàng mới
        $latestUsers = User::latest()
            ->limit(5)
            ->get(['id', 'fullname', 'email', 'created_at']);
    
        return response()->json([
            'summary' => [
                'total_rentals' => $totalRentals,
                'total_revenue' => $totalRevenue,
                'renting_vehicles' => $rentingVehicles,
                'new_users' => $newUsers,
            ],
            'charts' => [
                'revenue_by_day' => $revenueByDay,
                'rentals_by_status' => $rentalsByStatus,
            ],
            'top_vehicles' => $topVehicles,
            'latest_users' => $latestUsers,
        ]);
    }
}
