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

    // status
    const STATUS_AVAILABLE = 0;     // sẵn sàng
    const STATUS_RENTING = 1;       // đang thuê
    const STATUS_MAINTENANCE = 2;   // bảo trì
    const STATUS_INACTIVE = 3;      // ẩn

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

    public function primaryImage()
    {
        return $this->hasOne(VehicleImage::class)
                    ->where('is_primary', 1);
    }

    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function getStatusTextAttribute()
    {
        return match ($this->attributes['status']) {
            self::STATUS_AVAILABLE => 'available',
            self::STATUS_RENTING => 'renting',
            self::STATUS_MAINTENANCE => 'maintenance',
            self::STATUS_INACTIVE => 'inactive',
            default => 'unknown',
        };
    }

    public function isAvailable()
    {
        return $this->getRawOriginal('status') == self::STATUS_AVAILABLE;
    }

    public function isRenting()
    {
        return $this->getRawOriginal('status') == self::STATUS_RENTING;
    }

    public function isInactive()
    {
        return $this->getRawOriginal('status') == self::STATUS_INACTIVE;
    }
}