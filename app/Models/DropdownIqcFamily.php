<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Http\Controllers\IqcInspectionController;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DropdownIqcFamily extends Model
{
    use HasFactory;
    protected $connection = 'mysql';

    protected $table = 'dropdown_iqc_families';
}
// dropdown_iqc_families