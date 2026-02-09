<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDbPpsPreshipmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('db_pps_preshipments', function (Blueprint $table) {
            $table->increments('id');
            $table->tinyInteger('status')->default(0)->comment ='0 - Pending, 2 - Done';
            $table->string('sales_cutoff')->nullable();
            $table->string('Date', 20);
            $table->string('Station', 50);
            $table->string('Packing_List_CtrlNo', 50);
            $table->string('Shipment_Date', 20);
            $table->string('Destination', 255);

            $table->integer('rapidx_MHChecking')->default(0);
            $table->integer('rapidx_QCChecking')->default(0);
            $table->integer('to_edit')->default(0);

            $table->string('remarks', 255)->nullable();

            $table->integer('Stamping')->default(0);
            $table->integer('grinding')->default(0);
            $table->integer('has_invalid')->default(0);
            $table->integer('for_pps_cn_transfer')->default(0);

            $table->string('LastUpdate', 20);
            $table->string('Username', 100);

            $table->boolean('logdel')->default(0);
            $table->softDeletes()->comment ='0-Active, 1-Deleted';
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
        Schema::dropIfExists('db_pps_preshipments');
    }
}
