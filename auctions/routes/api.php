<?php

use App\Http\Controllers\AuctionController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ExternalAuctionsController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

Route::get('/auctions', [AuctionController::class, 'index']);
Route::get('/auctions/export', [AuctionController::class, 'exportCsv']);
Route::get('/auctions/{auction}', [AuctionController::class, 'show']);

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::resource('categories', CategoryController::class)
        ->only(['store', 'update', 'destroy']);
    Route::resource('auctions', AuctionController::class)
        ->only(['store', 'update', 'destroy']);

    Route::resource('bids', BidController::class)
        ->only(['index', 'show', 'store', 'update', 'destroy']);
    Route::get('/auctions/{auction}/bids', [BidController::class, 'auctionBids']);
    Route::get('/users/{user}/bids', [BidController::class, 'userBids']);

    Route::get(
        '/external/gsa-auctions',
        [ExternalAuctionsController::class, 'gsa']
    );
    Route::get(
        '/external/prozorro-auctions',
        [ExternalAuctionsController::class, 'prozorro']
    );

    Route::post('/logout', [UserController::class, 'logout']);
});
