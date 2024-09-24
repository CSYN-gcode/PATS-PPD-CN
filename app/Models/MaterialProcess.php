<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialProcess extends Model
{
    use HasFactory;

    protected $table = "material_processes";
    protected $connection = "mysql";

    public function material_details(){
        return $this->hasMany(MaterialProcessMaterial::class, 'mat_proc_id', 'id');
    }

    public function process_details(){
        return $this->hasOne(Process::class, 'id', 'process');
    }

    public function station_details(){
        return $this->hasMany(MaterialProcessStation::class, 'mat_proc_id', 'id');
    }

    public function machine_details(){
        return $this->hasMany(MaterialProcessMachine::class, 'mat_proc_id', 'id');
    }

    public function device_details(){
        return $this->hasOne(Devices::class, 'id', 'device_id');

    }
}
