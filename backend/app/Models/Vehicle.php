<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $table = 'vehicles';

    protected $fillable = [
        'name',
        'description',
        'category_id',
        'brand_id',
        'license_plate',
        'price_per_day',
        'status'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function images()
    {
        return $this->hasMany(VehicleImage::class);
    }

    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}
