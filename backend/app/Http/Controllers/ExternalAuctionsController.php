<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ExternalAuctionsController extends Controller
{
    public function gsa(Request $request)
    {

        $validated = $request->validate([
            'q' => ['sometimes', 'string', 'max:255'],
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);

        $url = 'https://api.gsa.gov/assets/gsaauctions/v2/auctions';
        $params = array_filter([
            'api_key'  => env('GSA_API_KEY', 'DEMO_KEY'),
            'format'   => 'JSON',
            'q'        => $validated['q'] ?? null,
            'page'     => $validated['page'] ?? 1,
            'per_page' => $validated['per_page'] ?? 10,
        ], fn($v) => !is_null($v));

        try {
            
            $resp = Http::timeout(10)->acceptJson()->get($url, $params);

           
            if (!$resp->ok()) {
                return response()->json([
                    'message' => 'Failed to fetch GSA auctions',
                    'status'  => $resp->status(),
                    'error'   => $resp->json() ?? $resp->body(),
                ], 502);
            }

           
            $payload = $resp->json();
            $list = $payload['items'] ?? $payload;

            return response()->json([
                'message' => 'GSA auctions fetched successfully',
                'count'   => is_array($list) ? count($list) : 0,
                'data'    => $list,
            ]);
        } catch (\Throwable $e) {
            
            return response()->json([
                'message' => 'Error while calling GSA API',
                'error'   => $e->getMessage(),
            ], 502);
        }
    }

    public function prozorro(Request $request)
    {
        $validated = $request->validate([
            'limit' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'offset' => ['sometimes', 'string', 'max:255'],
        ]);

        $url = 'https://public-api-sandbox.prozorro.gov.ua/api/2.5/tenders';
        $params = array_filter([
            'limit' => $validated['limit'] ?? 10,
            'offset' => $validated['offset'] ?? null,
        ], fn($v) => !is_null($v));

        try {
            $resp = Http::timeout(10)->acceptJson()->get($url, $params);

            if (!$resp->ok()) {
                return response()->json([
                    'message' => 'Failed to fetch ProZorro tenders',
                    'status' => $resp->status(),
                    'error' => $resp->json() ?? $resp->body(),
                ], 502);
            }

            $payload = $resp->json();

            $list = $payload['data'] ?? [];
            return response()->json([
                'message' => 'ProZorro tenders fetched successfully',
                'count' => is_array($list) ? count($list) : null,
                'data' => $list,
                'next_page' => $payload['next_page'] ?? null,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error while calling ProZorro API',
                'error' => $e->getMessage(),
            ], 502);
        }
    }
}
