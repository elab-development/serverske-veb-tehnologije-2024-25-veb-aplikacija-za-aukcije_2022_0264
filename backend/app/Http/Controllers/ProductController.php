<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of products. Public endpoint.
     * Supports: q (search), category_id, min_price, max_price, sort, per_page
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($q = $request->query('q')) {
            $query->where(function ($q2) use ($q) {
                $q2->where('name', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }

        if ($category = $request->query('category_id')) {
            $query->where('category_id', $category);
        }

        if (!is_null($request->query('min_price'))) {
            $query->where('price', '>=', $request->query('min_price'));
        }

        if (!is_null($request->query('max_price'))) {
            $query->where('price', '<=', $request->query('max_price'));
        }

        // sorting: price_asc, price_desc, newest, oldest
        $sort = $request->query('sort');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $perPage = (int) $request->query('per_page', 10);

        $products = $query->paginate(max(1, $perPage));

        return response()->json($products);
    }

    /**
     * Display the specified product. Public endpoint.
     */
    public function show(Product $product)
    {
        $product->load('category', 'auctions');

        return response()->json(['product' => $product]);
    }

    /**
     * Store a newly created product. Admin only (route protected by middleware).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'sku' => ['nullable', 'string', 'max:100', 'unique:products,sku'],
            'category_id' => ['nullable', 'exists:categories,id'],
        ]);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created',
            'product' => $product
        ], 201);
    }

    /**
     * Update the specified product. Admin only.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'sku' => ['nullable', 'string', 'max:100', 'unique:products,sku,' . $product->id],
            'category_id' => ['nullable', 'exists:categories,id'],
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated',
            'product' => $product
        ]);
    }

    /**
     * Remove the specified product. Admin only.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }
}
