<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Auction>
 */
class AuctionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startPrice = $this->faker->randomFloat(2, 50, 1000);
        $highestBid = $this->faker->optional()->randomFloat(2, $startPrice, $startPrice * 1.5);

        return [
            'title' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'start_price' => $startPrice,
            'highest_bid' => $highestBid,
            'start_time' => now(),
            'end_time' => now()->addDays(7),
            'user_id' => User::inRandomOrder()->first()->id,
            'category_id' => Category::inRandomOrder()->first()->id,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function ($auction) {
            // Attach 1-3 random products to this auction
            $products = Product::inRandomOrder()->limit(rand(1, 3))->pluck('id');
            
            $attach = [];
            foreach ($products as $productId) {
                $attach[$productId] = ['quantity' => rand(1, 5)];
            }
            
            $auction->products()->sync($attach);
        });
    }
}
