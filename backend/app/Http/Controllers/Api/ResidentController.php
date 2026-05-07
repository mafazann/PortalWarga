<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResidentController extends Controller
{
    public function index()
    {
        return Resident::with(['houseHistories' => function($q) {
            $q->whereNull('end_date')->with('house');
        }])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'ktp_photo' => 'nullable|image|max:2048',
            'status' => 'required|in:kontrak,tetap',
            'phone_number' => 'required|string|max:20',
            'is_married' => 'boolean'
        ]);

        if ($request->hasFile('ktp_photo')) {
            $path = $request->file('ktp_photo')->store('ktp', 'public');
            $validated['ktp_photo'] = Storage::disk('public')->url($path);
        }

        $resident = Resident::create($validated);
        return response()->json($resident, 201);
    }

    public function show(Resident $resident)
    {
        return $resident;
    }

    public function update(Request $request, Resident $resident)
    {
        $validated = $request->validate([
            'full_name' => 'sometimes|required|string|max:255',
            'ktp_photo' => 'nullable|image|max:2048',
            'status' => 'sometimes|required|in:kontrak,tetap',
            'phone_number' => 'sometimes|required|string|max:20',
            'is_married' => 'boolean'
        ]);

        if ($request->hasFile('ktp_photo')) {
            $path = $request->file('ktp_photo')->store('ktp', 'public');
            $validated['ktp_photo'] = Storage::disk('public')->url($path);
        }

        $resident->update($validated);
        return response()->json($resident);
    }

    public function destroy(Resident $resident)
    {
        $resident->delete();
        return response()->json(null, 204);
    }
}
