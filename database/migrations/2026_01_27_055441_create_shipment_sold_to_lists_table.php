<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShipmentSoldToListsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipment_sold_to_lists', function (Blueprint $table) {
            $table->increments('pkid'); // AUTO_INCREMENT

            $table->string('sold_to', 255);
            $table->string('division', 10);
            $table->string('lastupdate', 20);
            $table->string('username', 20);

            $table->tinyInteger('logdel')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shipment_sold_to_lists');
    }
}
