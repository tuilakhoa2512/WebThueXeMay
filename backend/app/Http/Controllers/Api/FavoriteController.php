<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\Vehicle;

class FavoriteController extends Controller
{
    // Danh sách yêu thích
    public function index(Request $request)
    {
        $favorites = Favorite::with('vehicle.images')
            ->where('user_id', $request->user()->id)           
            ->get();

        return response()->json($favorites);
    }

    // Thêm / bỏ yêu thích
    public function toggle(Request $request, $vehicle_id)
    {
        $user = $request->user();

        $vehicle = Vehicle::find($vehicle_id);

        if (!$vehicle) {
            return response()->json([
                'message' => 'Xe không tồn tại'
            ], 404);
        }

        $favorite = Favorite::where('user_id', $user->id)
            ->where('vehicle_id', $vehicle_id)
            ->first();

        // nếu đã tồn tại -> xóa
        if ($favorite) {

            $favorite->delete();

            return response()->json([
                'message' => 'Đã bỏ yêu thích'
            ]);
        }

        // nếu chưa tồn tại -> thêm
        Favorite::create([
            'user_id' => $user->id,
            'vehicle_id' => $vehicle_id
        ]);

        return response()->json([
            'message' => 'Đã thêm vào yêu thích'
        ]);
    }
}