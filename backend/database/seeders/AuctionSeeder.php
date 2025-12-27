<?php

namespace Database\Seeders;

use App\Models\Auction;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuctionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $auctionConfigs = [
            [
                'product_name' => 'iPhone 16 Pro Max',
                'description' => 'Brand new sealed in box.',
                'start_price' => 999.99,
                'start_time' => now(),
                'end_time' => now()->addDays(7),
                'highest_bid' => 1099.99,
            ],
            [
                'product_name' => 'Dyson V15 Vacuum Cleaner',
                'description' => 'Powerful and lightweight perfect for all floors.',
                'start_price' => 699.99,
                'start_time' => now(),
                'end_time' => now()->addDays(5),
                'highest_bid' => 799.99,
            ],
            [
                'product_name' => 'Gucci Marmont Leather Bag',
                'description' => 'Authentic Gucci Marmont shoulder bag.',
                'start_price' => 1200.00,
                'start_time' => now(),
                'end_time' => now()->addDays(10),
                'highest_bid' => 1350.00,
            ],
            [
                'product_name' => 'The Great Gatsby - First Edition',
                'description' => 'Rare first edition copy of F. Scott Fitzgerald\'s classic novel.',
                'start_price' => 5000.00,
                'start_time' => now(),
                'end_time' => now()->addDays(14),
                'highest_bid' => 5500.00,
            ],
            [
                'product_name' => 'Tesla Model 3 - 2024',
                'description' => '2024 model, low mileage great condition.',
                'start_price' => 35000.00,
                'start_time' => now(),
                'end_time' => now()->addDays(30),
                'highest_bid' => 37500.00,
            ],
            [
                'product_name' => 'Abstract Oil Painting - Modern Art',
                'description' => 'Original art piece by renowned artist.',
                'start_price' => 1200.00,
                'start_time' => now(),
                'end_time' => now()->addDays(12),
                'highest_bid' => 1500.00,
            ],
            [
                'product_name' => 'Rolex Submariner Watch',
                'description' => 'Luxury Swiss automatic watch.',
                'start_price' => 8500.00,
                'start_time' => now(),
                'end_time' => now()->addDays(10),
                'highest_bid' => 9200.00,
            ],
            [
                'product_name' => 'iPad Pro 12.9 M4',
                'description' => 'Latest generation tablet with M4 chip.',
                'start_price' => 999.99,
                'start_time' => now(),
                'end_time' => now()->addDays(6),
                'highest_bid' => 1100.00,
            ],
            [
                'product_name' => 'LG OLED 65" Smart TV',
                'description' => '4K OLED television with Dolby Vision.',
                'start_price' => 1799.99,
                'start_time' => now(),
                'end_time' => now()->addDays(8),
                'highest_bid' => 2000.00,
            ],
        ];

        foreach ($auctionConfigs as $config) {
            $product = Product::where('name', $config['product_name'])->first();
            
            if ($product) {
                Auction::create([
                    'title' => $product->name,
                    'description' => $config['description'],
                    'start_price' => $config['start_price'],
                    'start_time' => $config['start_time'],
                    'end_time' => $config['end_time'],
                    'highest_bid' => $config['highest_bid'],
                    'user_id' => User::inRandomOrder()->first()->id,
                    'product_id' => $product->id,
                ]);
            }
        }
    }
}
