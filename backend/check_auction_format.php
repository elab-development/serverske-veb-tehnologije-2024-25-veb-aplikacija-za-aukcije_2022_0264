<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Auction;
use App\Http\Resources\AuctionResource;

$auctions = Auction::with('product')->take(2)->get();
echo "First auction:\n";
$resource = new AuctionResource($auctions[0]);
$json = json_encode($resource->resolve(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
echo $json . "\n";
