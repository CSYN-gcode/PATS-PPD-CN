<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DmcmsShots extends Model
{
    use HasFactory;

    protected $table = "tbl_shots";
    protected $connection = "mysql_rapid_molding_dmcms";
}
