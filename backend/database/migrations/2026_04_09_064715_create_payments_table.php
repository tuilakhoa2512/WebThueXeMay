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
        Schema::create('payments', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('rental_id')->unique();
            $table->decimal('amount', 10, 2);
            $table->string('payment_method', 50);
            $table->tinyInteger('status')->unsigned()->default(0);
        
            // FK
            $table->foreign('rental_id')
                  ->references('id')->on('rentals')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
