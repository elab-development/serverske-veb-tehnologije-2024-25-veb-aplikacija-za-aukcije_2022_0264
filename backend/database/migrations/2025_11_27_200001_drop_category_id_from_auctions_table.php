<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('auctions', function (Blueprint $table) {
            // SQLite doesn't support dropping foreign keys easily
            // So we'll just drop the column without dropping the foreign key
            if (Schema::hasColumn('auctions', 'category_id')) {
                // For SQLite, we need to use raw query
                if (DB::connection()->getDriverName() === 'sqlite') {
                    DB::statement('ALTER TABLE auctions DROP COLUMN category_id');
                } else {
                    $table->dropForeign(['category_id']);
                    $table->dropColumn('category_id');
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('auctions', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('cascade');
        });
    }
};
