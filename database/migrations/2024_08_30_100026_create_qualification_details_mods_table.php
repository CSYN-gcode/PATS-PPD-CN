<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQualificationDetailsModsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qualification_details_mods', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('quali_details_id')->references('id')->on('qualification_details')->comment ='Id from qualification_details';
            $table->unsignedTinyInteger('process_status')->default(1)->comment ='1 - Production, 2 - QC';
            $table->foreignId('mod_id')->references('id')->on('defects_infos')->index('quali_defect_info_foreign')->comment ='Id from defects_infos(table)';
            $table->string('mod_quantity')->nullable();
            $table->foreignId('created_by')->nullable()->references('id')->on('users');
            $table->foreignId('last_updated_by')->nullable()->references('id')->on('users');
            $table->tinyInteger('status')->default(0)->comment ='';
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
        Schema::dropIfExists('qualification_details_mods');
    }
}
