<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuctionResource;
use App\Models\Auction;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AuctionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'q' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'min_start_price' => ['sometimes', 'numeric', 'min:0'],
            'max_start_price' => ['sometimes', 'numeric', 'min:0'],
            'min_highest_bid' => ['sometimes', 'numeric', 'min:0'],
            'max_highest_bid' => ['sometimes', 'numeric', 'min:0'],
            'user_id' => ['sometimes', 'integer', 'exists:users,id'],
            'starts_before' => ['sometimes', 'date'],
            'starts_after' => ['sometimes', 'date'],
            'ends_before' => ['sometimes', 'date'],
            'ends_after' => ['sometimes', 'date'],
            'sort_by' => ['sometimes', 'string'],
            'sort_dir' => ['sometimes', Rule::in(['asc', 'desc'])],
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Auction::query()->with('product');

        if (!empty($validated['q'])) {
            $q = $validated['q'];
            $query->where(function ($w) use ($q) {
                $w->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhereHas('product',function ($p) use ($q){
                        $p->where('name','like',"%{$q}%");
                    });
            });
        }

        if (!empty($validated['description'])) {
            $query->where('description', 'like', '%' . $validated['description'] . '%');
        }
        if (isset($validated['min_start_price'])) {
            $query->where('start_price', '>=', $validated['min_start_price']);
        }
        if (isset($validated['max_start_price'])) {
            $query->where('start_price', '<=', $validated['max_start_price']);
        }
        if (isset($validated['min_highest_bid'])) {
            $query->where('highest_bid', '>=', $validated['min_highest_bid']);
        }
        if (isset($validated['max_highest_bid'])) {
            $query->where('highest_bid', '<=', $validated['max_highest_bid']);
        }
        if (!empty($validated['user_id'])) {
            $query->where('user_id', $validated['user_id']);
        }
        if (!empty($validated['starts_before'])) {
            $query->where('start_time', '<=', $validated['starts_before']);
        }
        if (!empty($validated['starts_after'])) {
            $query->where('start_time', '>=', $validated['starts_after']);
        }
        if (!empty($validated['ends_before'])) {
            $query->where('end_time', '<=', $validated['ends_before']);
        }
        if (!empty($validated['ends_after'])) {
            $query->where('end_time', '>=', $validated['ends_after']);
        }

        $sortable = ['id', 'title', 'start_price', 'highest_bid', 'start_time', 'end_time', 'created_at'];
        $sortBy = in_array($request->get('sort_by'), $sortable, true) ? $request->get('sort_by') : 'created_at';
        $sortDir = $request->get('sort_dir', 'desc') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDir);

        $perPage = (int) $request->get('per_page', 10);
        $auctions = $query->paginate($perPage)->appends($request->query());

        if ($auctions->isEmpty()) {
            return response()->json([
                'count' => 0,
                'page' => 1,
                'per_page' => $perPage,
                'data' => [],
            ]);
        }

        return response()->json([
            'count' => $auctions->total(),
            'page' => $auctions->currentPage(),
            'per_page' => $auctions->perPage(),
            'data' => AuctionResource::collection($auctions),
        ]);
    }

    public function exportCsv()
    {
        $auctions = Auction::with('category', 'user')->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="auctions.csv"',
        ];

        $callback = function () use ($auctions) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'ID',
                'Title',
                'Description',
                'Start Price',
                'Highest Bid',
                'Start Time',
                'End Time',
                'Category',
                'User'
            ]);

            foreach ($auctions as $auction) {
                fputcsv($handle, [
                    $auction->id,
                    $auction->title,
                    $auction->description,
                    $auction->start_price,
                    $auction->highest_bid,
                    $auction->start_time,
                    $auction->end_time,
                    $auction->category->name ?? 'N/A',
                    $auction->user->name ?? 'N/A',
                ]);
            }

            fclose($handle);
        };

        return response()->streamDownload($callback, 'auctions.csv', $headers);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!Auth::check() || !(Auth::user()->is_admin ?? false)) {
            return response()->json(['message' => 'Unauthorized. Only admins can create auctions.'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'starting_price' => 'required|numeric|min:0',
            'end_date' => 'required|date|after:now',
            'product_id' => 'required|integer|exists:products,id',
        ]);

        // Get product
        $product = Product::findOrFail($validated['product_id']);

        $auction = Auction::create([
            'title' => $validated['title'] ?? $product->name,
            'description' => $validated['description'] ?? null,
            'start_price' => $validated['starting_price'],
            'start_time' => now(),
            'end_time' => $validated['end_date'],
            'user_id' => Auth::user()->id,
            'product_id' => $validated['product_id'],
        ]);

        return response()->json([
            'message' => 'Auction created successfully',
            'auction' => new AuctionResource($auction->load('product'))
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Auction $auction)
    {
        $auction->load('product'); 

        return response()->json([
            'auction' => new AuctionResource($auction)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Auction $auction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Auction $auction)
    {
        if (!Auth::check() || ($auction->user_id !== Auth::id() && !(Auth::user()->is_admin ?? false))) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('auctions', 'title')->ignore($auction->id),
            ],
            'description' => ['sometimes', 'nullable', 'string'],
            'start_price' => ['sometimes', 'numeric', 'min:0'],
            'start_time' => ['sometimes', 'date'],
            'end_time' => ['sometimes', 'date', 'after:start_time'],
            'product_id' => ['sometimes', 'nullable', 'exists:products,id'],
        ]);

        $auction->update($validated);

        return response()->json([
            'message' => 'Auction updated successfully',
            'auction' => new AuctionResource($auction)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Auction $auction)
    {
        if (!Auth::check() || ($auction->user_id !== Auth::id() && !(Auth::user()->is_admin ?? false))) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $auction->delete();

        return response()->json(['message' => 'Auction deleted successfully']);
    }
}
