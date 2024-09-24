<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDmrpqcMachineParameterCheckingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dmrpqc_machine_parameter_checkings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('request_id')->comment = 'id from dmrpqc_product_identifications';
            $table->unsignedTinyInteger('reference')->nullable()->comment = '1 - SMD, 2 - AED';
            //Pressure
            $table->string('pressure_engr_std_specs')->nullable();
            $table->string('pressure_engr_actual')->nullable();
            $table->unsignedTinyInteger('pressure_engr_result')->nullable()->comment = '0 - NG, 1 - OK';
            $table->string('pressure_engr_name')->nullable();
            $table->string('pressure_engr_date')->nullable();
            $table->string('pressure_qc_actual')->nullable();
            $table->unsignedTinyInteger('pressure_qc_result')->nullable()->comment = '0 - NG, 1 - OK';
            $table->string('pressure_qc_name')->nullable();
            $table->string('pressure_qc_date')->nullable();
            //Temp Nozzle
            $table->string('temp_nozzle_engr_std_specs')->nullable();
            $table->string('temp_nozzle_engr_actual')->nullable();
            $table->unsignedTinyInteger('temp_nozzle_engr_result')->nullable()->comment = '0 - NG, 1 - OK';
            $table->string('temp_nozzle_engr_name')->nullable();
            $table->string('temp_nozzle_engr_date')->nullable();
            $table->string('temp_nozzle_qc_actual')->nullable();
            $table->unsignedTinyInteger('temp_nozzle_qc_result')->nullable()->comment = '0 - NG, 1 - OK';
            $table->string('temp_nozzle_qc_name')->nullable();
            $table->string('temp_nozzle_qc_date')->nullable();
            // Temp Mold
            $table->string('temp_mold_engr_std_specs')->nullable();
            $table->string('temp_mold_engr_actual')->nullable();
            $table->unsignedTinyInteger('temp_mold_engr_result')->nullable()->comment = '0 - NG, 1 - OK';
            $table->string('temp_mold_engr_name')->nullable();
            $table->string('temp_mold_engr_date')->nullable();
            $table->string('temp_mold_qc_actual')->nullable();
            $table->unsignedTinyInteger('temp_mold_qc_result')->nullable()->comment = '0 - NG, 1 - OK';
            $table->string('temp_mold_qc_name')->nullable();
            $table->string('temp_mold_qc_date')->nullable();
            // Cooling Time
            $table->string('cooling_time_engr_std_specs')->nullable();
            $table->string('cooling_time_engr_actual')->nullable();
            $table->unsignedTinyInteger('cooling_time_engr_result')->nullable()->comment = '0 - NG, 1 - OK';
            $table->string('cooling_time_engr_name')->nullable();
            $table->string('cooling_time_engr_date')->nullable();
            $table->string('cooling_time_qc_actual')->nullable();
            $table->unsignedTinyInteger('cooling_time_qc_result')->nullable()->comment = '0 - NG, 1 - OK';
            $table->string('cooling_time_qc_name')->nullable();
            $table->string('cooling_time_qc_date')->nullable();

            // Defaults
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('last_updated_by')->nullable();
            $table->tinyInteger('status')->default(0)->comment = '0-Unchanged, 1 - Process Eng`g Update, 2 - QC update';
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
        Schema::dropIfExists('dmrpqc_machine_parameter_checkings');
    }
}
