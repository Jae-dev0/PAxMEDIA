<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'PAxMEDIA API',
        'version' => '1.0.0',
        'status' => 'running',
    ]);
});

Route::get('/up', function () {
    return response()->json(['status' => 'ok']);
});
