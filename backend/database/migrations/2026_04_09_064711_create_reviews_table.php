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
        Schema::create('reviews', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('rental_id')->unique();
            $table->unsignedInteger('user_id');
            $table->tinyInteger('rating')->unsigned();
            $table->text('comment')->nullable();
            $table->tinyInteger('status')->unsigned()->default(1);
            $table->timestamps();
        
            // FK
            $table->foreign('rental_id')
                  ->references('id')->on('rentals')
                  ->onDelete('cascade');
        
            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
