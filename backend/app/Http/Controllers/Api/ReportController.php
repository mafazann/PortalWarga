<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function summary(Request $request)
    {
        $year = $request->query('year', date('Y'));
        
        $incomes = Payment::where('status', 'lunas')
            ->where('for_year', $year)
            ->select('for_month', DB::raw('SUM(amount) as total'))
            ->groupBy('for_month')
            ->get()
            ->keyBy('for_month');

        $expenses = Expense::whereYear('expense_date', $year)
            ->select(DB::raw('MONTH(expense_date) as month'), DB::raw('SUM(amount) as total'))
            ->groupBy('month')
            ->get()
            ->keyBy('month');

        $summary = [];
        $totalBalance = 0;

        for ($i = 1; $i <= 12; $i++) {
            $income = $incomes->get($i)->total ?? 0;
            $expense = $expenses->get($i)->total ?? 0;
            $balance = $income - $expense;
            $totalBalance += $balance;

            $summary[] = [
                'month' => $i,
                'income' => $income,
                'expense' => $expense,
                'balance' => $balance,
                'running_balance' => $totalBalance
            ];
        }

        return response()->json([
            'year' => $year,
            'summary' => $summary,
            'current_total_balance' => $totalBalance
        ]);
    }

    public function details(Request $request)
    {
        $month = $request->query('month', date('n'));
        $year = $request->query('year', date('Y'));

        $incomes = Payment::with(['resident', 'house'])
            ->where('status', 'lunas')
            ->where('for_month', $month)
            ->where('for_year', $year)
            ->get();

        $expenses = Expense::whereMonth('expense_date', $month)
            ->whereYear('expense_date', $year)
            ->get();

        return response()->json([
            'month' => $month,
            'year' => $year,
            'incomes' => $incomes,
            'expenses' => $expenses,
        ]);
    }
}
