<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductionRuncardCavitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('production_runcard_cavities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('prod_runcards_id')->comment ='ID from production_runcards(table)';
            $table->string('cavity')->nullable();
            $table->string('input_quantity')->nullable();
            $table->string('output_quantity')->nullable();
            $table->string('ng_quantity')->nullable();
            $table->longText('remarks')->nullable();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('last_updated_by')->nullable();
            $table->tinyInteger('status')->default(0)->comment ='';
            $table->softDeletes()->comment ='0-Active, 1-Deleted';
            $table->timestamps();

            // Foreign Key
             $table->foreign('created_by')->references('id')->on('users');
             $table->foreign('last_updated_by')->references('id')->on('users');
             $table->foreign('prod_runcards_id')->references('id')->on('production_runcards');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('production_runcard_cavities');
    }
}
