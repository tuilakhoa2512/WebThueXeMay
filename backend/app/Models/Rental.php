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

    const STATUS_PENDING = 0;
    const STATUS_CONFIRMED = 1;
    const STATUS_RENTING = 2;
    const STATUS_COMPLETED = 3;
    const STATUS_CANCELED = 4;

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

    public function getStatusAttribute($value)
    {
        $statuses = [
            self::STATUS_PENDING => 'pending',
            self::STATUS_CONFIRMED => 'confirmed',
            self::STATUS_RENTING => 'renting',
            self::STATUS_COMPLETED => 'completed',
            self::STATUS_CANCELED => 'canceled',
        ];

        return $statuses[$value] ?? 'unknown';
    }
}