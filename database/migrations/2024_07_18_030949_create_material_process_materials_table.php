<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMaterialProcessMaterialsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('material_process_materials', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('mat_proc_id')->nullable()->comment = "material_processes";
            $table->string('material_id')->nullable()->comment = "db_pps tbl_Warehouse";
            $table->string('material_type');
            $table->string('material_code');
            $table->string('status')->default(0);
            $table->foreignId('created_by')->references('id')->on('users')->comment ='Id from users';
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
        Schema::dropIfExists('material_process_materials');
    }
}
