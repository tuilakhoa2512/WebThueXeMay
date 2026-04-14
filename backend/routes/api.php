<?php
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\VehicleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RentalController;
use App\Http\Controllers\Api\AuthController;
Route::get('/vehicles', [VehicleController::class, 'index']);

//Login
Route::post('/login', [AuthController::class, 'login']);
//Register
Route::post('/register', [AuthController::class, 'register']);

//Profile
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile/avatar', [AuthController::class, 'uploadAvatar']);
    Route::post('/profile/change-password', [AuthController::class, 'changePassword']);
});

//Rental
Route::middleware('auth:sanctum')->group(function () {
    // User
    Route::post('/rentals', [RentalController::class, 'store']);
    Route::get('/rentals/my', [RentalController::class, 'myRentals']);
    Route::get('/rentals/{id}', [RentalController::class, 'show']);
    Route::patch('/rentals/{id}/cancel', [RentalController::class, 'cancel']);
    
    // Admin
    Route::get('/admin/rentals', [RentalController::class, 'index']);
    Route::patch('/admin/rentals/{id}/confirm', [RentalController::class, 'confirm']);
    Route::patch('/admin/rentals/{id}/reject', [RentalController::class, 'reject']);
    Route::patch('/admin/rentals/{id}/start', [RentalController::class, 'start']); //bắt đầu thuê
    Route::patch('/admin/rentals/{id}/complete', [RentalController::class, 'complete']);
});

//Vehicle
Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{id}', [VehicleController::class, 'show']);

// login
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/vehicles', [VehicleController::class, 'store']);
    Route::put('/vehicles/{id}', [VehicleController::class, 'update']);
    Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy']);
});

//Payment
Route::middleware('auth:sanctum')->group(function () {
    //Tiền mặt
    Route::post('/payments/cash', [PaymentController::class, 'cashPayment']);
    //VNPAY
    Route::get('/vnpay/create/{rental_id}', [PaymentController::class, 'createVnpay']);
});
// callback
Route::get('/vnpay/return', [PaymentController::class, 'vnpayReturn']);
Route::get('/vnpay/ipn', [PaymentController::class, 'ipn']);