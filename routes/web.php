<?php

use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserLevelController;
use App\Http\Controllers\ProductionRuncardController;
use App\Http\Controllers\IqcInspectionController;
use App\Http\Controllers\DefectsInfoController;
use App\Http\Controllers\StationController;
use App\Http\Controllers\ProcessController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\MaterialProcessController;
use App\Http\Controllers\DmrpqcTsController;
use App\Http\Controllers\QualificationController;
use App\Http\Controllers\OQCInspectionController;
use App\Http\Controllers\MimfController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/link', function () {
    return 'link';
})->name('link');

Route::view('/','index')->name('login');
Route::view('/login','index')->name('login');
Route::view('/dashboard','dashboard')->name('dashboard');
Route::view('/ipqc_inspection_assembly','ipqc_inspection_assembly')->name('ipqc_inspection_assembly');

//QC Routes
Route::view('/iqc_inspection','iqc_inspection')->name('iqc_inspection');

/* ADMIN VIEW */
Route::view('/user','user')->name('user');
Route::view('/defectsinfo','defectsinfo')->name('defectsinfo');
Route::view('/change_pass_view','change_password')->name('change_pass_view');
Route::view('/materialprocess','materialprocess')->name('materialprocess');
Route::view('/process','process')->name('process');

/* QUALIFICATION VIEW */
Route::view('/qualifications','qualification')->name('qualifications');

/* PRODUCTION RUNCARD VIEW */
Route::view('/production_runcard','production_runcard')->name('production_runcard');
Route::view('/oqc_inspection','oqc_inspection')->name('oqc_inspection');

/* DEFECTS INFO */
Route::controller(DefectsInfoController::class)->group(function () {
    Route::get('/view_defectsinfo', 'view_defectsinfo')->name('view_defectsinfo');
    Route::post('/add_defects', 'add_defects')->name('add_defects');
    Route::get('/get_defects_by_id', 'get_defects_by_id')->name('get_defects_by_id');

});

/* DMRPQC INFO */
Route::view('/dmrpqc_ts','dmrpqc_ts')->name('dmrpqc_ts');

/* MACHINE PARAMETER */
Route::view('/machine_parameter','machine_parameter')->name('machine_parameter');

/* DHD Checksheet */
Route::view('/dhd_checksheet','dhd_checksheet')->name('dhd_checksheet');


/* MIMF */
Route::view('/Material_Issuance_Monitoring_Form','mimf')->name('Material_Issuance_Monitoring_Form');

/* DMRPQC CONTROLLER*/
Route::controller(DmrpqcTsController::class)->group(function () {
    Route::get('/view_dmrpqc', 'ViewDmrpqc')->name('view_dmrpqc');
    Route::post('/add_request', 'AddRequest')->name('add_request');
    Route::post('/delete_request', 'DeleteRequest')->name('delete_request');
    Route::get('/get_data_for_dashboard', 'GetDataForDashboard')->name('get_data_for_dashboard');
    Route::post('/update_dieset_conditon_data', 'UpdateDiesetConditonData')->name('update_dieset_conditon_data');
    Route::post('/update_dieset_conditon_checking_data', 'UpdateDiesetConditonCheckingData')->name('update_dieset_conditon_checking_data');
    Route::post('/update_machine_setup_data', 'UpdateMachineSetupData')->name('update_machine_setup_data');
    Route::post('/update_product_req_checking_data', 'UpdateProductReqCheckingData')->name('update_product_req_checking_data');
    Route::post('/update_machine_param_checking_data', 'UpdateMachineParamCheckingData')->name('update_machine_param_checking_data');
    Route::post('/update_specifications_data', 'UpdateSpecificationsData')->name('update_specifications_data');
    Route::post('/update_completion_data', 'UpdateCompletionData')->name('update_completion_data');
    Route::post('/update_parts_drawing_data', 'UpdatePartsDrawingData')->name('update_parts_drawing_data');
    Route::post('/update_status_of_dieset_request', 'UpdateStatusOfDiesetRequest')->name('update_status_of_dieset_request');
    Route::get('/get_name_by_session', 'GetNameBySession')->name('get_name_by_session');
    Route::get('/get_pps_db_data_by_item_code', 'GetPpsDbDataByItemCode')->name('get_pps_db_data_by_item_code');
    Route::get('/get_dmrpqc_details_id', 'GetDmrpqcDetailsId')->name('get_dmrpqc_details_id');
    Route::get('/download_file/{id}', 'DownloadFile')->name('download_file');
    Route::get('/get_users_by_position', 'GetUsersByPosition')->name('get_users_by_position');
});

/* PROCESS */
Route::controller(ProcessController::class)->group(function () {
    Route::get('/view_process', 'view_process');
    Route::post('/add_process', 'add_process');
    Route::post('/update_status', 'update_status');
    Route::get('/get_process_by_id', 'get_process_by_id');

});


// DEVICE CONTROLLER
Route::controller(DeviceController::class)->group(function () {
    Route::get('/view_devices','view_devices');
    Route::post('/add_device','add_device');
    Route::get('/get_device_by_id','get_device_by_id');
    Route::post('/change_device_stat','change_device_stat');
});

/* STATION */
Route::controller(StationController::class)->group(function () {
    Route::get('view_station', 'view_station')->name('view_station');
    Route::post('save_station', 'save_station')->name('save_station');
    Route::get('get_station_details_by_id', 'get_station_details_by_id')->name('get_station_details_by_id');
    Route::get('update_status', 'update_status')->name('update_status');

});

// MATERIAL PROCESS CONTROLLER
Route::controller(MaterialProcessController::class)->group(function () {

    Route::get('/view_material_process_by_device_id', 'view_material_process_by_device_id');
    Route::get('/get_mat_proc_for_add', 'get_mat_proc_for_add');
    Route::get('/get_step', 'get_step');
    Route::get('/get_mat_proc_data', 'get_mat_proc_data');
    Route::post('/add_material_process', 'add_material_process');
    Route::post('/change_mat_proc_status', 'change_mat_proc_status');

});

/* USER CONTROLLER */
Route::controller(UserController::class)->group(function () {
    Route::post('/sign_in', 'sign_in')->name('sign_in');
    Route::post('/rapidx_sign_in_admin', 'rapidx_sign_in_admin')->name('rapidx_sign_in_admin');
    Route::post('/sign_out', 'sign_out')->name('sign_out');
    Route::post('/change_pass', 'change_pass')->name('change_pass');
    Route::post('/change_user_stat', 'change_user_stat')->name('change_user_stat');
    Route::get('/view_users', 'view_users');
    Route::post('/add_user', 'add_user');
    Route::get('/get_user_by_id', 'get_user_by_id');
    Route::get('/get_user_by_en', 'get_user_by_en');
    Route::get('/get_user_list', 'get_user_list');
    Route::get('/get_user_by_batch', 'get_user_by_batch');
    Route::get('/get_user_by_stat', 'get_user_by_stat');
    Route::post('/edit_user', 'edit_user');
    Route::post('/reset_password', 'reset_password');
    Route::get('/generate_user_qrcode', 'generate_user_qrcode');
    Route::post('/import_user', 'import_user');

    Route::get('/get_emp_details_by_id', 'get_emp_details_by_id')->name('get_emp_details_by_id');
});

/* PRODUCTION RUNCARD Controller */
Route::controller(ProductionRuncardController::class)->group(function(){
    Route::get('/view_production_runcard', 'viewProdRuncard')->name('view_production_runcard');
    Route::get('/view_prod_runcard_station', 'viewProdRuncardStations')->name('view_prod_runcard_station');
    Route::get('/get_po_from_ppsdb', 'GetPOFromPPSDB')->name('get_po_from_ppsdb');
    Route::get('/search_po_from_ppsdb', 'searchPoFromPpsDb')->name('search_po_from_ppsdb');
    Route::get('/validate_material_lot_number', 'ValidateMatLotNumber')->name('validate_material_lot_number');
    Route::post('/add_production_runcard_data', 'addProdRuncardData')->name('add_production_runcard_data');
    Route::get('/get_prod_runcard_data', 'getProdRuncardData')->name('get_prod_runcard_data');
    Route::post('/add_runcard_station_data', 'addProdRuncardStationData')->name('add_runcard_station_data');
    Route::get('/get_data_from_matrix', 'GetMatrixDataByDevice')->name('get_data_from_matrix');
    Route::get('/chck_existing_stations', 'CheckExistingStations')->name('chck_existing_stations');
    Route::get('/chck_existing_sub_stations', 'CheckExistingSubStations')->name('chck_existing_sub_stations');
    Route::get('/get_prod_runcard_qr_code', 'GetProdRuncardQrCode')->name('get_prod_runcard_qr_code');
    Route::post('/update_prod_runcard_status', 'UpdateProdRuncardStatus')->name('update_prod_runcard_status');
    Route::post('/submit_prod_runcard', 'SubmitProdRuncard')->name('submit_prod_runcard');
    Route::get('/get_mode_of_defect_for_prod', 'GetModeOfDefect')->name('get_mode_of_defect_for_prod');
});

//Qualification Controller
Route::controller(QualificationController::class)->group(function () {
    Route::get('/validate_user', 'Validateuser')->name('validate_user');
    Route::get('/get_devices_from_quali', 'GetDevicesFromQualifications')->name('get_devices_from_quali');
    Route::get('/verify_production_lot', 'VerifyProductionLot')->name('verify_production_lot');
    Route::get('/view_qualification_data', 'ViewIpqcData')->name('view_qualification_data');
    Route::get('/get_qualification_data', 'GetQualificationsData')->name('get_qualification_data');
    Route::post('/add_qualification_details', 'AddQualificationDetails')->name('add_qualification_details');
    Route::post('/update_qualification_details_status', 'UpdateQualificationDetailsStatus')->name('update_qualification_details_status');
    Route::get('/download_quali_file/{id}', 'DownloadFile')->name('download_quali_file');
});

/* USER LEVEL CONTROLLER */
Route::get('/get_user_levels',  [UserLevelController::class, 'get_user_levels']);


//IQC Inspection
Route::controller(IqcInspectionController::class)->group(function () {

    Route::get('/load_iqc_inspection', 'loadIqcInspection')->name('load_iqc_inspection');
    Route::get('/get_iqc_inspection_by_judgement', 'getIqcInspectionByJudgement')->name('get_iqc_inspection_by_judgement');
    Route::get('/load_whs_transaction', 'loadWhsTransaction')->name('load_whs_transaction');
    Route::get('/load_whs_details', 'loadWhsDetails')->name('load_whs_details');
    Route::get('/get_iqc_inspection_by_id', 'getIqcInspectionById')->name('get_iqc_inspection_by_id');
    Route::get('/get_whs_receiving_by_id', 'getWhsReceivingById')->name('get_whs_receiving_by_id');
    Route::get('/get_family', 'getFamily')->name('get_family');
    Route::get('/get_inspection_level', 'getInspectionLevel')->name('get_inspection_level');
    Route::get('/get_aql', 'getAql')->name('get_aql');
    Route::get('/get_lar_dppm', 'getLarDppm')->name('get_lar_dppm');
    Route::get('/get_mode_of_defect', 'getModeOfDefect')->name('get_mode_of_defect');
    Route::get('/view_coc_file_attachment/{id}', 'viewCocFileAttachment')->name('view_coc_file_attachment');

    Route::post('/save_iqc_inspection', 'saveIqcInspection')->name('save_iqc_inspection');
});

//OQC Inspection
Route::controller(OQCInspectionController::class)->group(function () {
    Route::get('/view_oqc_inspection', 'viewOqcInspection')->name('view_oqc_inspection');
    Route::get('/view_oqc_inspection_history', 'viewOqcInspectionHistory')->name('view_oqc_inspection_history');
    // Route::get('/view_oqc_inspection_second_stamping', 'viewOqcInspectionSecondStamping')->name('view_oqc_inspection_second_stamping');
    Route::post('/update_oqc_inspection', 'updateOqcInspection')->name('update_oqc_inspection');
    Route::get('/get_oqc_inspection_by_id', 'getOqcInspectionById')->name('get_oqc_inspection_by_id');
    Route::get('/get_material_code_for_machine_no', 'getMaterialCodeForMachineNo')->name('get_material_code_for_machine_no');
    Route::get('/get_oqc_family', 'getFamily')->name('get_oqc_family');
    Route::get('/get_oqc_inspection_type', 'getInspectionType')->name('get_oqc_inspection_type');
    Route::get('/get_oqc_inspection_level', 'getInspectionLevel')->name('get_oqc_inspection_level');
    Route::get('/get_oqc_severity_inspection', 'getSeverityInspection')->name('get_oqc_severity_inspection');
    Route::get('/get_oqc_aql', 'getAQL')->name('get_oqc_aql');
    Route::get('/get_oqc_inspection_customer', 'getCustomer')->name('get_oqc_inspection_customer');
    Route::get('/get_oqc_inspection_mod', 'getMOD')->name('get_oqc_inspection_mod');
    Route::get('/scan_user_id', 'scanUserId')->name('scan_user_id');
});

Route::controller(MimfController::class)->group(function () {
    Route::get('/view_mimf', 'viewMimf')->name('view_mimf');
    Route::get('/get_control_no', 'getControlNo')->name('get_control_no');
    Route::get('/get_pmi_po', 'getPmiPoFromPoReceived')->name('get_pmi_po');
    Route::post('/update_mimf', 'updateMimf')->name('update_mimf');
    Route::get('/get_mimf_by_id', 'getMimfById')->name('get_mimf_by_id');
    Route::get('/view_mimf_pps_request', 'viewMimfPpsRequest')->name('view_mimf_pps_request');
    Route::get('/get_ppd_material_type', 'getPpdMaterialType')->name('get_ppd_material_type');
    Route::get('/get_pps_warehouse_inventory', 'getPpsWarehouseInventory')->name('get_pps_warehouse_inventory');
    Route::get('/get_pps_request_partial_quantity', 'getPpsRequestPartialQuantity')->name('get_pps_request_partial_quantity');
    Route::get('/check_request_qty_for_issuance', 'checkRequestQtyForIssuance')->name('check_request_qty_for_issuance');
    Route::post('/create_update_mimf_pps_request', 'createUpdateMimfPpsRequest')->name('create_update_mimf_pps_request');

    // Route::get('/view_mimf_stamping_matrix', 'viewMimfStampingMatrix')->name('view_mimf_stamping_matrix');
    // Route::post('/update_mimf_stamping_matrix', 'updateMimfStampingMatrix')->name('update_mimf_stamping_matrix');
    // Route::get('/get_mimf_stamping_matrix_by_id', 'getMimfStampingMatrixById')->name('get_mimf_stamping_matrix_by_id');

    // Route::get('/get_pps_warehouse', 'getPpsWarehouse')->name('get_pps_warehouse');
    // Route::get('/get_pps_po_recveived_item_code', 'getPpsPoReceivedItemCode')->name('get_pps_po_recveived_item_code');
    // Route::get('/get_pps_dieset', 'getPpsDieset')->name('get_pps_dieset');
    // Route::get('/get_mimf_pps_request_by_id', 'getMimfPpsRequestById')->name('get_mimf_pps_request_by_id');
});

