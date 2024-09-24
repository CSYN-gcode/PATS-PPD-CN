<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMaterialProcessesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('material_processes', function (Blueprint $table) {
            $table->id();
            $table->string('step');
            $table->string('process')->comment = "from processes";
            $table->foreignId('device_id')->references('id')->on('devices')->comment ='Id from devices';
            // $table->unsignedBigInteger('device_id')->comment = "devices table";
            $table->string('machine_code')->nullable()->comment = "EEDMS generallogistics table";
            $table->string('machine_name')->nullable()->comment = "EEDMS generallogistics table";
            $table->string('status')->default(0);
            $table->foreignId('created_by')->references('id')->on('users')->comment ='Id from users';
            // $table->unsignedBigInteger('last_updated_by')->nullable();
            $table->foreignId('last_updated_by')->references('id')->on('users')->nullable()->comment ='Id from users';
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
        Schema::dropIfExists('material_processes');
    }
}
