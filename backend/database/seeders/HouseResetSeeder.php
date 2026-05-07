<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\House;

class HouseResetSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 20; $i++) {
            House::create([
                'address' => 'Rumah' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'status' => 'kosong'
            ]);
        }
    }
}
