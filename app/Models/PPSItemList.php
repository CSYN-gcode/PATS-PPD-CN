<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// use App\Models\MimfStampingMatrix;

class PPSItemList extends Model
{
    protected $table = "tbl_itemList";
    protected $connection = "mysql_rapid_pps";

    // public function mimf_stamping_matrix_info(){
    //     return $this->hasOne(MimfStampingMatrix::class, 'id','second_stamping_pps_whse_id');
    // }
}
