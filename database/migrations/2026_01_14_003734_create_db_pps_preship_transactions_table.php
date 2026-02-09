<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDbPpsPreshipTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('db_pps_preship_transactions', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('pkid');
            $table->integer('delivery_updates_fkid');
            $table->string('fkControlNo', 50);
            $table->string('Master_CartonNo', 50);
            $table->string('ItemNo', 50);
            $table->string('PONo', 50);
            $table->string('Partscode', 50);
            $table->string('DeviceName', 50);
            $table->string('LotNo', 50);

            $table->float('Qty');

            $table->string('PackageCategory', 100);
            $table->string('PackageQty', 20);

            $table->string('WeighedBy', 50);
            $table->string('PackedBy', 50);
            $table->string('CheckedBy', 50);

            $table->text('Remarks');

            $table->string('LastUpdate', 30);
            $table->string('Username', 100);

            $table->boolean('logdel')->default(0);
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
        Schema::dropIfExists('db_pps_preship_transactions');
    }
}
