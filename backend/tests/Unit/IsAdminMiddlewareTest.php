<?php

namespace Tests\Unit;

use App\Http\Middleware\IsAdmin;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class IsAdminMiddlewareTest extends TestCase
{
    public function test_is_admin_blocks_guest_user(): void
    {
        $middleware = new IsAdmin();

        $request = Request::create('/api/products', 'POST');

        
        $request->setUserResolver(fn () => null);

        $response = $middleware->handle($request, function () {
            return response()->json(['ok' => true], 200);
        });

        $this->assertInstanceOf(Response::class, $response);
        $this->assertEquals(403, $response->getStatusCode());
        $this->assertStringContainsString('Forbidden', $response->getContent());
    }

    public function test_is_admin_allows_admin_user(): void
    {
        $middleware = new IsAdmin();

        $request = Request::create('/api/products', 'POST');

        
        $adminUser = (object) ['is_admin' => true];
        $request->setUserResolver(fn () => $adminUser);

        $response = $middleware->handle($request, function () {
            return response()->json(['ok' => true], 200);
        });

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertStringContainsString('"ok":true', $response->getContent());
    }
}