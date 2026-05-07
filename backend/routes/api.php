<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::apiResource('residents', \App\Http\Controllers\Api\ResidentController::class);
    Route::apiResource('houses', \App\Http\Controllers\Api\HouseController::class);
    Route::post('houses/{house}/residents', [\App\Http\Controllers\Api\HouseController::class, 'addResident']);
    Route::apiResource('payments', \App\Http\Controllers\Api\PaymentController::class);
    Route::apiResource('expenses', \App\Http\Controllers\Api\ExpenseController::class);
    Route::get('reports/summary', [\App\Http\Controllers\Api\ReportController::class, 'summary']);
    Route::get('reports/details', [\App\Http\Controllers\Api\ReportController::class, 'details']);
});
