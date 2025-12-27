<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'admin',
            'email' => 'admin@mail.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        User::factory(5)->create();

        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
            AuctionSeeder::class,
            BidSeeder::class,
        ]);
    }
}
