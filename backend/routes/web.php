<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RentalController;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/rentals', [RentalController::class, 'store']);
    Route::get('/rentals/my', [RentalController::class, 'myRentals']);
    Route::get('/rentals/{id}', [RentalController::class, 'show']);
    Route::patch('/rentals/{id}/cancel', [RentalController::class, 'cancel']);
});

// Admin
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/rentals', [RentalController::class, 'index']);
    Route::patch('/admin/rentals/{id}/confirm', [RentalController::class, 'confirm']);
    Route::patch('/admin/rentals/{id}/reject', [RentalController::class, 'reject']);
});