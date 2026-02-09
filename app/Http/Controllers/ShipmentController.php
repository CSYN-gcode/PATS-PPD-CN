<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use DataTables;
use Carbon\Carbon;
use App\Exports\Export;
use Maatwebsite\Excel\Facades\Excel;

use App\Models\Shipment;
use App\Models\ShipmentDetails;

class ShipmentController extends Controller
{
    public function viewShipmentData(Request $request){
        $shipmentData = Shipment::with(['shipment_details'])
        ->where('logdel', 0)
        ->get();

        return DataTables::of($shipmentData)
        ->addColumn('action', function($shipmentData){
            $result = "";
            $result .= "<center>";
            $result .= "<button class='btn btn-sm btn-secondary ml-1 btnEditShipmentData' data-id='$shipmentData->id'><i class='fa-solid fa-pen-to-square'></i></button>";
            $result .= "</center>";
            return $result;
        })
        ->rawColumns(['action'])
        ->make(true);
    }

    public function addShipmentData(Request $request){
        date_default_timezone_set('Asia/Manila');
        session_start();
        $rapidx_user_id = $_SESSION['rapidx_user_id'];
        $data = $request->all();
        // return $data;
        $validate_array = ['preShipment_ctrl' => 'required',
                            'shipment_date' => 'required',
                            'rev_no' => 'required',
                            'sold_to' => 'required',
                            'shipped_by' => 'required',
                            'cut_off_date' => 'required',
                            'grand_total' => 'required'
                        ];
        $validator = Validator::make($data, $validate_array);

        if($validator->fails()) {
            return response()->json(['validation' => 'hasError', 'error' => $validator->messages()]);
        }else{
            $get_shipment_data = Shipment::where('logdel',0)->orderBy('id','desc')->first();

            $counter = 00000;
            $yearMonth = date('Ym');

            if($get_shipment_data != null){
                $ctrl_no = $get_shipment_data->ctrl_no;
                $number = explode('-', $ctrl_no);
                $counter = intval($number[2]) + 1;
            }else{
                $counter = 1;
            }

            $ctrl_number = 'PPD-'.$yearMonth.'-'.str_pad($counter, 5, "0", STR_PAD_LEFT);

            $shipment_data = array(
                'ctrl_no' => $ctrl_number,
                'preshipment_id' => $request->preShipment_id,
                'ps_ctrl_no' => $request->preShipment_ctrl,
                'shipment_date' => $request->shipment_date,
                'rev_no' => $request->rev_no,
                'sold_to' => $request->sold_to,
                'shipped_by' => $request->shipped_by,
                'cutoff_month' => $request->cut_off_date,
                'grand_total' => $request->grand_total,
                'created_by' => $rapidx_user_id,
                'created_at' => date('Y-m-d H:i:s'),
            );

            $shipment_data_update = array(
                'ctrl_no' => $request->ctrl_number,
                'preshipment_id' => $request->preShipment_id,
                'ps_ctrl_no' => $request->preShipment_ctrl,
                'shipment_date' => $request->shipment_date,
                'rev_no' => $request->rev_no,
                'sold_to' => $request->sold_to,
                'shipped_by' => $request->shipped_by,
                'cutoff_month' => $request->cut_off_date,
                'grand_total' => $request->grand_total,
                'updated_by' => $rapidx_user_id,
                'updated_at' => date('Y-m-d H:i:s'),
            );

            $shipmentDetailsArray = explode(',', $request->shipment_details);

            try{
                if(isset($request->shipment_id)){
                    Shipment::where('id', $request->shipment_id)
                    ->update($shipment_data_update);

                    // Delete existing shipment details
                    $shipmentDetails = json_decode($request->input('shipment_details'), true);

                    ShipmentDetails::where('shipment_id', $request->shipment_id)->delete();

                    foreach ($shipmentDetails as $shipmentDetails) {
                        // return $shipmentDetails['item_code'];
                        ShipmentDetails::insert([
                            'shipment_id' => $request->shipment_id,
                            'fkControlNo' => $request->preShipment_ctrl,
                            'category' => $shipmentDetails['category'],
                            'product_po_no' => $shipmentDetails['product_po_no'],
                            'item_code' => $shipmentDetails['item_code'],
                            'item_name' => $shipmentDetails['item_name'],
                            'order_no' => $shipmentDetails['order_no'],
                            'shipout_qty' => $shipmentDetails['shipout_qty'],
                            'unit_price' => $shipmentDetails['unit_price'],
                            'amount' => $shipmentDetails['amount'],
                            'lot_no' => $shipmentDetails['lot_no'],
                            'remarks' => $shipmentDetails['remarks'],
                            'created_by' => $rapidx_user_id,
                            'created_at' => date('Y-m-d H:i:s'),
                        ]);
                    }
                    return response()->json(['result' => "2"]);
                }else{
                    $shipment_id = Shipment::insertGetId($shipment_data);
                    $shipmentDetails = json_decode($request->input('shipment_details'), true);
                    // return $shipmentDetails;
                        foreach ($shipmentDetails as $shipmentDetails) {
                            ShipmentDetails::insert([
                                'shipment_id' => $shipment_id,
                                'fkControlNo' => $request->preShipment_ctrl,
                                'category' => $shipmentDetails['category'],
                                'product_po_no' => $shipmentDetails['product_po_no'],
                                'item_code' => $shipmentDetails['item_code'],
                                'item_name' => $shipmentDetails['item_name'],
                                'order_no' => $shipmentDetails['order_no'],
                                'shipout_qty' => $shipmentDetails['shipout_qty'],
                                'unit_price' => $shipmentDetails['unit_price'],
                                'amount' => $shipmentDetails['amount'],
                                'lot_no' => $shipmentDetails['lot_no'],
                                'remarks' => $shipmentDetails['remarks'],
                                'created_by' => $rapidx_user_id,
                                'created_at' => date('Y-m-d H:i:s'),
                            ]);
                        }
                        return response()->json(['result' => "1"]);
                    // }
                }
            }catch(\Exception $e){
                DB::rollback(); // Rollback the transaction
                return response()->json(['result' => "0"]);
            }
        }
    }

    public function getPOReceivedDetails(Request $request){
        $po_details = DB::connection('mysql_rapid_pps')->select("SELECT * FROM tbl_POReceived WHERE logdel = 0 AND POBalance > 0");
        return response()->json(['result' => 1, 'po_details' => $po_details]);
    }

    public function loadPreshipmentDetails (Request $request){
        if($request->ps_ctrl_number != ''){
            // old code clark comment 01/27/2026
            preg_match('/^(.*?)-(\d+-\d+)$/', $request->ps_ctrl_number, $matches);
            $packingDestination = trim($matches[1]); // Extracted text part
            $packingListCtrlNo = $matches[2]; // Extracted numbers (with dash)

            // $pre_shipment_details = DB::connection('mysql_rapid_pps')->select("SELECT
            // tbl_PreShipmentTransaction.PONo as order_no,
            // tbl_PreShipmentTransaction.Partscode as item_code,
            // tbl_PreShipmentTransaction.DeviceName as item_name,
            // tbl_PreShipmentTransaction.Qty as shipout_qty,
            // tbl_PreShipmentTransaction.Remarks as remarks,
            // tbl_POReceived.Price as unit_price,
            // FORMAT(CEIL(tbl_PreShipmentTransaction.Qty * tbl_POReceived.Price * 10000) / 10000, 4) as amount,
            // tbl_PreShipmentTransaction.LotNo as lot_no
            // FROM tbl_PreShipment
            // INNER JOIN tbl_PreShipmentTransaction ON tbl_PreShipment.Packing_List_CtrlNo = tbl_PreShipmentTransaction.fkControlNo
            // INNER JOIN tbl_POReceived ON tbl_PreShipmentTransaction.PONo = tbl_POReceived.OrderNo
            // WHERE Destination = '$packingDestination' AND Packing_List_CtrlNo = '$packingListCtrlNo'
            // ORDER BY tbl_PreShipmentTransaction.id ASC
            // ");

            // $pre_shipment_details = DB::connection('mysql')->select("SELECT
            //     preship_details.PONo as order_no,
            //     preship_details.Partscode as item_code,
            //     preship_details.DeviceName as item_name,
            //     preship_details.Qty as shipout_qty,
            //     preship_details.Remarks as remarks,
            //     po_receive.Price as unit_price,
            //     FORMAT(CEIL(preship_details.Qty * po_receive.Price * 10000) / 10000, 4) as amount,
            //     preship_details.LotNo as lot_no
            //     FROM db_pps_preshipments AS preshipment
            //     INNER JOIN db_pps_preship_transactions AS preship_details ON preshipment.Packing_List_CtrlNo = preship_details.fkControlNo
            //     INNER JOIN db_pps.tbl_POReceived AS po_receive ON preship_details.PONo = po_receive.OrderNo
            //     WHERE preshipment.Packing_List_CtrlNo = '$request->ps_ctrl_number'
            //     ORDER BY preship_details.id ASC
            //     ");

            $preship_details = DB::connection('mysql')->select(" SELECT
                                    preshipment.id,
                                    preship_details.PONo,
                                    preship_details.Partscode,
                                    preship_details.DeviceName,
                                    preship_details.Qty,
                                    preship_details.Remarks,
                                    preship_details.LotNo
                                FROM db_pps_preshipments AS preshipment
                                INNER JOIN db_pps_preship_transactions AS preship_details
                                    ON preshipment.Packing_List_CtrlNo = preship_details.fkControlNo
                                WHERE preshipment.Destination = '$packingDestination' AND preshipment.Packing_List_CtrlNo = '$packingListCtrlNo'
                                ORDER BY preship_details.id ASC
                            ");

            $poNos = collect($preship_details)
                ->pluck('PONo')
                ->filter()
                ->unique()
                ->values()
                ->toArray();

            $po_received = DB::connection('mysql_rapid_pps')
                ->table('tbl_POReceived')
                ->select('Category', 'ProductPONo', 'OrderNo', 'Price')
                ->whereIn('OrderNo', $poNos)
                ->get()
                ->keyBy('OrderNo');

            $final_data = collect($preship_details)->map(function ($row) use ($po_received) {

                $unit_price = isset($po_received[$row->PONo])
                    ? (float) $po_received[$row->PONo]->Price
                    : 0;

                $amount = ceil($row->Qty * $unit_price * 10000) / 10000;

                return [
                    'preshipment_id'   => $row->id,
                    'category'         => $po_received[$row->PONo]->Category,
                    'product_po_no'    => $po_received[$row->PONo]->ProductPONo,
                    'order_no'         => $row->PONo,
                    'item_code'        => $row->Partscode,
                    'item_name'        => $row->DeviceName,
                    'shipout_qty'      => $row->Qty,
                    'remarks'          => $row->Remarks,
                    'unit_price'       => $unit_price,
                    'amount'           => number_format($amount, 4, '.', ''),
                    'lot_no'           => $row->LotNo,
                ];
            });
                // db_pps_preship_transactions
                // db_pps_preshipments
        }else{
            // $pre_shipment_details = [];
            $final_data = [];
        }

        // return response()->json(['result' => 1, 'pre_shipment_details' => $pre_shipment_details]);
        return response()->json(['result' => 1, 'pre_shipment_details' => $final_data]);
    }

    public function getShipmentData(Request $request){
        $shipment_data = Shipment::with([
            'shipment_details'
        ])
        ->where('id', $request->shipment_id)
        ->where('logdel', 0)
        ->get();

        return response()->json(['shipmentData' => $shipment_data]);
    }
}
