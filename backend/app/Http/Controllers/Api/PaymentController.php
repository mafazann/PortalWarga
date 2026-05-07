<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        return Payment::with(['resident', 'house'])->orderBy('for_year', 'desc')->orderBy('for_month', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'house_id' => 'required|exists:houses,id',
            'resident_id' => 'required|exists:residents,id',
            'fee_type' => 'required|in:satpam,kebersihan',
            'for_month' => 'required|integer|min:1|max:12',
            'for_year' => 'required|integer',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:lunas,belum_lunas',
            'payment_date' => 'nullable|date',
        ]);

        $payment = Payment::create($validated);
        return response()->json($payment, 201);
    }

    public function show(Payment $payment)
    {
        $payment->load(['resident', 'house']);
        return $payment;
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'status' => 'sometimes|required|in:lunas,belum_lunas',
            'payment_date' => 'nullable|date',
            'amount' => 'sometimes|numeric|min:0',
        ]);

        $payment->update($validated);
        return response()->json($payment);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->json(null, 204);
    }
}
