<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QualificationDetail extends Model
{
    use HasFactory;

    protected $table = "qualification_details";
    protected $connection = "mysql";

    public function user_prod_name(){
        return $this->hasOne(User::class, 'id', 'prod_name');
    }

    public function user_qc_name(){
        return $this->hasOne(User::class, 'id', 'prod_name');
    }

    public function prod_runcard_details(){
        return $this->hasOne(ProductionRuncard::class, 'id', 'fk_prod_runcard_id');
    }
}
