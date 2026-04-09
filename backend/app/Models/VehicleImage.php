<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleImage extends Model
{
    protected $table = 'vehicle_images';
    public $timestamps = false;

    protected $fillable = [
        'vehicle_id',
        'image',
        'is_primary'
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicles::class);
    }
}
