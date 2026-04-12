<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            $table->tinyInteger('status')
                ->unsigned()
                ->default(0)
                ->comment('0: pending | 1: confirmed | 2: renting | 3: completed | 4: canceled')
                ->change();
        });
    }

    public function down(): void
    {
        //
    }
};