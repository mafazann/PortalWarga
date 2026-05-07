<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\House;
use App\Models\Resident;
use App\Models\HouseHistory;
use App\Models\Payment;
use App\Models\Expense;
use Carbon\Carbon;

class StudyCaseSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data
        Payment::truncate();
        HouseHistory::truncate();
        House::truncate();
        Resident::truncate();
        Expense::truncate();

        $names = ['Budi', 'Siti', 'Agus', 'Dewi', 'Joko', 'Ani', 'Rian', 'Lina', 'Eko', 'Sari', 'Dani', 'Maya', 'Heri', 'Wati', 'Anto', 'Ina', 'Dedi', 'Yuni', 'Rudi', 'Ratna'];

        // 1. Buat 20 Rumah dengan format Rumah01, Rumah02, dst
        $houses = [];
        for ($i = 1; $i <= 20; $i++) {
            $houses[] = House::create([
                'address' => 'Rumah' . sprintf('%02d', $i),
                'status' => 'Tidak Dihuni',
            ]);
        }

        // 2. Buat 15 Penghuni Tetap & Assign ke 15 rumah pertama
        for ($i = 0; $i < 15; $i++) {
            $resident = Resident::create([
                'full_name' => $names[$i],
                'status' => 'Tetap',
                'phone_number' => '0812' . rand(10000000, 99999999),
                'is_married' => rand(0, 1) == 1,
            ]);

            $house = $houses[$i];
            $house->update(['status' => 'Dihuni']);

            HouseHistory::create([
                'house_id' => $house->id,
                'resident_id' => $resident->id,
                'start_date' => Carbon::now()->subYears(1)->format('Y-m-d'),
                'end_date' => null,
            ]);

            // Simulasi Pembayaran
            $currentMonth = Carbon::now()->month;
            $currentYear = Carbon::now()->year;

            Payment::create([
                'house_id' => $house->id,
                'resident_id' => $resident->id,
                'fee_type' => 'Satpam',
                'for_month' => $currentMonth,
                'for_year' => $currentYear,
                'amount' => 100000,
                'status' => 'Lunas',
                'payment_date' => Carbon::now()->subDays(rand(1, 10))->format('Y-m-d'),
            ]);

            Payment::create([
                'house_id' => $house->id,
                'resident_id' => $resident->id,
                'fee_type' => 'Kebersihan',
                'for_month' => $currentMonth,
                'for_year' => $currentYear,
                'amount' => 15000,
                'status' => 'Lunas',
                'payment_date' => Carbon::now()->subDays(rand(1, 10))->format('Y-m-d'),
            ]);
        }

        // 3. 2 Rumah Kontrak
        for ($i = 15; $i < 17; $i++) {
            $resident = Resident::create([
                'full_name' => $names[$i],
                'status' => 'Kontrak',
                'phone_number' => '0857' . rand(10000000, 99999999),
                'is_married' => false,
            ]);

            $house = $houses[$i];
            $house->update(['status' => 'Dihuni']);

            HouseHistory::create([
                'house_id' => $house->id,
                'resident_id' => $resident->id,
                'start_date' => Carbon::now()->subMonths(2)->format('Y-m-d'),
                'end_date' => null,
            ]);
        }

        // 4. Expenses sesuai study case
        Expense::create(['description' => 'Gaji Satpam', 'amount' => 1500000, 'expense_date' => Carbon::now()->startOfMonth()->format('Y-m-d')]);
        Expense::create(['description' => 'Listrik Pos Satpam', 'amount' => 200000, 'expense_date' => Carbon::now()->subDays(5)->format('Y-m-d')]);
        Expense::create(['description' => 'Perbaikan Selokan', 'amount' => 350000, 'expense_date' => Carbon::now()->subDays(10)->format('Y-m-d')]);
    }
}
