<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 * title="Auction API",
 * version="1.0.0",
 * description="API dokumentacija za Auction sistem - Swaag Projekat"
 * )
 *
 * @OA\Server(
 * url="http://localhost:8000",
 * description="Lokalni server"
 * )
 *
 * @OA\SecurityScheme(
 * type="http",
 * securityScheme="sanctum",
 * scheme="bearer",
 * bearerFormat="JWT",
 * description="Unesite Bearer token (bez reči 'Bearer') da biste pristupili privatnim rutama."
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
