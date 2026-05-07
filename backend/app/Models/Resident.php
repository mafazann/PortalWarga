<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    protected $fillable = ['full_name', 'ktp_photo', 'status', 'phone_number', 'is_married'];

    public function houseHistories()
    {
        return $this->hasMany(HouseHistory::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
