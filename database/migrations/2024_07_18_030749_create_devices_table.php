<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDevicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code');
            $table->integer('votes')->unsigned()->nullable()->default(12);
            $table->integer('qty_per_reel');
            $table->integer('qty_per_box');
            $table->integer('virgin_precent');
            $table->integer('recycle_precent');
            $table->string('process')->nullable()->comment = "0-Stamping, 1-Molding";
            $table->string('status')->default(1)->comment = "1-active, 2-Inactive";
            $table->foreignId('created_by')->references('id')->on('users')->comment ='Id from users';
            $table->foreignId('last_updated_by')->references('id')->on('users')->comment ='Id from users';
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
        Schema::dropIfExists('devices');
    }
}
