<?php

namespace App\Models;

use App\Models\dropdownIqcModeOfDefect;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OqcInspectionModeOfDefect extends Model
{
    protected $table = "oqc_inspection_mode_of_defects";
    protected $connection = "mysql";

    public function oqc_info_mod_info(){
        return $this->hasOne(dropdownIqcModeOfDefect::class,'id', 'mod');
    }
}
