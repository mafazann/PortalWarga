<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HouseHistory extends Model
{
    protected $fillable = ['house_id', 'resident_id', 'start_date', 'end_date'];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
}
