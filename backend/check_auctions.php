<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Auction;

$auctions = Auction::with('product')->whereDate('end_time', '>', now())->take(5)->get();
echo "Total active auctions: " . count($auctions) . "\n";
foreach ($auctions as $a) {
    echo "ID: {$a->id}, Product: {$a->product?->name}, EndTime: {$a->end_time}, HighestBid: {$a->highest_bid}\n";
}

$allAuctions = Auction::count();
echo "\nTotal auctions in DB: {$allAuctions}\n";
