<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use OpenApi\Annotations as OA;

class CategoryController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/categories",
     * summary="Prikaz svih kategorija",
     * tags={"Categories"},
     * @OA\Response(
     * response=200,
     * description="Lista svih kategorija uspešno preuzeta"
     * )
     * )
     */
    public function index()
    {
        $categories = Category::all();

        if ($categories->isEmpty()) {
            return response()->json(['message' => 'No categories found!'], 404);
        }

        return response()->json([
            'count' => $categories->count(),
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * @OA\Post(
     * path="/api/categories",
     * summary="Kreiranje nove kategorije (Admin samo)",
     * tags={"Categories"},
     * security={{"sanctum":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name"},
     * @OA\Property(property="name", type="string", example="Elektronika"),
     * @OA\Property(property="description", type="string", example="Svi elektronski uređaji")
     * )
     * ),
     * @OA\Response(response=201, description="Kategorija uspešno kreirana"),
     * @OA\Response(response=403, description="Niste autorizovani (Samo Admin)")
     * )
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || !($user->is_admin ?? false)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'description' => ['sometimes', 'nullable', 'string'],
        ]);

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => new CategoryResource($category),
        ], 201);
    }

   /**
     * @OA\Get(
     * path="/api/categories/{id}",
     * summary="Prikaz jedne kategorije po ID-u",
     * tags={"Categories"},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="ID kategorije koju tražite",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(response=200, description="Detalji kategorije"),
     * @OA\Response(response=404, description="Kategorija nije pronađena")
     * )
     */
    public function show(Category $category)
    {
        return response()->json([
            'category' => new CategoryResource($category),
        ]);
    }

    /**
     * @OA\Put(
     * path="/api/categories/{id}",
     * summary="Ažuriranje kategorije (Admin samo)",
     * tags={"Categories"},
     * security={{"sanctum":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=false,
     * @OA\JsonContent(
     * @OA\Property(property="name", type="string", example="Nova Tehnika"),
     * @OA\Property(property="description", type="string")
     * )
     * ),
     * @OA\Response(response=200, description="Kategorija ažurirana"),
     * @OA\Response(response=403, description="Niste autorizovani")
     * )
     */
    public function update(Request $request, Category $category)
    {
        $user = Auth::user();

        if (!$user || !($user->is_admin ?? false)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($category->id),
            ],
            'description' => ['sometimes', 'nullable', 'string'],
        ]);

        if (empty($validated)) {
            return response()->json([
                'message' => 'Nothing to update',
                'category' => new CategoryResource($category),
            ]);
        }

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => new CategoryResource($category),
        ]);
    }

   /**
     * @OA\Delete(
     * path="/api/categories/{id}",
     * summary="Brisanje kategorije (Admin samo)",
     * tags={"Categories"},
     * security={{"sanctum":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(response=200, description="Kategorija obrisana"),
     * @OA\Response(response=403, description="Niste autorizovani")
     * )
     */
    public function destroy(Category $category)
    {
        $user = Auth::user();

        if (!$user || !($user->is_admin ?? false)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
