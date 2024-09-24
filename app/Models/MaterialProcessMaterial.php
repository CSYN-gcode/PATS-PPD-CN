<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialProcessMaterial extends Model
{
    protected $table = "material_process_materials";
    protected $connection = "mysql";

    public function stamping_pps_warehouse_info(){
        return $this->hasOne(TblWarehouse::class, 'PartNumber', 'material_code');
    }
}
