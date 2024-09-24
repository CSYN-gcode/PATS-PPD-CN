<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDmrpqcProductReqCheckingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dmrpqc_product_req_checkings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('request_id')->references('id')->on('dmrpqc_product_identifications')->comment ='dmrpqc_product_identifications (table)';
            $table->foreignId('created_by')->references('id')->on('users')->comment ='users (table)';
            $table->foreignId('last_updated_by')->references('id')->on('users')->comment ='users (table)';
            $table->tinyInteger('status')->default(0)->comment = '0-Unchanged, 1 - Production Update, 2 - Engr Tech Update, 3 - LQC update, 4 - Process Engr Update';
            $table->tinyInteger('logdel')->default(0)->comment = '0-Active, 1-Deleted';
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
        Schema::dropIfExists('dmrpqc_product_req_checkings');
    }
}
