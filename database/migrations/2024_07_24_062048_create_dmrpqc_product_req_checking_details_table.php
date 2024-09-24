<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDmrpqcProductReqCheckingDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dmrpqc_product_req_checking_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('prod_req_checking_id')->references('id')->on('dmrpqc_product_req_checkings')->comment ='dmrpqc_product_req_checkings (table)';
            $table->tinyInteger('process_category')->default(0)->comment = '0-Unchanged, 1 - Production Update, 2 - Engr Tech Update, 3 - LQC update, 4 - Process Engr Update';
            $table->unsignedTinyInteger('eval_sample')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('japan_sample')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('last_prodn_sample')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('material_drawing')->nullable()->comment = '1 - Checked';
            $table->string('material_drawing_no')->nullable();
            $table->string('material_rev_no')->nullable();
            $table->unsignedTinyInteger('insp_guide')->nullable()->comment = '1 - Checked';
            $table->string('insp_guide_drawing_no')->nullable();
            $table->string('insp_guide_rev_no')->nullable();
            $table->unsignedTinyInteger('dieset_eval_report')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('cosmetic_defect')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('pingauges')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('measurescope')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('n_a')->nullable()->comment = '1 - Checked';
            $table->string('visual_insp_name')->nullable();
            $table->string('visual_insp_datetime')->nullable();
            $table->unsignedTinyInteger('visual_insp_result')->nullable()->comment = '0 - NG, 1 - OK';
            $table->string('dimension_insp_name')->nullable();
            $table->string('dimension_insp_datetime')->nullable();
            $table->unsignedTinyInteger('dimension_insp_result')->nullable()->comment = '0 - NG, 1 - OK';
            $table->string('actual_checking_remarks')->nullable();

            // Defaults
            $table->foreignId('created_by')->references('id')->on('users')->comment ='users (table)';
            $table->foreignId('last_updated_by')->references('id')->on('users')->comment ='users (table)';
            $table->tinyInteger('status')->default(0)->comment = '0 - Unchanged, 1 - Done';
            $table->tinyInteger('logdel')->default(0)->comment = '0 - Active, 1 - Deleted';
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
        Schema::dropIfExists('dmrpqc_product_req_checking_details');
    }
}
