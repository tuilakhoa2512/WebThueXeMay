<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    protected $table = 'users';

    protected $fillable = [
        'role_id',
        'fullname',
        'email',
        'password',
        'phone',
        'status',
        'image'
    ];

    protected $hidden = ['password'];

    // 🔗 RELATIONSHIP
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function rentals()
    {
        return $this->hasMany(Rentals::class);
    }

    public function reviews()
    {
        return $this->hasMany(Reviews::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorites::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notifications::class);
    }
}
