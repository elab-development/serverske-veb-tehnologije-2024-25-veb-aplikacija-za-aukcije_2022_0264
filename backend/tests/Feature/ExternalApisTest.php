<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ExternalApisTest extends TestCase
{
    use RefreshDatabase;

    private function auth(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
    }

    public function test_prozorro_endpoint_returns_success_and_structure(): void
    {
        $this->auth();

        $response = $this->getJson('/api/external/prozorro-auctions');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data',
            ]);
    }

    public function test_gsa_endpoint_returns_success_and_structure(): void
    {
        $this->auth();

        $response = $this->getJson('/api/external/gsa-auctions?per_page=5');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data',
            ]);
    }
}
