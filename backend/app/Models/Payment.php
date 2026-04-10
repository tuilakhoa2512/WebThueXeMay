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

    public function rental()
    {
        return $this->belongsTo(Rental::class);
    }
}
