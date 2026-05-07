<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Resident;

class ResidentAddSeeder extends Seeder
{
    public function run(): void
    {
        $names = [
            'Budi Santoso', 'Siti Aminah', 'Agus Supriyadi', 'Ratna Sari', 
            'Hendra Wijaya', 'Dewi Lestari', 'Joko Mulyono', 'Rini Puspita'
        ];

        foreach ($names as $index => $name) {
            Resident::create([
                'full_name' => $name,
                'status' => $index % 3 === 0 ? 'kontrak' : 'tetap',
                'phone_number' => '085' . rand(100000000, 999999999),
                'is_married' => $index % 2 === 0,
                'ktp_photo' => null
            ]);
        }
    }
}
