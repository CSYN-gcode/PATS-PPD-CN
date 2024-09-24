<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DmcmsDevices extends Model
{
    use HasFactory;

    protected $table = "tbl_device";
    protected $connection = "mysql_rapid_molding_dmcms";
}
