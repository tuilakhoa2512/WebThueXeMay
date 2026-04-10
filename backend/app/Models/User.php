<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

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

    protected $hidden = [
        'password'
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    // RELATIONSHIP
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}