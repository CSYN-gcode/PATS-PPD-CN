<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DmrpqcDiesetCondition extends Model
{
    use HasFactory;

    public function users(){
        return $this->hasOne(User::class, 'id', 'created_by');
    }

    public function in_charged()
    {
    	return $this->hasOne(User::class, 'id', 'in_charged');
    }

    public function checked_by()
    {
    	return $this->hasOne(User::class, 'id', 'mold_check_checked_by');
    }

    public function drawing_fabricated_by()
    {
    	return $this->hasOne(User::class, 'id', 'drawing_fabricated_by');
    }

    public function drawing_validated_by()
    {
    	return $this->hasOne(User::class, 'id', 'drawing_validated_by');
    }
}
