<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $electronics = Category::where('name', 'Electronics')->first();
        $homeAppliances = Category::where('name', 'Home Appliances')->first();
        $fashion = Category::where('name', 'Fashion')->first();
        $books = Category::where('name', 'Books')->first();
        $vehicles = Category::where('name', 'Vehicles')->first();
        $art = Category::where('name', 'Art')->first();

        // Electronics
        Product::create([
            'name' => 'iPhone 16 Pro Max',
            'description' => 'Latest Apple flagship smartphone with A18 Pro chip',
            'price' => 1199.99,
            'sku' => 'IPHONE16MAX',
            'category_id' => $electronics->id,
        ]);

        Product::create([
            'name' => 'Samsung Galaxy S24 Ultra',
            'description' => 'Premium Android smartphone with 200MP camera',
            'price' => 1299.99,
            'sku' => 'SAMS24ULTRA',
            'category_id' => $electronics->id,
        ]);

        Product::create([
            'name' => 'Sony WH-1000XM5 Headphones',
            'description' => 'Industry-leading noise cancelling wireless headphones',
            'price' => 399.99,
            'sku' => 'SONY-WH1000',
            'category_id' => $electronics->id,
        ]);

        Product::create([
            'name' => 'iPad Pro 12.9 M4',
            'description' => 'Powerful tablet with M4 chip and OLED display',
            'price' => 1099.99,
            'sku' => 'IPADPRO129',
            'category_id' => $electronics->id,
        ]);

        // Home Appliances
        Product::create([
            'name' => 'Dyson V15 Vacuum Cleaner',
            'description' => 'Cordless vacuum with laser detection technology',
            'price' => 749.99,
            'sku' => 'DYSON-V15',
            'category_id' => $homeAppliances->id,
        ]);

        Product::create([
            'name' => 'Instant Pot Pro Max',
            'description' => '10-in-1 pressure cooker and multi-cooker',
            'price' => 149.95,
            'sku' => 'INSTPOT-MAX',
            'category_id' => $homeAppliances->id,
        ]);

        Product::create([
            'name' => 'LG OLED 65" Smart TV',
            'description' => '4K OLED television with Dolby Vision',
            'price' => 1999.99,
            'sku' => 'LG-OLED65',
            'category_id' => $homeAppliances->id,
        ]);

        Product::create([
            'name' => 'DeLonghi Espresso Machine',
            'description' => 'Automatic espresso coffee maker with milk frother',
            'price' => 299.99,
            'sku' => 'DELONGHI-ESP',
            'category_id' => $homeAppliances->id,
        ]);

        // Fashion
        Product::create([
            'name' => 'Gucci Marmont Leather Bag',
            'description' => 'Iconic quilted leather shoulder bag in black',
            'price' => 1590.00,
            'sku' => 'GUCCI-MARMONT',
            'category_id' => $fashion->id,
        ]);

        Product::create([
            'name' => 'Nike Air Jordan 1 Retro',
            'description' => 'Classic high-top basketball sneaker',
            'price' => 170.00,
            'sku' => 'NIKE-AJ1',
            'category_id' => $fashion->id,
        ]);

        Product::create([
            'name' => 'Rolex Submariner Watch',
            'description' => 'Luxury Swiss automatic watch with steel band',
            'price' => 9000.00,
            'sku' => 'ROLEX-SUB',
            'category_id' => $fashion->id,
        ]);

        Product::create([
            'name' => 'Prada Nylon Backpack',
            'description' => 'Minimalist luxury backpack in black nylon',
            'price' => 950.00,
            'sku' => 'PRADA-NYLON',
            'category_id' => $fashion->id,
        ]);

        // Books
        Product::create([
            'name' => 'The Great Gatsby - First Edition',
            'description' => 'Rare first edition of F. Scott Fitzgerald\'s classic',
            'price' => 5000.00,
            'sku' => 'GATSBY-1ST',
            'category_id' => $books->id,
        ]);

        Product::create([
            'name' => 'To Kill a Mockingbird - Signed Copy',
            'description' => 'First edition signed by Harper Lee',
            'price' => 3500.00,
            'sku' => 'MOCKBIRD-SIG',
            'category_id' => $books->id,
        ]);

        Product::create([
            'name' => '1984 - Hardcover Collection',
            'description' => 'George Orwell\'s 1984 in premium hardcover',
            'price' => 45.99,
            'sku' => '1984-HC',
            'category_id' => $books->id,
        ]);

        Product::create([
            'name' => 'Pride and Prejudice - Leather Bound',
            'description' => 'Jane Austen classic in elegant leather binding',
            'price' => 65.00,
            'sku' => 'PRIDE-LB',
            'category_id' => $books->id,
        ]);

        // Vehicles
        Product::create([
            'name' => 'Tesla Model 3 - 2024',
            'description' => 'Electric vehicle with 350-mile range',
            'price' => 43000.00,
            'sku' => 'TESLA-M3-24',
            'category_id' => $vehicles->id,
        ]);

        Product::create([
            'name' => 'Honda Civic Sedan',
            'description' => '2023 Honda Civic with excellent fuel economy',
            'price' => 27000.00,
            'sku' => 'HONDA-CIVIC',
            'category_id' => $vehicles->id,
        ]);

        // Art
        Product::create([
            'name' => 'Abstract Oil Painting - Modern Art',
            'description' => 'Contemporary abstract painting by emerging artist',
            'price' => 1200.00,
            'sku' => 'ART-ABSTRACT',
            'category_id' => $art->id,
        ]);

        Product::create([
            'name' => 'Limited Edition Photography Print',
            'description' => 'Signed and numbered fine art photography print',
            'price' => 800.00,
            'sku' => 'PHOTO-PRINT',
            'category_id' => $art->id,
        ]);
    }
}
