<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\DropdownOqcAql;
use App\Models\ProductionRuncard;
use App\Models\DropdownOqcFamily;
use App\Models\OqcInspectionReelLot;
use App\Models\OqcInspectionPrintLot;
use App\Models\OqcInspectionModeOfDefect;
use App\Models\DropdownOqcInspectionType;
use App\Models\DropdownOqcInspectionLevel;
use App\Models\DropdownOqcSeverityInspection;

class OqcInspection extends Model
{
    protected $table = "oqc_inspections";
    protected $connection = "mysql";

    public function reel_lot_oqc_inspection_details(){
        return $this->hasMany(OqcInspectionReelLot::class, 'oqc_inspection_id','id');
    }

    public function print_lot_oqc_inspection_details(){
        return $this->hasMany(OqcInspectionPrintLot::class, 'oqc_inspection_id','id');
    }

    public function mod_oqc_inspection_details(){
        return $this->hasMany(OqcInspectionModeOfDefect::class, 'oqc_inspection_id','id');
    }

    public function oqc_inspection_aql_info(){
        return $this->hasOne(DropdownOqcAql::class,'id', 'aql');
    }

    public function oqc_inspection_severity_inspection_info(){
        return $this->hasOne(DropdownOqcSeverityInspection::class,'id', 'severity_of_inspection');
    }

    public function oqc_inspection_type_info(){
        return $this->hasOne(DropdownOqcInspectionType::class,'id', 'type_of_inspection');
    }

    public function oqc_inspection_family_info(){
        return $this->hasOne(DropdownOqcFamily::class,'id', 'family');
    }

    public function oqc_inspection_level_info(){
        return $this->hasOne(DropdownOqcInspectionLevel::class,'id', 'inspection_lvl');
    }

    public function production_runcard_info(){
        return $this->hasOne(ProductionRuncard::class,'id', 'production_runcard_id');
    }

    public function user_info(){
        return $this->hasOne(User::class, 'employee_id', 'update_user');
    }
}
