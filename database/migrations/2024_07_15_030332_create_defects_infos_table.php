<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDefectsInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('defects_infos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('station')->nullable()->comment('0 - Camera NG, 1 - Visual Defect');
            $table->string('defects')->nullable();
            $table->string('status')->default(0)->comment ='';
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
        Schema::dropIfExists('defects_infos');
    }
}
