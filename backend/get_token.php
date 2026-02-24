<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

// Find first user
$user = User::first();

if (!$user) {
    echo "No users found!\n";
    exit(1);
}

echo "User: {$user->name} (ID: {$user->id})\n";
echo "Token: {$user->createToken('test')->plainTextToken}\n";
