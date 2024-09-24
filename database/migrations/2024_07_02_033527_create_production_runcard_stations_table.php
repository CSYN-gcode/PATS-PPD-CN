<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductionRuncardStationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('production_runcard_stations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('prod_runcards_id')->comment ='ID from production_runcards(table)';
            $table->string('station')->nullable()->comment = '1 = Plastic Injection, 2 = Qualification, 2A = Finishing, 3 = Visual Inspection, 4 = Oqc Inspection, 4A = Sorting, 5 = Packing';
            $table->string('station_step')->nullable();
            $table->string('sub_station')->nullable();
            $table->string('sub_station_step')->nullable()->comment = '1 = Plasctic Injection, 2 = Production, 3 = QC, 4 = Rework, 5 = Segregation, 6 = Airblowing, 7 = Visual Inspection, 8 = 1st Sub, 9 = 1st Sub(V.I), 10 = 2nd Sub(V.I), 11 = 2nd Sub, 12 = Packing, 13 = Packing Inspection';
            $table->string('date')->nullable();
            $table->string('operator_name')->nullable();
            $table->string('input_quantity')->nullable();
            $table->string('ng_quantity')->nullable();
            $table->string('output_quantity')->nullable();
            $table->longText('remarks')->nullable();

            $table->string('plastic_injection_machine_no')->nullable()->comment = 'Plastic Injection Only';
            $table->string('visual_insp_actual_sample')->nullable()->comment = 'Visual Inspection Only';
            $table->string('sorting_guaranteed_from')->nullable()->comment = 'Sorting Only';
            $table->string('sorting_problem')->nullable()->comment = 'Sorting Only';
            $table->string('sorting_document_no')->nullable()->comment = 'Sorting Only';
            $table->string('oqc_lot_qty')->nullable()->comment = 'OQC Inspection Only';
            $table->string('packing_prod_stamp')->nullable()->comment = 'Packing Only';


            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('last_updated_by')->nullable();
            $table->tinyInteger('status')->default(0)->comment ='';
            $table->softDeletes()->comment ='0-Active, 1-Deleted';
            $table->timestamps();

            // Foreign Key
             $table->foreign('created_by')->references('id')->on('users');
             $table->foreign('last_updated_by')->references('id')->on('users');
             $table->foreign('prod_runcards_id')->references('id')->on('production_runcards');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('production_runcard_stations');
    }
}
