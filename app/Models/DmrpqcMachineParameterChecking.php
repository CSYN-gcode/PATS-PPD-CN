<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DmrpqcMachineParameterChecking extends Model
{
    use HasFactory;

    public function checked_by()
    {
    	return $this->hasOne(User::class, 'id', 'checked_by');
    }
}
