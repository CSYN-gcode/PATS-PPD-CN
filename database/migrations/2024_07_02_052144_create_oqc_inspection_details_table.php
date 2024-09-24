<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOqcInspectionDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('station_oqc_inspection_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('prod_runcard_station_id')->comment ='ID from production_runcard_stations(table)';
            $table->string('station')->nullable()->comment = '1 = 1st Sub, 2 = 2nd Sub';
            $table->string('station_step')->nullable();

            $table->string('actual_sample_result')->nullable();
            $table->string('actual_sample_used')->nullable();
            $table->string('judgement')->nullable();
            $table->string('remarks')->nullable();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('last_updated_by')->nullable();
            $table->tinyInteger('status')->default(0)->comment ='';
            $table->softDeletes()->comment ='0-Active, 1-Deleted';
            $table->timestamps();

            // Foreign Key
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('last_updated_by')->references('id')->on('users');
            $table->foreign('prod_runcard_station_id')->references('id')->on('production_runcard_stations');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('station_oqc_inspection_details');
    }
}
