<?php

namespace App\Models;

use App\Models\OqcInspection;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionRuncard extends Model
{
    protected $table = 'production_runcards';
    protected $connection = 'mysql';

    public function device_details(){
    	return $this->hasOne(Devices::class,'name', 'part_name');
    }

    public function runcard_station(){
        return $this->hasMany(ProductionRuncardStation::class, 'prod_runcards_id', 'id');
    }

    // public function assembly_ipqc(){
    // 	return $this->hasOne(MoldingAssyIpqcInspection::class, 'fk_molding_assy_id', 'id');
    // }

    public function oqc_inspection_info(){
        return $this->hasOne(OqcInspection::class,'production_runcard_id', 'id')->orderBy('id', 'DESC')->where('logdel', 0);
    }

}
