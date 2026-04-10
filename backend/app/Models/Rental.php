<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    protected $table = 'rentals';

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'start_date',
        'end_date',
        'status',
        'total_price'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
