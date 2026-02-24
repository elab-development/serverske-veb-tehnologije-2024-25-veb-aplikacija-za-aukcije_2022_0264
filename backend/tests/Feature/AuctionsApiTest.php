<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuctionsApiTest extends TestCase
{
    use RefreshDatabase;

    private function auth(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
    }

    public function test_auctions_index_returns_success(): void
    {
        $this->auth();

        $response = $this->getJson('/api/auctions');

        $response->assertStatus(200);
    }

    public function test_auctions_export_csv_returns_success(): void
    {
        $this->auth();

        $response = $this->get('/api/auctions/export');

        $response->assertStatus(200);

       
    }
}
