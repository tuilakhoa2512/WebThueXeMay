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
        Schema::create('rentals', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('vehicle_id');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->tinyInteger('status')->unsigned()->default(0);
            $table->decimal('total_price', 10, 2);
            $table->timestamps();
        
            // FK
            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade');
        
            $table->foreign('vehicle_id')
                  ->references('id')->on('vehicles')
                  ->onDelete('cascade');
        });       
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};
