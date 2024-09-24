<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDmrpqcCompletionActivitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dmrpqc_completion_activities', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('request_id')->comment = 'id from dmrpqc_product_identifications';
            $table->string('trouble_content')->nullable();
            $table->string('illustration')->nullable();
            $table->string('remarks')->nullable();
            $table->unsignedTinyInteger('finished_po')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('with_po_received')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('po_not_yet_finished')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('mold_checking')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('sample_attachment')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('illustration_attachment')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('for_repair')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('mold_clean')->nullable()->comment = '1 - Checked';
            $table->string('prepared_by')->nullable();
            $table->string('date')->nullable();
            $table->string('time')->nullable();
            $table->string('shots')->nullable();
            $table->string('shot_accume')->nullable();
            $table->string('maintenance_cycle')->nullable();
            $table->string('maintenance_no')->nullable();
            $table->string('date_needed')->nullable();
            $table->string('ship_sched')->nullable();
            $table->string('ptnr_ctrl_no')->nullable();
            $table->string('checked_by')->nullable();
            $table->unsignedTinyInteger('with_produce_unit')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('without_produce_unit')->nullable()->comment = '1 - Checked';
            $table->string('affected_lot')->nullable();
            $table->string('affected_lot_qty')->nullable();
            $table->string('backtracking_lot')->nullable();
            $table->string('backtracking_lot_qty')->nullable();

            // Defaults
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('last_updated_by')->nullable();
            $table->tinyInteger('status')->default(0)->comment = '0-Unchanged, 1 - Updated';
            $table->tinyInteger('logdel')->default(0)->comment = '0-Active, 1-Deleted';
            $table->timestamps();

            // Foreign Key
            $table->foreign('request_id')->references('id')->on('dmrpqc_product_identifications');
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
        Schema::dropIfExists('dmrpqc_completion_activities');
    }
}
