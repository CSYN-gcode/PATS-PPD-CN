<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DmrpqcMachineSetup extends Model
{
    use HasFactory;

    public function first_in_charged()
    {
    	return $this->hasOne(User::class, 'id', 'first_in_charged');
    }

    public function second_in_charged()
    {
    	return $this->hasOne(User::class, 'id', 'second_in_charged');
    }

    public function third_in_charged()
    {
    	return $this->hasOne(User::class, 'id', 'third_in_charged');
    }
}
