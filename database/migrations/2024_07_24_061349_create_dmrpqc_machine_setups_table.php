<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDmrpqcMachineSetupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dmrpqc_machine_setups', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('request_id')->comment = 'id from dmrpqc_product_identifications';
            $table->tinyInteger('process_status')->comment = '1 - Production, 2 - Technician, 3 - Supervisor/Engr';
            $table->unsignedTinyInteger('first_adjustment')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('second_adjustment')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('third_adjustment')->nullable()->comment = '1 - Checked';
            $table->unsignedBigInteger('first_in_charged')->nullable();
            $table->unsignedBigInteger('second_in_charged')->nullable();
            $table->unsignedBigInteger('third_in_charged')->nullable();
            $table->string('first_date_time')->nullable();
            $table->string('second_date_time')->nullable();
            $table->string('third_date_time')->nullable();
            $table->string('first_remarks')->nullable();
            $table->string('second_remarks')->nullable();
            $table->string('third_remarks')->nullable();
            $table->TinyInteger('category')->comment = '1 - HVM, 2 - SMPO';

            // Defaults
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('last_updated_by')->nullable();
            $table->tinyInteger('status')->default(0)->comment = '0-Unchanged, 1-Updated';
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
        Schema::dropIfExists('dmrpqc_machine_setups');
    }
}
