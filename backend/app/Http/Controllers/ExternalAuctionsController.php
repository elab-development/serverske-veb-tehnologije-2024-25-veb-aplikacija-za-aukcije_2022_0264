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

        
        $apiKey = env('GSA_API_KEY', 'DEMO_KEY');

        $q = $validated['q'] ?? null;
        $page = $validated['page'] ?? 1;
        $perPage = $validated['per_page'] ?? 10;

        $params = array_filter([
            'api_key'  => $apiKey,
            'format'   => 'JSON',
            'q'        => $q,
            'page'     => $page,
            'per_page' => $perPage,
        ], fn($v) => !is_null($v));

        
        $hash = md5(json_encode($params));
        $cacheKeyFresh = "gsa:fresh:{$hash}";
        $cacheKeyStale = "gsa:stale:{$hash}";

       
        $freshTtl = now()->addMinutes(30);
        $staleTtl = now()->addHours(24);

        try {
            
            $fresh = Cache::get($cacheKeyFresh);
            if ($fresh !== null) {
                $count = is_array($fresh) ? count($fresh) : null;

                return response()->json([
                    'message' => 'GSA auctions (cached)',
                    'cached'  => true,
                    'stale'   => false,
                    'status'  => 200,
                    'count'   => $count,
                    'data'    => $fresh,
                ], 200);
            }

           
            $resp = Http::timeout(10)
                ->acceptJson()
                ->retry(2, 500)
                ->get($url, $params);

            
            if ($resp->status() === 429) {
                $stale = Cache::get($cacheKeyStale) ?? [];
                $count = is_array($stale) ? count($stale) : null;

                return response()->json([
                    'message' => 'GSA rate limited (429). Returning stale cached data.',
                    'cached'  => true,
                    'stale'   => true,
                    'status'  => 429,
                    'count'   => $count,
                    'data'    => $stale,
                    'error'   => $resp->json() ?? $resp->body(),
                ], 200);
            }

         
            if (!$resp->ok()) {
                $stale = Cache::get($cacheKeyStale) ?? [];
                $count = is_array($stale) ? count($stale) : null;

                return response()->json([
                    'message' => 'Failed to fetch GSA auctions. Returning stale cached data if available.',
                    'cached'  => true,
                    'stale'   => true,
                    'status'  => $resp->status(),
                    'count'   => $count,
                    'data'    => $stale,
                    'error'   => $resp->json() ?? $resp->body(),
                ], 200);
            }

            
            $payload = $resp->json();

           
            $list = $payload['items'] ?? $payload;
            if (!is_array($list)) {
                $list = [];
            }

            $count = count($list);

            
            Cache::put($cacheKeyFresh, $list, $freshTtl);
            Cache::put($cacheKeyStale, $list, $staleTtl);

            return response()->json([
                'message' => 'GSA auctions fetched successfully',
                'cached'  => false,
                'stale'   => false,
                'status'  => 200,
                'count'   => $count,
                'data'    => $list,
            ], 200);
        } catch (\Throwable $e) {
            
            $stale = Cache::get($cacheKeyStale) ?? [];
            $count = is_array($stale) ? count($stale) : null;

            return response()->json([
                'message' => 'Error while calling GSA Auctions API. Returning stale cached data if available.',
                'cached'  => true,
                'stale'   => true,
                'status'  => 500,
                'count'   => $count,
                'data'    => $stale,
                'error'   => $e->getMessage(),
            ], 200);
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
