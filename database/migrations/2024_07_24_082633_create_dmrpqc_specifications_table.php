<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDmrpqcSpecificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dmrpqc_specifications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('request_id')->comment = 'id from dmrpqc_product_identifications';
            //Result -> NG
            $table->unsignedTinyInteger('ng_issued_ptnr')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('ng_coordinate_to_ts_cn_assembly')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('ng_discussion_w_tech_adviser')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('ng_go_production')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('ng_stop_production')->nullable()->comment = '1 - Checked';
            $table->unsignedBigInteger('ng_judged_by')->nullable();
            $table->string('ng_datetime')->nullable();
            //Result -> OK
            $table->unsignedTinyInteger('ok_go_production')->nullable()->comment = '1 - Checked';
            $table->unsignedBigInteger('ok_verified_by')->nullable();
            $table->string('ok_datetime')->nullable();
            //Eng`g Head
            $table->unsignedTinyInteger('engr_head_go_production')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('engr_head_stop_production')->nullable()->comment = '1 - Checked';
            $table->string('remarks')->nullable();
            $table->string('signed')->nullable();
            $table->string('engr_head_datetime')->nullable();

            // Defaults
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('last_updated_by')->nullable();
            $table->tinyInteger('status')->default(0)->comment = '0-Unchanged, 1 - Process Eng`g Update, 2 - QC update';
            $table->tinyInteger('logdel')->default(0)->comment = '0-Active, 1-Deleted';
            $table->timestamps();

            // Foreign Key
            $table->foreign('request_id')->references('id')->on('dmrpqc_product_identifications');
            $table->foreign('ng_judged_by')->references('id')->on('users');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('last_updated_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dmrpqc_specifications');
    }
}
