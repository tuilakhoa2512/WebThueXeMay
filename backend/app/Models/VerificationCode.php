<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerificationCode extends Model
{
    protected $table = 'verification_codes';
    public $timestamps = false;

    protected $fillable = [
        'contact',
        'otp_code',
        'expired_at',
        'is_used'
    ];
}
