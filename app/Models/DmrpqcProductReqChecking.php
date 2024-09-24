<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DmrpqcProductReqChecking extends Model
{
    use HasFactory;

    public function prod_req_checking_details(){
        return $this->hasMany(DmrpqcProductReqCheckingDetails::class, 'prod_req_checking_id','id');
    }
}
