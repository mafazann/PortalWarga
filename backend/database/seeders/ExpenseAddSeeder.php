<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Expense;

class ExpenseAddSeeder extends Seeder
{
    public function run(): void
    {
        $expenses = [
            [
                'description' => 'Perbaikan Selokan RT',
                'amount' => 850000,
                'expense_date' => now()->subDays(15)->format('Y-m-d')
            ],
            [
                'description' => 'Gaji Satpam Bulan Ini',
                'amount' => 2500000,
                'expense_date' => now()->startOfMonth()->format('Y-m-d')
            ],
            [
                'description' => 'Biaya Token Listrik Pos Satpam',
                'amount' => 150000,
                'expense_date' => now()->subDays(5)->format('Y-m-d')
            ],
            [
                'description' => 'Pembersihan Sampah Mingguan',
                'amount' => 300000,
                'expense_date' => now()->subMonths(1)->startOfMonth()->addDays(5)->format('Y-m-d')
            ]
        ];

        foreach ($expenses as $expense) {
            Expense::create($expense);
        }
    }
}
