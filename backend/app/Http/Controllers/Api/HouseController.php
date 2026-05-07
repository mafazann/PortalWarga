<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\House;
use App\Models\HouseHistory;
use Illuminate\Http\Request;

class HouseController extends Controller
{
    public function index()
    {
        return House::with(['houseHistories.resident'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'address' => 'required|string|max:255',
            'status' => 'required|in:dihuni,kosong',
        ]);

        $house = House::create($validated);
        return response()->json($house, 201);
    }

    public function show(House $house)
    {
        $house->load(['houseHistories.resident', 'payments.resident']);
        return $house;
    }

    public function update(Request $request, House $house)
    {
        $validated = $request->validate([
            'address' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|in:dihuni,kosong',
        ]);

        $house->update($validated);
        return response()->json($house);
    }

    public function addResident(Request $request, House $house)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        // Close previous active history if it exists
        if (empty($validated['end_date'])) {
            $house->houseHistories()->whereNull('end_date')->update([
                'end_date' => now()->format('Y-m-d')
            ]);
            $house->update(['status' => 'dihuni']);
        }

        $history = $house->houseHistories()->create($validated);
        return response()->json($history, 201);
    }

    public function destroy(House $house)
    {
        $house->delete();
        return response()->json(null, 204);
    }
}
