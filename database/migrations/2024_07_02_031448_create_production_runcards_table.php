<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductionRuncardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('production_runcards', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('part_name')->nullable();
            $table->string('part_code')->nullable();
            $table->string('po_number')->nullable();
            $table->string('po_quantity')->nullable();
            $table->string('required_qty')->nullable();
            $table->string('production_lot')->nullable();
            $table->string('shipment_output')->nullable();
            $table->string('drawing_no')->nullable();
            $table->string('drawing_rev')->nullable();

            $table->string('material_name')->nullable();
            $table->string('material_lot')->nullable();
            $table->string('material_qty')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('contact_lot')->nullable();
            $table->string('contact_qty')->nullable();
            $table->string('me_name')->nullable();
            $table->string('me_lot')->nullable();
            $table->string('me_qty')->nullable();
            $table->string('ud_ptnr_no')->nullable();
            $table->string('sar_no')->nullable();
            $table->string('aer_no')->nullable();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('last_updated_by')->nullable();
            $table->tinyInteger('status')->default(0)->comment ='0 - Pending, 1 - Mass Prod, 2 - Resetup, 3 - Done';
            $table->softDeletes()->comment ='0-Active, 1-Deleted';
            $table->timestamps();

            // Foreign Key
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
        Schema::dropIfExists('production_runcards');
    }
}
