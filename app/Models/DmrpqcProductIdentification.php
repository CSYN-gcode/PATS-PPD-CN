<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DmrpqcProductIdentification extends Model
{
    use HasFactory;

    protected $table = 'dmrpqc_product_identifications';

    public function users(){
        return $this->hasOne(User::class, 'id', 'created_by');
    }

    public function created_by(){
    	return $this->hasOne(User::class, 'id', 'created_by');
    }

    public function prod_req_checking(){
    	return $this->hasOne(DmrpqcProductReqChecking::class, 'id', 'created_by');
    }
}
