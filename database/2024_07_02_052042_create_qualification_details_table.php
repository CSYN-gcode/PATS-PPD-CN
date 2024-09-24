<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQualificationDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qualification_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('prod_runcard_station_id')->comment ='ID from production_runcard_stations(table)';
            $table->string('station')->nullable()->comment = '1 = Production, 2 = QC';
            $table->string('station_step')->nullable();

            $table->string('prod_actual_sample_result')->nullable();
            $table->string('prod_actual_sample_used')->nullable();
            $table->string('prod_actual_sample_remarks')->nullable();
            $table->string('qc_actual_sample_result')->nullable();
            $table->string('qc_actual_sample_used')->nullable();
            $table->string('qc_actual_sample_remarks')->nullable();
            $table->string('qc_ct_height_data')->nullable();
            $table->string('engr_ct_height_data')->nullable();
            $table->string('engr_ct_height_data_remarks')->nullable();
            $table->string('defect_shortshot')->nullable();
            $table->string('defect_excess_plastic')->nullable();
            $table->string('defect_toolmark')->nullable();
            $table->string('defect_scratch')->nullable();
            $table->string('defect_dent')->nullable();
            $table->string('defect_stain')->nullable();
            $table->string('defect_others')->nullable();
            $table->string('defect_remarks')->nullable();

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
        Schema::dropIfExists('qualification_details');
    }
}
