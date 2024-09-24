<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DmrpqcSpecification extends Model
{
    use HasFactory;
    
    public function ng_judged_by()
    {
    	return $this->hasOne(User::class, 'id', 'ng_judged_by');
    }

    public function ok_verified_by()
    {
    	return $this->hasOne(User::class, 'id', 'ok_verified_by');
    }

    public function signed()
    {
    	return $this->hasOne(User::class, 'id', 'signed');
    }
    public function rapidx_user_details()
    {
        return $this->hasOne(RapidXUser::class, 'id','rapidx_id');
    }
}
