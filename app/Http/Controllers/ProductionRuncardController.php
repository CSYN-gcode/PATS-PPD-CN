<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use DataTables;

use App\Models\ProductionRuncard;
use App\Models\ProductionRuncardStation;
use App\Models\ProductionRuncardStationMod;
use App\Models\QualificationDetail;
use App\Models\OqcInspectionDetail;
use App\Models\Devices;

// use App\Models\Process;
// use App\Models\Device;
use QrCode;

class ProductionRuncardController extends Controller
{
    public function GetModeOfDefect(Request $request){
        $modeOfDefectResult = DB::connection('mysql')
        ->select("SELECT defects_infos.* FROM defects_infos
        ");
        return response()->json(['data' => $modeOfDefectResult]);
    }

    public function viewProdRuncard(Request $request){
            $ProdRuncardData = DB::table('production_runcards AS runcard')
                                    ->select('*')
                                    ->when($request->device_name, function ($query) use ($request){
                                        return $query ->where('runcard.part_name', $request->device_name)
                                                      ->whereNull('runcard.deleted_at');
                                    })
                                    ->get();
            // $ProdRuncardData = DB::connection('mysql')->select("SELECT a.* FROM production_runcards AS a
            //                                 WHERE a.device_name = '$request->device_name'
            //                                 ORDER BY a.id DESC
            // ");

            return DataTables::of($ProdRuncardData)
            ->addColumn('action', function($row){
                $result = '';
                $result .= "<center>";

                if($row->status == 0 || $row->status == 1 || $row->status == 3){
                    $result .= "<button class='btn btn-success btn-sm mr-1' prod_runcard-id='".$row->id."' id='btnPrintProdRuncard'>
                                    <i class='fa-solid fa-print' disabled></i>
                                </button>";
                }

                if($row->status == 0 || $row->status == 1){
                    $result .= "<button class='btn btn-primary btn-sm mr-1 btnUpdateProdRuncardData' prod_runcard-id='$row->id'>
                                <i class='fa-solid fa-pen-to-square'></i>
                            </button>";
                }

                if($row->status == 2 || $row->status == 3){
                    $result .= "<button class='btn btn-info btn-sm mr-1 btnViewProdRuncardData' prod_runcard-id='$row->id'>
                                    <i class='fa-solid fa-eye' title='View IPQC Inspection'></i>
                                </button>";
                }

                if($row->status == 1){
                    $result .= "<button class='btn btn-success btn-sm mr-1' prod_runcard-id='".$row->id."' prod_runcard-status='".$row->status."' id='btnSubmitRuncardData'>
                                    <i class='fa-solid fa-circle-check'></i>
                                </button>";
                }

                $result .= "</center>";
                return $result;
            })
            ->addColumn('status', function ($row){
                $result = "";

                switch($row->status){
                    case 0: //Pending
                        $result .= '<center><span class="badge badge-pill badge-info">For Station Process</span></center>';
                        break;
                    case 1: //Mass Prod
                        $result .= '<center><span class="badge badge-pill badge-primary">For Mass Production</span></center>';
                        break;
                    case 2: //Resetup
                        $result .= '<center><span class="badge badge-pill badge-warning">For Re-setup</span></center>';
                        break;
                    case 3: //Done
                        $result .= '<center><span class="badge badge-pill badge-success">Done</span></center>';
                        break;
                }
                return $result;
            })
            ->rawColumns(['action','status'])
            ->make(true);
        // }
    }

    public function viewProdRuncardStations(Request $request){
        // if(!isset($request->assy_runcard_id)){
        //     return [];
        // }else{
            $AssemblyRuncardStationData = DB::connection('mysql')->select("SELECT runcard_station.*, user.firstname, user.lastname, stations.station_name FROM production_runcard_stations AS runcard_station
                        -- INNER JOIN devices ON runcard.part_name = devices.name AND devices.status = 1
                        -- INNER JOIN material_processes AS process ON devices.id = process.device_id AND process.status = 0
                        INNER JOIN stations ON runcard_station.station = stations.id
                        INNER JOIN users AS user ON runcard_station.operator_name = user.id
                        WHERE runcard_station.prod_runcards_id = '$request->prod_runcard_id'
                        ORDER BY runcard_station.station_step ASC
            ");
            // return $AssemblyRuncardStationData;

            return DataTables::of($AssemblyRuncardStationData)
            ->addColumn('action', function($station) use ($request){
                $result = '';

                if($station->status == 0 || $station->status == 1){
                    $result .= "<center>
                                    <button class='btn btn-primary btn-sm mr-1 btnUpdateProdRuncardStationData' prod_runcard-id='$request->prod_runcard_id' prod_runcard_stations-id='$station->id'><i class='fa-solid fa-pen-to-square'></i></button>
                                </center>";
                }

                if($station->status == 2 || $station->status == 3){
                $result .= "<center>
                                <button class='btn btn-primary btn-sm mr-1 btnViewProdRuncardStationData' prod_runcard-id='$request->prod_runcard_id' prod_runcard_stations-id='$station->id'><i class='fa-solid fa-eye'></i></button>
                            </center>";
                }

                return $result;
            })
            ->addColumn('status', function($station){
                $result = '';
                if($station->status == 0 || $station->status == 1 || $station->status == 2){
                    $result .= "<center>
                                    <span class='badge rounded-pill bg-info'>On-going</span>
                                </center>";
                }

                if($station->status == 3){
                    $result .= "<center>
                                    <span class='badge rounded-pill bg-info'>Done</span>
                                </center>";
                }
                return $result;
            })
            ->addColumn('operator', function($station){
                $result = '';
                $result .= $station->firstname.' '.$station->lastname;
                return $result;
            })
            ->rawColumns(['action','status','runcard_no','operator'])
            ->make(true);
    }

    public function GetPOFromPPSDB(Request $request){
        $po_details = DB::connection('mysql_rapid_pps')->select(' SELECT po_receive.ItemName AS part_name, po_receive.OrderNo AS po_number
                            FROM tbl_POReceived AS po_receive
                            WHERE po_receive.ItemName = "'.$request->device_name.'" AND po_receive.POBalance > 0
        ');

        // return $po_details;

        // if(isset($request->po_number)){
        //     $po_details_test = $po_details->add('{"device_name": "CN176-16#MO", "po_number": "PR2410116399"}')->execute();
        //     // $po_details_test = $po_details->map(function ($item){
        //     //     $item = $request->device_name;
        //     //     $item = $request->po_number;
        //     //     // $item->ipqc_inspector_id = Auth::user()->id;
        //     //     // $item->ipqc_inspector_name = Auth::user()->firstname.' '.Auth::user()->lastname;
        //     //     return $item;
        //     // });
        // }else{
        //     $po_details_test = $po_details;
        // }

        // return $po_details_test;
        return response()->json(['result' => 1, 'po_details' => $po_details]);
    }

    public function searchPoFromPpsDb(Request $request){
        $po_details = DB::connection('mysql_rapid_pps')
        ->select(' SELECT po_receive.ItemName AS part_name, po_receive.ItemCode AS part_code, po_receive.OrderNo AS po_number, po_receive.OrderQty AS po_qty, dieset.DrawingNo AS drawing_no, dieset.Rev AS drawing_rev
            FROM tbl_POReceived AS po_receive
            LEFT JOIN tbl_dieset AS dieset ON po_receive.ItemCode = dieset.R3Code
            WHERE po_receive.OrderNo = "'.$request->po_number.'" AND po_receive.ItemName = "'.$request->device_name.'"
            ');

        // return $po_details;
        if(empty($po_details)){

            $result = 1;
            $po_details = '';
            $acdcs_data = '';

        }else{
            $exploded_device_name = explode("-",$po_details[0]->part_name);

            // CLARK 09182024
            $test = $exploded_device_name[0].'-'.$exploded_device_name[1];

            $acdcs_data = DB::connection('mysql_rapid_acdcs')
            ->select("SELECT DISTINCT `doc_no`,`doc_type`,`rev_no` FROM tbl_active_docs
            WHERE `doc_type` = '".$request->doc_type."' AND `doc_title` LIKE '%".$test."%'");
            // -- WHERE `doc_type` = '".$request->doc_type."' AND `doc_title` LIKE '%".$exploded_device_name[0]."%'");

            $result = 0;
            $po_details = $po_details[0];
            $acdcs_data = $acdcs_data[0];
        }

        return response()->json(['result' => $result, 'acdcs_data' => $acdcs_data, 'po_details' => $po_details]);
    }

    public function ValidateMatLotNumber(Request $request){
        $whs_material_name = DB::connection('mysql_rapid_pps')
                            // ->select(' SELECT *
                            ->select(' SELECT whs.MaterialType AS mat_name, whs_transaction.Lot_number AS lot_no, whs_class.id AS class_id
                                    FROM tbl_WarehouseTransaction AS whs_transaction
                                    INNER JOIN tbl_Warehouse AS whs ON whs_transaction.fkid = whs.id
                                    INNER JOIN tbl_Warehouse_Classification AS whs_class ON whs.Classification = whs_class.id
                                    -- WHERE whs_transaction.Lot_number = "'.$request->mat_lot_number.'" AND whs.MaterialType LIKE "%'.$request->material_type_to_match.'%"
                                    WHERE whs_transaction.Lot_number = "'.$request->mat_lot_number.'"
                                    LIMIT 1
                                ');

        if($whs_material_name != []){
        // return $whs_material_name;
        // dd($whs_material_name);
        // $whs_material_name != []
        // if(isset($whs_material_name[0])){
        // if($whs_material_name->isNotEmpty()){
            $matrix_details = DB::connection('mysql')
            ->table('material_processes')
            ->join('devices', 'material_processes.device_id', '=', 'devices.id')
            ->join('processes', 'material_processes.process', '=', 'processes.id')
            ->join('material_process_materials', 'material_process_materials.mat_proc_id', '=', 'material_processes.id')
            ->select('material_process_materials.material_type', 'material_process_materials.material_code', 'devices.code', 'devices.name', 'processes.process_name')
            ->where('processes.process_name', 'Production Runcard')
            ->where('devices.name', $request->device_name)
            ->where('material_process_materials.material_type', $whs_material_name[0]->mat_name)
            ->get();
        // }else{
            // $matrix_details = 'blank';
        // }
            if($matrix_details == []){
                $matrix_details = 'blank';
            }
        }else{
            $matrix_details = 'blank';
        }

        // return $matrix_details;
        // return response()->json(['data' => $matrix_details]);

        return response()->json(['result' => 0, 'material_class' => $whs_material_name, 'matrix_data' => $matrix_details ]);
    }

    public function addProdRuncardData(Request $request){
        date_default_timezone_set('Asia/Manila');
        $data = $request->all();
          // return $data;
        $arr_material_codes = [];
        $arr_material_types = [];
        $device_details = DB::connection('mysql')
                        ->table('material_processes')
                        ->join('devices', 'material_processes.device_id', '=', 'devices.id')
                        ->join('processes', 'material_processes.process', '=', 'processes.id')
                        ->join('material_process_materials', 'material_process_materials.mat_proc_id', '=', 'material_processes.id')
                        ->select('material_process_materials.material_code', 'material_process_materials.material_type')
                        ->where('processes.process_name', 'Production Runcard')
                        ->where('devices.name', $request->part_name)
                        ->get();

        // return $device_details;
        foreach($device_details as $material_details){
            $arr_material_codes[] = $material_details->material_code;
            $arr_material_types[] = $material_details->material_type;
        }

        if(in_array('LAPEROS',$arr_material_types) && in_array('CT',$arr_material_types) && in_array('ME',$arr_material_types)){
            $validate_array = ['po_number' => 'required', 'production_lot_time' => 'required', 'material_lot' => 'required', 'contact_mat_lot' => 'required', 'me_mat_lot' => 'required'];
        }else{
            $validate_array = ['po_number' => 'required', 'production_lot_time' => 'required', 'material_lot' => 'required'];
        }

        // $required_material_codes = implode(',',$arr_material_codes);
        // return $required_material_codes;

        // if($request->device_name == 'CN171P-007-1002-VE(01)'){
        //     $validate_array = ['po_number' => 'required', 'p_zero_two_prod_lot' => 'required'];
        // }else{
        //     $validate_array = ['po_number' => 'required', 's_zero_seven_prod_lot' => 'required', 's_zero_two_prod_lot' => 'required'];
        // }

        // $validate_array = [];
        $validator = Validator::make($data, $validate_array);

        if ($validator->fails()) {
            return response()->json(['validation' => 'hasError', 'error' => $validator->messages()]);
        }else {
            try{
                if(!isset($request->prod_runcard_id)){
                    ProductionRuncard::insert([
                                    'part_name'       => $request->part_name,
                                    'part_code'       => $request->part_code,
                                    'po_number'       => $request->po_number,
                                    'po_quantity'     => $request->po_quantity,
                                    'required_qty'    => $request->required_output,
                                    'production_lot'  => $request->production_lot,
                                    'shipment_output' => $request->shipment_output,
                                    'drawing_no'      => $request->drawing_no,
                                    'drawing_rev'     => $request->drawing_rev,
                                    'material_name'   => $request->material_name,
                                    'material_lot'    => $request->material_lot,
                                    'material_qty'    => $request->material_qty,
                                    'contact_name'    => $request->contact_mat_name,
                                    'contact_lot'     => $request->contact_mat_lot,
                                    'contact_qty'     => $request->contact_mat_qty,
                                    'me_name'         => $request->me_mat_name,
                                    'me_lot'          => $request->me_mat_lot,
                                    'me_qty'          => $request->me_mat_qty,
                                    'ud_ptnr_no'      => $request->ud_ptnr_no,
                                    'sar_no'          => $request->sar_no,
                                    'aer_no'          => $request->aer_no,
                                    'created_by'      => Auth::user()->id,
                                    'last_updated_by' => Auth::user()->id,
                                    'created_at'      => date('Y-m-d H:i:s'),
                                    'updated_at'      => date('Y-m-d H:i:s')
                    ]);

                    DB::commit();
                    return response()->json(['result' => 1]);
                }else{
                    ProductionRuncard::where('id', $request->prod_runcard_id)
                            ->update([
                                    'part_name'       => $request->part_name,
                                    'part_code'       => $request->part_code,
                                    'po_number'       => $request->po_number,
                                    'po_quantity'     => $request->po_quantity,
                                    'required_qty'    => $request->required_output,
                                    'production_lot'  => $request->production_lot,
                                    'shipment_output' => $request->shipment_output,
                                    'drawing_no'      => $request->drawing_no,
                                    'drawing_rev'     => $request->drawing_rev,
                                    'material_name'   => $request->material_name,
                                    'material_lot'    => $request->material_lot,
                                    'material_qty'    => $request->material_qty,
                                    'contact_name'    => $request->contact_mat_name,
                                    'contact_lot'     => $request->contact_mat_lot,
                                    'contact_qty'     => $request->contact_mat_qty,
                                    'me_name'         => $request->me_mat_name,
                                    'me_lot'          => $request->me_mat_lot,
                                    'me_qty'          => $request->me_mat_qty,
                                    'ud_ptnr_no'      => $request->ud_ptnr_no,
                                    'sar_no'          => $request->sar_no,
                                    'aer_no'          => $request->aer_no,
                                    'created_by'      => Auth::user()->id,
                                    'last_updated_by' => Auth::user()->id,
                                    'created_at'      => date('Y-m-d H:i:s'),
                                    'updated_at'      => date('Y-m-d H:i:s')
                            ]);

                    DB::commit();
                    return response()->json(['result' => 1]);
                }
            } catch (\Throwable $th) {
                return $th;
            }
        }
    }

    public function getProdRuncardData(Request $request){

        $prod_runcard_data = DB::table('production_runcards AS runcard')->select('runcard.*')
                            ->leftJoin('production_runcard_stations AS stations', 'runcard.id', '=', 'stations.prod_runcards_id')
                            // ->leftJoin('station_qualification_details AS quali_station', 'stations.id', '=', 'quali_station.prod_runcard_station_id')
                            ->leftJoin('users AS user', 'stations.operator_name', '=', 'user.id')
                            ->where('runcard.id', '=', $request->prod_runcard_id)
                            ->whereNull('runcard.deleted_at')
                            ->when($request->prod_runcard_station_id, function ($query) use ($request){
                                return $query->addSelect('user.firstname AS first_name',
                                                        'user.lastname AS last_name',
                                                        'stations.id AS station_id',
                                                        'stations.station AS station',
                                                        'stations.station_step AS station_step',
                                                        'stations.sub_station AS sub_station',
                                                        'stations.sub_station_step AS sub_station_step',
                                                        'stations.date AS station_date',
                                                        'stations.operator_name AS station_operator_name',
                                                        'stations.input_quantity AS station_input_qty',
                                                        'stations.ng_quantity AS station_ng_qty',
                                                        'stations.output_quantity AS station_output_qty',
                                                        'stations.remarks AS station_remarks',
                                                        'stations.plastic_injection_machine_no AS station_plastic_injection_machine_no',
                                                        'stations.visual_insp_actual_sample AS station_visual_insp_actual_sample',
                                                        'stations.sorting_guaranteed_from AS station_sorting_guaranteed_from',
                                                        'stations.sorting_problem AS station_sorting_problem',
                                                        'stations.sorting_document_no AS station_sorting_document_no',
                                                        'stations.oqc_lot_qty AS station_oqc_lot_qty',
                                                        'stations.packing_prod_stamp AS station_packing_prod_stamp',
                                                        'stations.status AS station_status',
                                                        'stations.deleted_at AS station_deleted_at')
                                            ->where('stations.id', $request->prod_runcard_station_id)
                                            ->whereNull('stations.deleted_at');
                            })->get();

        // return $prod_runcard_data;
        // return json_encode($prod_runcard_data);
        // $prod_runcard_data = DB::connection('mysql')->select("SELECT *
        //                 FROM production_runcards AS runcard
        //                 LEFT JOIN production_runcard_stations AS station ON runcard.id = station.prod_runcards_id
        //                 LEFT JOIN users AS station_user ON station.operator_name = station_user.id
        //                 WHERE runcard.id = '$request->prod_runcard_id'
        //                 WHEN station.prod_runcards_id = '$request->prod_runcard_station_id';
        //                 --  AND station.prod_runcards_id = '$request->prod_runcard_station_id'
        //                 -- ORDER BY runcard_station.station_step ASC

        //     ");

        // $prod_runcard_data = ProductionRuncard::with(['assembly_runcard_station.station_name' ,'assembly_runcard_station.user'])
        //                                         ->when($request->assy_runcard_station_id, function ($station_query) use ($request){
        //                                             return $station_query ->with(['assembly_runcard_station' => function($station_id_query) use ($request){
        //                                                 return $station_id_query->where('id', $request->assy_runcard_station_id);
        //                                             }]);
        //                                         })
        //                                         ->whereNull('deleted_at')
        //                                         ->when($request->assy_runcard_id, function ($query) use ($request){
        //                                                 return $query ->where('id', $request->assy_runcard_id);
        //                                         })
        //                                         ->when($request->po_number, function ($query) use ($request){
        //                                                 return $query ->where('po_number', $request->po_number);
        //                                         })
        //                                         ->get();

        // $prod_runcard_data = ProductionRuncard::whereNull('deleted_at')
        //                                         ->when($request->prod_runcard_id, function ($query) use ($request){
        //                                                 return $query ->where('id', $request->prod_runcard_id);
        //                                         })->get();

        if(isset($request->prod_runcard_station_id)){
            $mode_of_defect_data =  ProductionRuncardStationMod::with(['mode_of_defect'])->where('prod_runcard_stations_id', $request->prod_runcard_station_id)
            ->whereNull('deleted_at')
            ->get();
        }else{
            $mode_of_defect_data = [];
        }

        // return response()->json(['production_runcard_data' => $prod_runcard_data, 'mode_of_defect_data' => $mode_of_defect_data]);
        return response()->json(['runcard_data' => $prod_runcard_data, 'mode_of_defect_data' => $mode_of_defect_data]);
    }

    public function addProdRuncardStationData(Request $request){
        date_default_timezone_set('Asia/Manila');
        $data = $request->all();
        // return $data;

        // $validator = Validator::make($data, [
        //     'runcard_station' => 'required'
        // ]);

        // if($request->runcard_station == 4){ //Lubricant Coating
        //     $validate_array = ['runcard_station' => 'required', 'p_zero_two_prod_lot' => 'required'];
        // }else if($request->runcard_station == 5){//Lot Marking
        //     $validate_array = ['runcard_station' => 'required', 's_zero_seven_prod_lot' => 'required', 's_zero_two_prod_lot' => 'required'];
        // }else if($request->runcard_station == 6){//Visual Inspection
        //     $validate_array = ['runcard_station' => 'required', ];
        // }

        // $validator = Validator::make($data, $validate_array);

        // if ($validator->fails()) {
        //     return response()->json(['validation' => 'hasError', 'error' => $validator->messages()]);
        // }else {


            try{
                if(!isset($request->frmstations_runcard_station_id)){
                    if(ProductionRuncardStation::where('prod_runcards_id', $request->frmstations_runcard_id)->where('station', $request->runcard_station)->where('sub_station', $request->runcard_sub_station)->exists()){
                        return response()->json(['result' => 2]);
                    }else{
                        $prod_runcard_station_id = ProductionRuncardStation::insertGetId([
                                            'prod_runcards_id'             => $request->frmstations_runcard_id,
                                            'station'                      => $request->runcard_station,
                                            'station_step'                 => $request->step,
                                            'sub_station'                  => $request->runcard_sub_station,
                                            'sub_station_step'             => $request->sub_station_step,
                                            'date'                         => $request->date,
                                            'operator_name'                => Auth::user()->id,
                                            'input_quantity'               => $request->input_qty,
                                            'ng_quantity'                  => $request->ng_qty,
                                            'output_quantity'              => $request->output_qty,
                                            'remarks'                      => $request->remarks,
                                            'plastic_injection_machine_no' => $request->s1_machine_no,
                                            'visual_insp_actual_sample'    => $request->s3_actual_sample,
                                            'sorting_guaranteed_from'      => $request->s4a_guaranteed_from,
                                            'sorting_problem'              => $request->s4a_problem,
                                            'sorting_document_no'          => $request->s4a_document_no,
                                            'oqc_lot_qty'                  => $request->s4_lot_qty,
                                            'packing_prod_stamp'           => $request->s5_prod_stamp,
                                            // 'mode_of_defect'               => $request->mode_of_defect,
                                            // 'defect_qty'                   => $request->defect_quantity,
                                            'created_by'                   => Auth::user()->id,
                                            'last_updated_by'              => Auth::user()->id,
                                            'created_at'                   => date('Y-m-d H:i:s'),
                                            'updated_at'                   => date('Y-m-d H:i:s'),
                        ]);

                        ProductionRuncard::where('id', $request->frmstations_runcard_id)
                            ->update([
                                    'shipment_output'  => $request->output_qty,
                            ]);
                    }
                }else{
                    ProductionRuncardStation::where('id', $request->frmstations_runcard_station_id)
                        ->where('prod_runcards_id', $request->frmstations_runcard_id)
                        ->update([
                            'station'                      => $request->runcard_station,
                            'sub_station'                  => $request->runcard_sub_station,
                            'station_step'                 => $request->step,
                            'date'                         => $request->date,
                            'operator_name'                => Auth::user()->id,
                            'input_quantity'               => $request->input_qty,
                            'ng_quantity'                  => $request->ng_qty,
                            'output_quantity'              => $request->output_qty,
                            'remarks'                      => $request->remarks,
                            'plastic_injection_machine_no' => $request->s1_machine_no,
                            'visual_insp_actual_sample'    => $request->s3_actual_sample,
                            'sorting_guaranteed_from'      => $request->s4a_guaranteed_from,
                            'sorting_problem'              => $request->s4a_problem,
                            'sorting_document_no'          => $request->s4a_document_no,
                            'oqc_lot_qty'                  => $request->s4_lot_qty,
                            'packing_prod_stamp'           => $request->s5_prod_stamp,
                            // 'mode_of_defect'               => $request->mode_of_defect,
                            // 'defect_qty'                   => $request->defect_quantity,
                            'last_updated_by'              => Auth::user()->id,
                            'updated_at'                   => date('Y-m-d H:i:s'),
                        ]);

                    ProductionRuncard::where('id', $request->frmstations_runcard_id)
                        ->update([
                                'shipment_output'  => $request->output_qty,
                        ]);

                    // if($request->step == '2' && $request->sub_station_step == '2'){
                    //     QualificationDetail::insert([
                    //         'prod_runcard_station_id'     => $request->frmstations_runcard_station_id,
                    //         'station'                     => $request->runcard_station,
                    //         'station_step'                => $request->step,
                    //         'prod_actual_sample_result'   => $request->quali_prod_judgement,
                    //         'prod_actual_sample_used'     => $request->quali_prod_actual_sample,
                    //         'prod_actual_sample_remarks'  => $request->quali_prod_remarks,
                    //         'created_by'                  => Auth::user()->id,
                    //         'last_updated_by'             => Auth::user()->id,
                    //         'created_at'                  => date('Y-m-d H:i:s'),
                    //         'updated_at'                  => date('Y-m-d H:i:s')
                    //     ]);
                    // }else if($request->step == '2' && $request->sub_station_step == '3'){
                    //     QualificationDetail::where('id', $request->frmstations_runcard_id)->update([
                    //         'qc_actual_sample_result'     => $request->quali_qc_judgement,
                    //         'qc_actual_sample_used'       => $request->quali_qc_actual_sample,
                    //         'qc_actual_sample_remarks'    => $request->quali_qc_remarks,
                    //         'qc_ct_height_data'           => $request->ct_height_data_qc,
                    //         'engr_ct_height_data'         => $request->ct_height_data_engr,
                    //         'engr_ct_height_data_remarks' => $request->ct_height_data_remarks,
                    //         'defect_checkpoints'          => $defect_checkpoint,
                    //         'defect_remarks'              => $request->defect_checkpoint_remarks,
                    //         'created_by'                  => Auth::user()->id,
                    //         'last_updated_by'             => Auth::user()->id,
                    //         'created_at'                  => date('Y-m-d H:i:s'),
                    //         'updated_at'                  => date('Y-m-d H:i:s')
                    //     ]);
                    // }
                }

                if(isset($request->frmstations_runcard_station_id)){
                    $prod_runcard_station_id = $request->frmstations_runcard_station_id;
                }

                    if(isset($request->mod_id)){
                        $is_id_deleted = ProductionRuncardStationMod::where('prod_runcard_stations_id', $prod_runcard_station_id)->delete();

                        // return $request->mod_id;
                        foreach ($request->mod_id as $key => $value) {
                            ProductionRuncardStationMod::insert([
                                'prod_runcards_id'         => $request->frmstations_runcard_id,
                                'prod_runcard_stations_id' => $prod_runcard_station_id,
                                'mode_of_defects'              => $request->mod_id[$key],
                                // 'mod_id'                       => $request->mod_id[$key],
                                'mod_quantity'                 => $request->mod_quantity[$key],
                                'created_by'                   => Auth::user()->id,
                                'last_updated_by'              => Auth::user()->id,
                                'created_at'                   => date('Y-m-d H:i:s'),
                                'updated_at'                   => date('Y-m-d H:i:s'),
                            ]);
                        }

                    }else{
                        if(ProductionRuncardStationMod::where('prod_runcard_stations_id', $prod_runcard_station_id)->exists()){
                            $is_id_deleted = ProductionRuncardStationMod::where('prod_runcard_stations_id', $prod_runcard_station_id)->delete(); //returns true/false
                        }
                    }

                // return response()->json(['result' => 1, 'station' => $request->runcard_station,  'shipment_output' => $request->output_qty]);
                return response()->json(['result' => 1]);
            } catch (\Throwable $th) {
                return $th;
            }
        // }
    }

    public function UpdateProdRuncardStatus(Request $request){
        date_default_timezone_set('Asia/Manila');
        // session_start();
        ProductionRuncard::where('id', $request->runcard_id)
                    ->update([
                        'status'              => 1,
                        'last_updated_by'     => Auth::user()->id,
                        'updated_at'          => date('Y-m-d H:i:s'),
                    ]);

        ProductionRuncardStation::where('prod_runcards_id', $request->runcard_id)
                    ->update([
                        'status'              => 1,
                        'last_updated_by'     => Auth::user()->id,
                        'updated_at'          => date('Y-m-d H:i:s'),
                    ]);

                    DB::commit();
        return response()->json(['result' => 1]);
    }

    public function SubmitProdRuncard(Request $request){
        date_default_timezone_set('Asia/Manila');
        // session_start();
        ProductionRuncard::where('id', $request->cnfrm_assy_id)
                    ->update([
                        'status'              => 3,
                        'last_updated_by'     => Auth::user()->id,
                        'updated_at'          => date('Y-m-d H:i:s'),
                    ]);

        ProductionRuncardStation::where('prod_runcards_id', $request->cnfrm_assy_id)
                    ->update([
                        'status'              => 3,
                        'last_updated_by'     => Auth::user()->id,
                        'updated_at'          => date('Y-m-d H:i:s'),
                    ]);

                    DB::commit();
        return response()->json(['result' => 'Successful']);
    }

    public function CheckExistingStations(Request $request){
        $prod_runcard_details = ProductionRuncard::with('device_details.material_process', 'runcard_station')->where('id', $request->runcard_id)->first();

        $count_of_steps = count($prod_runcard_details->device_details->material_process);
        $count_of_existing_station = count($prod_runcard_details->runcard_station);

        if($count_of_existing_station > 0){
            $last_index_existing_station = (count($prod_runcard_details->runcard_station) - 1);
            $previous_station_step = $prod_runcard_details->runcard_station[$last_index_existing_station]->station_step;
            $previous_sub_station_step = $prod_runcard_details->runcard_station[$last_index_existing_station]->sub_station_step;
        }else{
            $previous_station_step = 0;
            $previous_sub_station_step = 0;
        }
        // return $count_of_existing_station = count($prod_runcard_details->runcard_station);
        // ->orderBy('id', 'DESC')

        // $mat_process_steps = [];
        // foreach ($prod_runcard_details->device_details->material_process as $processes){
        //     $mat_process_steps[] = $processes->step;
        // }

        // $existing_station = ProductionRuncardStation::whereNull('deleted_at')->where('prod_runcards_id', $request->runcard_id)->get();
        // $steps = [];
        // foreach ($existing_station as $station){
        //     $steps[] = $station->station_step;
        // }
        // $mat_process_steps[] = $steps;

        // $last_station = ProductionRuncardStation::whereNull('deleted_at')->where('prod_runcards_id', $request->runcard_id)->orderBy('id', 'DESC')->first();

        // return $mat_process_steps;
        // return $steps;
        // situation #1 CN171P UPTO STEP 2 ONLY
        // situation #2 CN171S UPTO STEP 3
        // $current_step = 0;

        $ud_ptnr = 0;
        if($prod_runcard_details->ud_ptnr_no != ''){
            $ud_ptnr = 1;
        }
        // return $ud_ptnr;
        $current_step = 0;
        $output_quantity = 0;

        // $previous_station_step = 1;

        // CLARK COMMENT TO SKIP FINISHING STATION DUE TO NO PTNR DOCUMENT
        $toadd = 0;
        $tominus = 0;
        if($ud_ptnr == 0 && $previous_station_step == 1){ //if previous station is injection and there is no ud/ptnr, skip to visual inspection
            $toadd = 1; //proceed to next station
        }else if($ud_ptnr == 1 && $previous_station_step == 2 && $previous_sub_station_step == 2){ //if previous station is finishing and sub station is production, stay in current station and proceed to next substation
            $tominus = 1; //stay in current station
        }else if($previous_station_step == 3 && $previous_sub_station_step == 4){ //if previous station is visual inspection and sub station is airblowing, stay in current station and proceed to next substation
            $tominus = 1; //stay in current station
        }

        $previous_station_step = ($previous_station_step + $toadd) - $tominus;

        if($previous_station_step < $count_of_steps){
            $current_step = $previous_station_step + 1; //increment step, proceed to the next station

            $output_qty = ProductionRuncardStation::whereNull('deleted_at')
                                                    ->where('prod_runcards_id', $request->runcard_id)
                                                    // ->where('station_step', count($steps))
                                                    ->where('station_step', ($current_step - 1) - $toadd + $tominus)//get the previous station
                                                    // ->where('station_step', $previous_station_step)
                                                    ->where('sub_station_step', $previous_sub_station_step)
                                                    ->first();

            if(isset($output_qty->output_quantity)){
                $output_quantity = $output_qty->output_quantity;
            }else{
                $output_quantity = '';
            }
        }

        // if(in_array($steps, $mat_process_steps)){
        //     // return 'dito';
        //     if(count($steps) < count($mat_process_steps) - 1){
        //         $current_step = count($steps)+1;

        //         // CLARK COMMENT TO SKIP FINISHING STATION DUE TO NO PTNR DOCUMENT
        //         if($ud_ptnr == 0 && $current_step == 2){ //if current station is finishing skip to visual inspection
        //             $current_step+= 1;
        //         }else if($ud_ptnr == 1 && $current_step == 3){ //if current station is finishing is not yet finished
        //             $current_step-= 1;
        //         }

        //         $output_qty = ProductionRuncardStation::whereNull('deleted_at')
        //                                                 ->where('prod_runcards_id', $request->runcard_id)
        //                                                 ->where('station_step', count($steps))
        //                                                 ->first();

        //         if(isset($output_qty->output_quantity)){
        //             $output_quantity = $output_qty->output_quantity;
        //         }else{
        //             $output_quantity = '';
        //         }
        //     }
        //     // else{
        //     //     $current_step = 0; //END STATION STEP
        //     //     $output_quantity = '';
        //     // }
        // }else{
        //     $current_step = 1; //END STATION STEP
        //     $output_quantity = '';
        // }

        // return $test->status;
        // return $test->station_step;
        // return $test->sub_station_step;

        return response()->json(['count_of_existing_station' => $count_of_existing_station, 'count_of_steps' => $count_of_steps, 'current_step' => $current_step, 'output_quantity' => $output_quantity, 'previous_station_step' => $previous_station_step, 'ud_ptnr' => $ud_ptnr]);
        // return response()->json(['current_step' => $current_step, 'output_quantity' => $output_quantity]);
    }

    public function CheckExistingSubStations(Request $request){
        // $prod_runcard_details = ProductionRuncard::with('device_details.material_process')->where('id', $request->runcard_id)->first();

        $prod_runcard_details = ProductionRuncard::with('device_details.material_process', 'runcard_station')->where('id', $request->runcard_id)->first();
        $sub_station_array = [1,2,3,4,5];

        $count_of_steps = count($sub_station_array);
        $count_of_existing_station = count($prod_runcard_details->runcard_station);

        if($count_of_existing_station > 0){
            $last_index_existing_station = (count($prod_runcard_details->runcard_station) - 1);
            $previous_station_step = $prod_runcard_details->runcard_station[$last_index_existing_station]->station_step;
            $previous_sub_station_step = $prod_runcard_details->runcard_station[$last_index_existing_station]->sub_station_step;
        }else{
            $previous_station_step = 0;
            $previous_sub_station_step = 0;
        }

        // return $previous_sub_station_step;

        $ud_ptnr = 0;
        if($prod_runcard_details->ud_ptnr_no != ''){
            $ud_ptnr = 1;
        }

        // // return $test;
        // $mat_process_steps = [];
        // foreach ($prod_runcard_details->device_details->material_process as $processes){
        //     $mat_process_steps[] = $processes->step;
        // }

        $current_step = 0;
        $toadd = 0;
        $tominus = 0;
        if($ud_ptnr == 0 && $previous_station_step == 1){ //if current station is finishing skip to visual inspection
            $toadd = 2;
        }else if($ud_ptnr == 1 && $previous_station_step == 2 && $previous_sub_station_step == 3){ //if last station is finishing and sub station is production
            $toadd = 1;
        }else if($previous_station_step == 3 && $previous_sub_station_step == 4){
            $toadd = 1;
        }
        $previous_station_step = $previous_station_step + $toadd;

        if($previous_station_step < $count_of_steps){
            $current_step = $previous_station_step + 1;
        }

        // $existing_station = ProductionRuncardStation::whereNull('deleted_at')->where('prod_runcards_id', $request->runcard_id)->get();
        // $steps = [];
        // foreach ($existing_station as $station){
        //     $steps[] = $station->sub_station;
        // }
        // $sub_station_array[] = $steps;

        // return $sub_station_array;
        // return $steps;
        // situation #1 CN171P UPTO STEP 2 ONLY
        // situation #2 CN171S UPTO STEP 3
        // $current_step = 0;
        // if(in_array($steps, $sub_station_array)){
        //     if(count($steps) < count($sub_station_array) - 1){
        //         $current_step = count($steps)+1;

        //         // CLARK COMMENT TO SKIP FINISHING STATION DUE TO NO PTNR DOCUMENT
        //         if($ud_ptnr == 0 && $current_step == 2){
        //             $current_step+= 2;
        //         }
        //         // $output_qty = ProductionRuncardStation::whereNull('deleted_at')->where('prod_runcards_id', $request->runcard_id)->where('station_step', count($steps))->first();

        //         // if(isset($output_qty->output_quantity)){
        //         //     $output_quantity = $output_qty->output_quantity;
        //         // }else{
        //         //     $output_quantity = '';
        //         // }
        //     }else{
        //         $current_step = 0; //END STATION STEP
        //         // $output_quantity = '';
        //     }
        // }else{
        //     $current_step = 1; //END STATION STEP
        //     // $output_quantity = '';
        // }

        // return response()->json(['current_step' => $current_step, 'output_quantity' => $output_quantity]);
        // return response()->json(['current_step' => $current_step]);
        return response()->json(['count_of_existing_station' => $count_of_existing_station, 'count_of_steps' => $count_of_steps, 'current_step' => $current_step, 'previous_station_step' => $previous_station_step, 'ud_ptnr' => $ud_ptnr]);
    }

    public function GetMatrixDataByDevice(Request $request){
        $material_name = [];
        $material_code = [];
        $material_class = [];

        $matrix_data = Devices::with(['material_process.material_details', 'material_process.station_details.stations'])
        ->when($request->device_name, function ($query) use ($request){
            return $query->where('name', $request->device_name);
        })
        ->where('status', 1)
        ->get();

        foreach($matrix_data[0]->material_process[0]->material_details as $material_details){
            $material_name[] = $material_details->material_type;
            $material_code[] = $material_details->material_code;
            $test = DB::connection('mysql_rapid_pps')
                                ->select('SELECT whs.Classification AS class_id
                                        FROM tbl_Warehouse AS whs WHERE whs.MaterialType = "'.$material_details->material_type.'" LIMIT 1
                                    ');
            $material_class[] = $test[0]->class_id;
        }

        // return $material_name;
        // foreach($matrix_data[0]->material_process[0]->material_details as $material_details){
        // }
        // $whs_material_name = DB::connection('mysql_rapid_pps')
        // ->select(' SELECT whs.MaterialType AS mat_name, whs_transaction.Lot_number AS lot_no
        //         FROM tbl_Warehouse AS whs
        //         INNER JOIN tbl_Warehouse_Classification AS whs_class ON whs.Classification = whs_class.id
        //         WHERE whs.MaterialType = "'.$request->mat_lot_number.'"
        //         LIMIT 1
        //     ');
        // return $matrix_data;


        $material_type = implode(',',$material_name);
        $material_codes = implode(',',$material_code);
        $material_class = implode(',',$material_class);

        $station_details = $matrix_data[0]->material_process[0]->station_details;

        // return $matrix_data;
        return response()->json(['device_details' => $matrix_data, 'material_details' => $material_type, 'material_codes' => $material_codes, 'material_class' => $material_class]);
    }

    public function GetProdRuncardQrCode (Request $request){
        $runcard = ProductionRuncard::select('po_number',
                                            'po_quantity',
                                            'part_name',
                                            'part_code',
                                            'production_lot',
                                            'shipment_output',
                                            'production_runcards.status AS runcard_status',
                                            DB::raw("CONCAT( firstname, ' ', lastname) AS operator_name"))
                                    ->leftJoin('production_runcard_stations', function($join) {
                                        $join->on('production_runcard_stations.prod_runcards_id', '=' ,'production_runcards.id');
                                    })
                                    ->leftJoin('users', function($join) {
                                        $join->on('users.id', '=', 'production_runcards.created_by');
                                    })
                                    ->where('production_runcards.id', $request->runcard_id)
                                    ->whereNull('production_runcards.deleted_at')
                                    ->first();

        if($runcard->runcard_status == 3){
            $shipment_output = $runcard->shipment_output;
        }else{
            $shipment_output = 'N/A';
        }

        $qrcode = QrCode::format('png')
        ->size(300)->errorCorrection('H')
        ->generate(json_encode($runcard));

        $qr_code = "data:image/png;base64," . base64_encode($qrcode);

        $data[] = array(
            'img' => $qr_code,
            'text' =>  "<strong>$runcard->po_number</strong><br>
            <strong>$runcard->po_quantity</strong><br>
            <strong>$runcard->part_name</strong><br>
            <strong>$runcard->part_code</strong><br>
            <strong>$runcard->production_lot</strong><br>
            <strong>$shipment_output</strong><br>
            <strong>$runcard->operator_name</strong><br>
            "
        );

        $label = "
            <table class='table table-sm table-borderless' style='width: 100%;'>
                <tr>
                    <td>PO No:</td>
                    <td>$runcard->po_number</td>
                </tr>
                <tr>
                    <td>PO Quantity:</td>
                    <td>$runcard->po_quantity</td>
                </tr>
                <tr>
                    <td>Device Name:</td>
                    <td>$runcard->part_name</td>
                </tr>
                <tr>
                    <td>Part Code:</td>
                    <td>$runcard->part_code</td>
                </tr>
                <tr>
                    <td>Production Lot #:</td>
                    <td>$runcard->production_lot</td>
                </tr>
                <tr>
                    <td>Shipment Output:</td>
                    <td>$shipment_output</td>
                </tr>
                <tr>
                    <td>Operator Name:</td>
                    <td>$runcard->operator_name</td>
                </tr>
            </table>
        ";

        return response()->json(['qr_code' => $qr_code, 'label_hidden' => $data, 'label' => $label, 'production_runcard_data' => $runcard]);
    }
}
