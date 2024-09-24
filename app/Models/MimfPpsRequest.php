<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MimfPpsRequest extends Model
{
    protected $table = "mimf_pps_requests";
    protected $connection = "mysql";

    public function mimf_info(){
        return $this->hasOne(Mimf::class, 'id','mimf_id');
    }

    public function rapid_pps_request_info(){
        return $this->hasOne(PPSRequest::class, 'mimf_pps_request_id','id');
    }
}
