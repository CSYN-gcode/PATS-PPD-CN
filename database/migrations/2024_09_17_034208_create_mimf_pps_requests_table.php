<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMimfPpsRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mimf_pps_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('mimf_id')->comment = 'mimfs ID';
            $table->unsignedBigInteger('pps_whse_id')->comment = 'tbl_Warehouse ID';
            $table->unsignedBigInteger('pps_dieset_id')->comment = 'For Molding - tbl_dieset ID';
            $table->unsignedBigInteger('ppd_mimf_matrix_id')->comment = 'mimf_stamping_matrices ID';
            $table->unsignedBigInteger('ppd_matrix_id')->comment = 'For Molding';
            $table->string('material_code')->nullable();
            $table->string('material_type')->nullable();
            $table->string('qty_invt')->nullable();
            $table->string('request_qty')->nullable();
            $table->string('needed_kgs')->nullable();
            $table->string('virgin_material')->nullable();
            $table->string('recycled')->nullable();
            $table->string('prodn')->nullable();
            $table->string('delivery')->nullable();
            $table->string('remarks')->nullable();
            $table->string('created_by')->nullable();
            $table->string('updated_by')->nullable();
            $table->unsignedTinyInteger('logdel')->default(0)->comment = '0-show,1-hide';
            $table->timestamps();

            $table->foreign('mimf_id')->references('id')->on('mimfs');
            $table->foreign('ppd_mimf_matrix_id')->references('id')->on('mimf_stamping_matrices');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mimf_pps_requests');
    }
}
