<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\MimfStampingMatrix;
use App\Models\TblWarehouse;
use App\Models\TblDieset;
use App\Models\Devices;

class TblPoReceived extends Model
{
    use HasFactory;

    protected $connection = 'mysql_rapid_pps';
    protected $table = 'tbl_POReceived';

    public function po_received_to_pps_whse_info(){
        return $this->hasOne(TblWarehouse::class, 'PartNumber','ItemCode')->where('Factory', 3);
    }

    public function pps_dieset_info(){
        return $this->hasOne(TblDieset::class, 'DeviceName','ItemName');
    }

    public function matrix_info(){
        return $this->hasOne(Devices::class, 'name','ItemName');
    }
}
