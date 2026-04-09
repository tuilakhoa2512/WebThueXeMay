<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicles extends Model
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
        return $this->belongsTo(Categories::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brands::class);
    }

    public function images()
    {
        return $this->hasMany(VehicleImage::class);
    }

    public function rentals()
    {
        return $this->hasMany(Rentals::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorites::class);
    }
}
