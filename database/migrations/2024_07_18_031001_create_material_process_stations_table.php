<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMaterialProcessStationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('material_process_stations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('mat_proc_id')->nullable()->comment = "Id from material_processes";
            $table->unsignedInteger('station_id')->nullable()->comment = "Id from stations";
            $table->integer('status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('material_process_stations');
    }
}
