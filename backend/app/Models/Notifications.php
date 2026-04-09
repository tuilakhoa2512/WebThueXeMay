<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifications extends Model
{
    protected $table = 'notifications';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'content',
        'is_read'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
