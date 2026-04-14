<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';
    public $timestamps = false;

    protected $fillable = [
        'rental_id',
        'amount',
        'payment_method',
        'status'
    ];

    const STATUS_PENDING = 0;
    const STATUS_PAID = 1;
    const STATUS_FAILED = 2;

    public function rental()
    {
        return $this->belongsTo(Rental::class);
    }
}