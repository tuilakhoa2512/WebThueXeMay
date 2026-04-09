<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->unsignedInteger('category_id'); // FK -> categories.id
            $table->unsignedInteger('brand_id');    // FK -> brands.id
            $table->string('license_plate', 50)->unique();
            $table->decimal('price_per_day', 10, 2);
            $table->tinyInteger('status')->unsigned()->default(0);
            $table->timestamps();
            // FOREIGN KEY CONSTRAINTS
            $table->foreign('category_id')
                  ->references('id')->on('categories')
                  ->onDelete('cascade');

            $table->foreign('brand_id')
                  ->references('id')->on('brands')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
