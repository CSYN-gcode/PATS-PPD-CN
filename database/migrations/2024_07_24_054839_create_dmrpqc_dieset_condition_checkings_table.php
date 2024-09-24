    <?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDmrpqcDiesetConditionCheckingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dmrpqc_dieset_condition_checkings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('request_id')->comment = 'id from dmrpqc_product_identifications';
            $table->unsignedTinyInteger('good_condition')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('under_longevity')->nullable()->comment = '1 - Checked';
            $table->unsignedTinyInteger('problematic_die_set')->nullable()->comment = '1 - Checked';
            $table->unsignedBigInteger('checked_by')->nullable();
            $table->string('date')->nullable();
            // Defaults
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('last_updated_by')->nullable();
            $table->tinyInteger('status')->default(0)->comment = '0-Unchanged, 1-Updated';
            $table->tinyInteger('logdel')->default(0)->comment = '0-Active, 1-Deleted';
            $table->timestamps();

            // Foreign Key
            $table->foreign('request_id')->references('id')->on('dmrpqc_product_identifications');
            $table->foreign('checked_by')->references('id')->on('users');
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
        Schema::dropIfExists('dmrpqc_dieset_condition_checkings');
    }
}
