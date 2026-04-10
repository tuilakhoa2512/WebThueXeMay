<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'reviews';
    public $timestamps = false;

    protected $fillable = [
        'rental_id',
        'user_id',
        'rating',
        'comment',
        'status'
    ];

    public function rental()
    {
        return $this->belongsTo(Rental::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
