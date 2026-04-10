<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RentalController;

Route::get('/', function () {
    return view('welcome');
});

