<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;

class VehicleController extends Controller
{
    //Tìm kiếm và lọc
    public function index(Request $request)
    {
        $query = Vehicle::with(['brand', 'category']);

        // search theo tên
        if ($request->keyword) {
            $query->where('name', 'like', '%' . $request->keyword . '%');
        }

        // lọc theo category
        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // lọc theo brand
        if ($request->brand_id) {
            $query->where('brand_id', $request->brand_id);
        }

        // chỉ lấy xe active (nếu cần)
        $query->where('status', '!=', 3); // inactive

        $vehicles = $query->latest()->get();

        return response()->json($vehicles);
    }

    //Chi tiết xe
    public function show($id)
    {
        $vehicle = Vehicle::with(['brand', 'category', 'images'])
            ->findOrFail($id);

        return response()->json($vehicle);
    }

    //Tạo xe
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'license_plate' => 'required|unique:vehicles',
            'price_per_day' => 'required|numeric|min:0'
        ]);

        $vehicle = Vehicle::create([
            'name' => $request->name,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'brand_id' => $request->brand_id,
            'license_plate' => $request->license_plate,
            'price_per_day' => $request->price_per_day,
            'status' => 0 // available
        ]);

        return response()->json([
            'message' => 'Thêm xe thành công',
            'data' => $vehicle
        ]);
    }

    //Chỉnh sửa xe
    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $request->validate([
            'name' => 'required',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'price_per_day' => 'required|numeric|min:0'
        ]);

        $vehicle->update([
            'name' => $request->name,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'brand_id' => $request->brand_id,
            'price_per_day' => $request->price_per_day,
        ]);

        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => $vehicle
        ]);
    }

    //Xóa xe hoặc ẩn
    public function destroy($id)
    {
        $vehicle = Vehicle::findOrFail($id);

        // không xóa thật → chỉ set inactive
        $vehicle->update([
            'status' => 3 // inactive
        ]);

        return response()->json([
            'message' => 'Đã xóa xe'
        ]);
    }
}