<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brands extends Model
{
    protected $table = 'brands';
    public $timestamps = false;

    protected $fillable = ['name', 'image', 'description', 'status'];

    public function vehicles()
    {
        return $this->hasMany(Vehicles::class);
    }
}
