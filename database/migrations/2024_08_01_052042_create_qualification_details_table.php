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
            $table->unsignedBigInteger('fk_prod_runcard_id')->nullable()->comment = 'ID from production_runcard(table)';

            $table->string('prod_date')->nullable();
            $table->string('prod_name')->nullable();
            $table->string('prod_input_qty')->nullable();
            $table->string('prod_output_qty')->nullable();
            $table->string('prod_ng_qty')->nullable();
            $table->string('prod_mode_of_defect')->nullable();

            $table->string('qc_date')->nullable();
            $table->string('qc_name')->nullable();
            $table->string('qc_input_qty')->nullable();
            $table->string('qc_output_qty')->nullable();
            $table->string('qc_ng_qty')->nullable();
            $table->string('qc_mode_of_defect')->nullable();

            $table->string('prod_actual_sample_result')->nullable();
            $table->string('prod_actual_sample_used')->nullable();
            $table->string('prod_actual_sample_remarks')->nullable();

            $table->string('qc_actual_sample_result')->nullable();
            $table->string('qc_actual_sample_used')->nullable();
            $table->string('qc_actual_sample_remarks')->nullable();
            $table->string('qc_ct_height_data')->nullable();

            $table->string('engr_ct_height_data')->nullable();
            $table->string('engr_ct_height_data_remarks')->nullable();

            $table->string('defect_checkpoints')->nullable();
            $table->string('defect_remarks')->nullable();

            $table->tinyInteger('process_status')->comment = '1 - Production, 2 - QC, 3 - Engr';
            $table->tinyInteger('status')->default(0)->comment = '0-Pending, 1-Updated:Accepted(J), 2-Updated:Rejected(J), 3-Submitted:Accepted(J), 4-Submitted:Rejected(J), 5-For Re-Inspection';
            $table->tinyInteger('logdel')->default(0)->comment = '0-Active, 1-Deleted';
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('last_updated_by')->nullable();
            $table->softDeletes()->comment ='0-Active, 1-Deleted';
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('last_updated_by')->references('id')->on('users');
            $table->foreign('fk_prod_runcard_id')->references('id')->on('production_runcards');
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
