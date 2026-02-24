<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


use OpenApi\Annotations as OA;
class UserController extends Controller
{
   /**
     * @OA\Post(
     * path="/api/register",
     * summary="Register new user",
     * tags={"Auth"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name","email","password"},
     * @OA\Property(property="name", type="string", example="Nevena"),
     * @OA\Property(property="email", type="string", example="nevena@gmail.com"),
     * @OA\Property(property="password", type="string", example="password123")
     * )
     * ),
     * @OA\Response(response=201, description="User registered successfully")
     * )
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin ?? false
            ],
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }
/**
     * @OA\Post(
     * path="/api/login",
     * summary="Login user",
     * tags={"Auth"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"email","password"},
     * @OA\Property(property="email", type="string", example="nevena@gmail.com"),
     * @OA\Property(property="password", type="string", example="password123")
     * )
     * ),
     * @OA\Response(response=200, description="Login successful"),
     * @OA\Response(response=401, description="Invalid credentials")
     * )
     */


    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Wrong credentials'], 401);
        }

        $user = User::where('email', $request['email'])->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => $user->name . ' logged in',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin ?? false
            ],
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }
/**
     * @OA\Post(
     * path="/api/logout",
     * summary="Logout user",
     * tags={"Auth"},
     * security={{"sanctum":{}}},
     * @OA\Response(response=200, description="Logged out successfully")
     * )
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return [
            'message' => 'You have successfully logged out.'
        ];
    }
/**
     * @OA\Get(
     * path="/api/users",
     * summary="Get all users (Admin only)",
     * tags={"Users"},
     * security={{"sanctum":{}}},
     * @OA\Response(response=200, description="List of users"),
     * @OA\Response(response=403, description="Unauthorized")
     * )
     */

    public function index()
    {
        $users = User::select('id', 'name', 'email', 'is_admin')->get();
        return response()->json(['users' => $users]);
    }
}
