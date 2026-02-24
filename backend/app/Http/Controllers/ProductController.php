<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenApi\Annotations as OA;
class ProductController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/products",
     * summary="Get all products",
     * tags={"Products"},
     * @OA\Response(response=200, description="List of products")
     * )
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
     * @OA\Get(
     * path="/api/products/{id}",
     * summary="Get single product by ID",
     * tags={"Products"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Product details")
     * )
     */
    public function show(Product $product)
    {
      

        $product->load('category', 'auctions');

        return response()->json(['product' => $product]);
    }

   /**
     * @OA\Post(
     * path="/api/products",
     * summary="Create product (Admin only)",
     * tags={"Products"},
     * security={{"sanctum":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name","price","category_id"},
     * @OA\Property(property="name", type="string"),
     * @OA\Property(property="price", type="number"),
     * @OA\Property(property="category_id", type="integer")
     * )
     * ),
     * @OA\Response(response=201, description="Product created")
     * )
     */
    public function store(Request $request)
    {
       


        if (!Auth::check() || !(Auth::user()->is_admin ?? false)) {
            return response()->json(['message' => 'Unauthorized. Only admins can create products.'], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'sku' => ['nullable', 'string', 'max:100', 'unique:products,sku'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'image_url' => ['nullable', 'string', 'max:500'],
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
     * @OA\Delete(
     * path="/api/products/{id}",
     * summary="Delete product (Admin only)",
     * tags={"Products"},
     * security={{"sanctum":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Deleted")
     * )
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }
}
