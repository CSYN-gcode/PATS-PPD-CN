<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QualificationDetailsMod extends Model
{
    use HasFactory;

    public function mode_of_defect(){
        return $this->hasMany(DefectsInfo::class, 'id', 'mod_id');
    }
}
