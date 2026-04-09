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
        Schema::create('brands', function (Blueprint $table) {
            $table->increments('id');   // Id INT(10) UNSIGNED AUTO_INCREMENT
            $table->string('name', 150)->unique;
            $table->string('image', 255)->nullable(); 
            $table->text('description')->nullable(); 
            $table->tinyInteger('status')->unsigned()->default(1); // 1=active, 0=inactive
            $table->timestamps(); // created_at và updated_at
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};
