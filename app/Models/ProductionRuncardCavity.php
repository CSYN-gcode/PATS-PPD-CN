<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionRuncardCavity extends Model
{
    use HasFactory;

    protected $table = "production_runcard_cavities";
    protected $connection = "mysql";
}
