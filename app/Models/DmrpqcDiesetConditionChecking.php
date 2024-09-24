<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DmrpqcDiesetConditionChecking extends Model
{
    use HasFactory;

    public function checked_by()
    {
    	return $this->hasOne(User::class, 'id', 'checked_by');
    }
}
