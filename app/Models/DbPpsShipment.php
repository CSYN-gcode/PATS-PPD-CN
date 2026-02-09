<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DbPpsShipment extends Model
{
    use HasFactory;

    protected $connection = 'mysql';
    protected $table = 'shipments';

    public function shipment_details(){
        return $this->hasMany(ShipmentDetails::class, 'shipment_id', 'id');
    }
}
