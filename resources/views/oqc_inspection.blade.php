@php $layout = 'layouts.admin_layout'; @endphp
@auth
    @extends($layout)
    @section('title', 'OQC Inspection')
    @section('content_page')
        <style type="text/css">
            table.table tbody td{
                padding: 4px 4px;
                margin: 1px 1px;
                font-size: 13px;
                vertical-align: middle;
            }

            table.table thead th{
                padding: 4px 4px;
                margin: 1px 1px;
                font-size: 13px;
                text-align: center;
                vertical-align: middle;
            }

            .scanQrBarCode{
                position: absolute;
                opacity: 0;
            }

            .text-hidden {
                position: absolute;
                opacity: 0;
            }

            .slct{
                pointer-events: none;
            }
        </style>
        @php
            date_default_timezone_set('Asia/Manila');
        @endphp

        <div class="content-wrapper"> <!-- Content Wrapper. Contains page content -->
            <section class="content-header"> <!-- Content Header (Page header) -->
                <div class="container-fluid"><!-- Container-fluid -->
                    <div class="row mb-2">
                        <div class="col-sm-6">
                            <h1>OQC Inspection</h1>
                        </div>
                        <div class="col-sm-6">
                            <ol class="breadcrumb float-sm-right">
                                <li class="breadcrumb-item"><a href="{{ route('dashboard') }}">Dashboard</a>
                                </li>
                                <li class="breadcrumb-item active">OQC Inspection</li>
                            </ol>
                        </div>
                    </div>
                </div><!-- /.Container-fluid -->
            </section>

            <!-- Main content -->
            <section class="content"><!-- Content -->
                <div class="container-fluid"><!-- Container-fluid -->
                    <div class="row"><!-- Row -->
                        <div class="col-12"><!-- Col -->
                            <div class="card card-dark"><!-- General form elements -->
                                <div class="card-header">
                                    <h3 class="card-title">OQC Inspection Table</h3>
                                </div>

                                <!-- Start Search PO No. -->
                                <div class="row p-3">
                                    <div class="col-3">
                                        <div class="input-group input-group">
                                            <div class="input-group-prepend">
                                                <button type="button" class="btn btn-dark" id="btnScanPo" data-toggle="modal" data-target="#mdlScanQrCode"><i class="fa fa-qrcode w-100"></i></button>
                                            </div>
                                            <div class="input-group-prepend">
                                                <span class="input-group-text"><strong>PO No.:</strong></span>
                                            </div>
                                            <input type="search" class="form-control invalidScan" id="txtPoNumber" placeholder="---------------" readonly>
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        <div class="input-group input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text"><Strong>Material Name:</Strong></span>
                                            </div>
                                            <input type="search" class="form-control invalidScan" id="txtMaterialName" placeholder="---------------" readonly>
                                        </div>
                                    </div>

                                    <div class="col-2">
                                        <div class="input-group input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text"><strong>Po Qty:</strong></span>
                                            </div>
                                            <input type="text" class="form-control invalidScan" id="txtPoQuantity" placeholder="---------------" readonly>
                                        </div>
                                    </div>

                                    <div class="col-2 d-none">
                                        <div class="input-group input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text"><strong>Production Lot:</strong></span>
                                            </div>
                                            <input type="text" class="form-control invalidScan" id="txtOQCProdLotNo">
                                        </div>
                                    </div>
                                </div>
                                <!-- End Search PO No. -->

                                <div class="card-body"><!-- Start Page Content -->
                                    <ul class="nav nav-tabs mb-3" role="tablist">
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link oqc-button active" id="oqcInspectionForInspection" value="2" data-bs-toggle="tab" data-bs-target="#oqcInspection" type="button" role="tab">For Inspection</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link oqc-button" id="oqcInspectionLotAccepted" value="1" data-bs-toggle="tab" data-bs-target="#oqcInspection" type="button" role="tab">Lot Accepted</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link oqc-button" id="oqcInspectionLotRejected" value="0" data-bs-toggle="tab" data-bs-target="#oqcInspection" type="button" role="tab">Lot Rejected</button>
                                        </li>
                                    </ul>

                                    <div class="tab-content" id="myTabContent"> <!-- tab-content -->
                                        <div class="tab-pane fade show active" id="oqcInspection" role="tabpanel">
                                            <div class="table-responsive"><!-- Table responsive -->
                                                <table id="tblOqcInspection" class="table table-sm table-bordered table-striped table-hover"
                                                    style="width: 100%;">
                                                    <thead>
                                                        <tr>
                                                            <th>&emsp; Action &emsp;</th>
                                                            <th>Status</th>
                                                            <th>Part Name</th>
                                                            <th>P.O No.</th>
                                                            <th>P.O Qty</th>
                                                            <th>Lot No.</th>
                                                            <th>Lot Qty.</th>
                                                            <th>UD/PTNR</th>
                                                            <th>Sample Size</th>
                                                            <th>Judgement</th>
                                                            <th>Inspector</th>
                                                            <th>Date Inspected</th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </div><!-- /.Table responsive -->
                                        </div>
                                    </div> <!-- /.tab-content -->

                                </div><!-- /.End Page Content -->
                            </div><!-- /.Card -->
                        </div><!-- /.Col -->
                    </div><!-- /.Row -->
                </div><!-- /.Container-fluid -->
            </section><!-- /.Content -->
        </div><!-- /.Content-wrapper -->

        <!-- Start History Modal -->
        <div class="modal fade" id="mdlOqcInspectionFirstStampingHistory" data-formid="" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-xl-custom">
                <div class="modal-content">
                    <div class="modal-body p-5">
                        <div class="table-responsive"><!-- Table responsive -->
                            <table id="tblOqcInspectionHistory" class="table table-sm table-bordered table-striped table-hover"
                                style="width: 100%;">
                                <thead>
                                    <tr>
                                        <th>&emsp; Action &emsp;</th>
                                        <th>P.O No.</th>
                                        <th>P.O Qty</th>
                                        <th>Prod. Lot</th>
                                        <th>Prod. Lot Qty.</th>
                                        <th>Material Name</th>
                                        <th>FY-WW</th>
                                        <th>Date Inspected</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th># of Sub</th>
                                        <th>Sample Size</th>
                                        <th>Mode of Defects</th>
                                        <th>No. of Detective</th>
                                        <th>Judgement</th>
                                        <th>Inspector</th>
                                        <th>Remarks</th>
                                        <th>Family</th>
                                        <th>Updated By</th>
                                        <th>Update Date</th>
                                    </tr>
                                </thead>
                            </table>
                        </div><!-- /.Table responsive -->
                    </div>
                </div>
            </div>
        </div><!-- /.End History Modal -->

        <!-- Start OQC Inspection Modal -->
        <div class="modal fade" id="modalOqcInspection" tabindex="-1" role="dialog" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-xl-custom">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title"><i class="fa fa-edit"></i> OQC Inspection</h4>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <form method="post" id="formOqcInspection" autocomplete="off">
                        @csrf
                        <input type="hidden" class="form-control form-control-sm" id="txtOqcInspectionId" name="oqc_inspection_id">
                        <input type="hidden" class="form-control form-control-sm" id="txtProdId" name="prod_id">
                        <input type="hidden" class="form-control form-control-sm" id="txtCheckButton" name="check_button">
                        <input type="hidden" class="form-control form-control-sm" id="txtEmployeeNo" name="employee_no">

                        <div class="modal-body">
                            <div class="row">
                                <div class="col-sm-12">
                                    <strong>* View Drawing</strong>
                                </div>
                            </div>
                            <div class="input-group p-3">
                                <div class="input-group-prepend w-25">
                                    <button type="button" class="btn btn-dark" id="btnOqcInspectionViewBDrawings"><i class="fa fa-file" title="View"></i></button>
                                    <span class="input-group-text w-100 b-drawing remove-class"><strong>B Drawing</strong></span>
                                </div>
                                <input type="text" class="form-control b-drawing remove-class" id="txtBDrawingNo" name="b_drawing_no" readonly>
                                <input type="text" class="form-control b-drawing remove-class" id="txtBDrawingRevision" name="b_drawing_revision" readonly>
                            </div>
                            <hr>
                            <div class="row"><!-- Start Row OQC Data -->
                                <div class="row">
                                    <div class="col-sm-12">
                                        <strong>* OQC Data</strong>
                                    </div>
                                </div>
                                <div class="col-sm-6 mt-3">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Machine No.</strong></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" id="txtOqcInspectionMachineNo" name="oqc_inspection_machine_no" readonly>

                                    </div>
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Lot No.</strong></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" id="txtOqcInspectionLotNo" name="oqc_inspection_lot_no" readonly>
                                    </div>
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Application Date</strong></span>
                                        </div>
                                        <input type="date" class="form-control form-control-sm" id="dateOqcInspectionApplicationDate" name="oqc_inspection_application_date" value="{{ \Carbon\Carbon::now()->format('Y-m-d') }}" readonly>
                                    </div>
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Application Time</strong></span>
                                        </div>
                                        <input type="time" class="form-control form-control-sm" id="timeOqcInspectionApplicationTime" name="oqc_inspection_application_time" value="{{ \Carbon\Carbon::now()->format('H:i:s') }}" readonly>
                                    </div>
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Product Category</strong></span>
                                        </div>
                                        <select class="form-select form-control-sm" id="slctOqcInspectionProductCategory" name="oqc_inspection_product_category">
                                            <option selected disabled>--- Select ---</option>
                                            <option value="Automotive">Automotive</option>
                                            <option value="Non-Automotive">Non-Automotive</option>
                                        </select>
                                    </div>
                                    {{-- <div class="mb-2">
                                        <div class="card">
                                            <input type="text" class="text-hidden" id="txtPrintLotCounter" name="print_lot_counter" value="0" readonly>
                                            <span class="input-group-text w-100"><strong>Print Lot No.</strong></span>
                                            <div class="row mb-1 mt-1" id="divPrintLotFields">
                                                <div class="col-3">
                                                    <button class="btn btn-info btn-sm ml-4" id="btnAddPrintLot" title="Add Print Lot"><i class="fa fa-plus"></i></button>
                                                    <button class="btn btn-danger btn-sm d-none" id="btnRemovePrintLot" title="Remove Print Lot"><i class="fas fa-times"></i></button>
                                                </div>
                                                <div class="col-4">
                                                    <input type="text" class="form-control form-control-sm mb-1" id="txtPrintLotNo_0" name="print_lot_no_0" placeholder="Print Lot No.">
                                                </div>
                                                <div class="col-4 mr-2">
                                                    <input type="number" class="form-control form-control-sm" id="txtPrintLotQty_0" name="print_lot_qty_0"  placeholder="Print Lot Qty">
                                                </div>
                                            </div>
                                        </div>
                                    </div> --}}
                                </div>
                                <div class="col-sm-6 mt-3">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>P.O. No.</strong></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" id="txtOqcInspectionPoNo" name="oqc_inspection_po_no" readonly>
                                    </div>
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Material Name</strong></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" id="txtOqcInspectionMaterialName" name="oqc_inspection_material_name" readonly>
                                    </div>
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Customer</strong></span>
                                        </div>
                                        <select class="form-select form-control-sm customerDropdown" id="slctOqcInspectionCustomer" name="oqc_inspection_customer">
                                        </select>
                                    </div>
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>P.O. Qty.</strong></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" id="txtOqcInspectionPoQty" name="oqc_inspection_po_qty" readonly>
                                    </div>
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Family</strong></span>
                                        </div>
                                        <select class="form-select form-control-sm familyDropdown" id="txtOqcInspectionFamily" name="oqc_inspection_family">
                                        </select>
                                    </div>
                                    {{-- <div class="mb-2">
                                        <div class="card">
                                            <input type="text" class="text-hidden" id="txtReelLotCounter" name="reel_lot_counter" value="0" readonly>
                                            <span class="input-group-text w-100"><strong>Reel Lot No.</strong></span>
                                            <div class="row mb-1 mt-1" id="divReelLotFields">
                                                <div class="col-3">
                                                    <button class="btn btn-info btn-sm ml-4" id="btnAddReelLot" title="Add Reel Lot"><i class="fa fa-plus"></i></button>
                                                    <button class="btn btn-danger btn-sm d-none" id="btnRemoveReelLot" title="Remove Reel Lot"><i class="fas fa-times"></i></button>
                                                </div>
                                                <div class="col-4">
                                                    <input type="text" class="form-control form-control-sm mb-1" id="txtReelLotNo_0" name="reel_lot_no_0" placeholder="Reel Lot No.">
                                                </div>
                                                <div class="col-4 mr-2">
                                                    <input type="number" class="form-control form-control-sm" id="txtReelLotQty_0" name="reel_lot_qty_0"  placeholder="Reel Lot Qty">
                                                </div>
                                            </div>
                                        </div>
                                    </div> --}}
                                </div>
                            </div><!-- /.End Row OQC Data -->

                            <div class="row"><!-- Start Row Sampling Plan -->
                                <div class="row">
                                    <hr>
                                    <div class="col-sm-12">
                                        <strong>* Sampling Plan</strong>
                                    </div>
                                </div>
                                <div class="col-sm-6 mt-3">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Type of Inspection</strong></span>
                                        </div>
                                        <select class="form-select form-control-sm inspectionTypeDropdown" id="slctOqcInspectionInspectionType" name="oqc_inspection_inspection_type">
                                        </select>
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Severity of Inspection</strong></span>
                                        </div>
                                        <select class="form-select form-control-sm severityInspectionDropdown" id="slctOqcInspectionInspectionSeverity" name="oqc_inspection_inspection_severity">
                                        </select>
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Inspection Level</strong></span>
                                        </div>
                                        <select class="form-select form-control-sm inspectionLevelDropdown" id="slctOqcInspectionInspectionLevel" name="oqc_inspection_inspection_level">
                                        </select>
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Lot Qty.</strong></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" id="txtOqcInspectionLotQty" name="oqc_inspection_lot_qty" onkeypress="return event.charCode >= 48 && event.charCode <= 57" readonly>
                                    </div>
                                </div>

                                <div class="col-sm-6 mt-3">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>AQL</strong></span>
                                        </div>
                                        <select class="form-select form-control-sm aqlDropdown" id="slctOqcInspectionAql" name="oqc_inspection_aql">
                                        </select>
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Sample Size</strong></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" id="txtOqcInspectionSampleSize" name="oqc_inspection_sample_size">
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Accept</strong></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" id="txtOqcInspectionAccept" name="oqc_inspection_accept" readonly value="0">
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Reject</strong></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" id="txtOqcInspectionReject" name="oqc_inspection_reject" readonly value="1">
                                    </div>
                                </div>
                            </div><!-- /.End Row Sampling Plan -->

                            <div class="row"><!-- Start Row Visual Inspection -->
                                <div class="row">
                                    <hr>
                                    <div class="col-sm-12">
                                        <strong>* Visual Inspection</strong>
                                    </div>
                                </div>
                                <div class="col-sm-6 mt-3">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Date Inspected</strong></span>
                                        </div>
                                        <input type="date" class="form-control form-control-sm" id="dateOqcInspectionDateInspected" name="oqc_inspection_date_inspected" value="{{ \Carbon\Carbon::now()->format('Y-m-d') }}" readonly>
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-30">
                                            <span class="input-group-text w-100"><strong>Work Week</strong></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" id="txtOqcInspectionWorkWeek" name="oqc_inspection_work_week" onkeypress="return event.charCode >= 48 && event.charCode <= 57" readonly>
                                        <div class="input-group-prepend w-30">
                                            <span class="input-group-text w-100"><strong>Fiscal Year</strong></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" id="txtOqcInspectionFiscalYear" name="oqc_inspection_fiscal_year" onkeypress="return event.charCode >= 48 && event.charCode <= 57" readonly>
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-30">
                                            <span class="input-group-text w-100"><strong>Time Inspected</strong></span>
                                        </div>
                                        <input type="time" class="form-control form-control-sm mr-2" id="timeOqcInspectionTimeInspectedFrom" name="oqc_inspection_time_inspected_from">
                                        <input type="time" class="form-control form-control-sm" id="timeOqcInspectionTimeInspectedTo" name="oqc_inspection_time_inspected_to">
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Shift</strong></span>
                                        </div>
                                        <select class="form-select form-control-sm" id="slctOqcInspectionShift" name="oqc_inspection_shift">
                                            <option selected disabled>-- Select --</option>
                                            <option value="A">Shift A</option>
                                            <option value="B">Shift B</option>
                                        </select>
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Submission</strong></span>
                                        </div>
                                        <select class="form-select form-control-sm slct" id="slctOqcInspectionSubmission" name="oqc_inspection_submission">
                                            <option selected disabled>--- Select ---</option>
                                            <option value="1">1st</option>
                                            <option value="2">2nd</option>
                                            <option value="3">3rd</option>
                                        </select>
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Coc Requirement</strong></span>
                                        </div>
                                        <select class="form-select form-control-sm" id="slctOqcInspectionCocRequirement" name="oqc_inspection_coc_requirement">
                                            <option selected disabled>-- Select --</option>
                                            <option value="1">Yes</option>
                                            <option value="2">No</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-sm-6 mt-3">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Lot Inspected</strong></span>
                                        </div>
                                        <input type="number" class="form-control form-control-sm" id="txtOqcInspectionLotInspected" name="oqc_inspection_lot_inspected" onkeypress="return event.charCode >= 48 && event.charCode <= 57" value="1" readonly>
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Lot Accepted</strong></span>
                                        </div>
                                        <select class="form-select form-control-sm" id="slctOqcInspectionLotAccepted" name="oqc_inspection_lot_accepted">
                                            <option selected disabled>-- Select --</option>
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                        </select>
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Judgement</strong></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" id="txtOqcInspectionJudgement" name="oqc_inspection_judgement" readonly>
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Remarks</strong></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" id="txtOqcInspectionRemarks" name="oqc_inspection_remarks" value="">
                                    </div>

                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>Inspector</strong></span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" id="txtOqcInspectionInspector" name="oqc_inspection_inspector" readonly>
                                    </div>

                                    <div class="input-group input-group-sm mb-3 d-none  mod-class">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100"><strong>No. of Defectives</strong></span>
                                        </div>
                                        <input type="text" class="form-control defectCounts form-control-sm" id="txtOqcInspectionDefectiveNum" name="oqc_inspection_defective_num" readonly>
                                    </div>
                                </div>
                            </div><!-- /.End Row Visual Inspection -->

                            <div class="mb-2 d-none mod-class">
                                <div class="card">
                                    <input type="text" class="text-hidden" id="txtModCounter" name="mod_counter" value="0" readonly>
                                    <span class="input-group-text w-100"><strong>Mode of Defects</strong></span>
                                    <div class="row mb-1 mt-1" id="divModFields">
                                        <div class="col-2">
                                            <button class="btn btn-info btn-sm ml-5" id="btnAddMod" title="Add Mode of Defect"><i class="fa fa-plus"></i></button>
                                            <button class="btn btn-danger btn-sm d-none" id="btnRemoveMod" title="Remove  Mode of Defect"><i class="fas fa-times"></i></button>
                                        </div>
                                        <div class="col-4">
                                            <select class="form-select form-control-sm selectEmpty inspectionModDropdown_0 mb-1" id="txtMod_0" name="mod_0"  placeholder="Mode of Defect">
                                            </select>
                                        </div>
                                        <div class="col-5 mr-1">
                                            <input type="number" class="form-control defectCounts form-control-sm" id="txtModQty_0" name="mod_qty_0"  placeholder="Mode of Defect Qty">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 input-group py-3 border-top d-none actionBtnOqcInspection">
                            <div class="col-6">
                                <button type="button" class="btn btn-default" data-bs-dismiss="modal">Close</button>
                            </div>
                            <div class="col-6 gap-2 d-flex justify-content-end">
                                <button type="submit" id="btnOqcInspection" class="btn btn-dark">
                                    <i id="iBtnOqcInspectionIcon" class="fa fa-save"></i> Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div><!-- /.End OQC Inspection Modal -->

        <!-- Start Scan Modal -->
        <div class="modal fade" id="mdlScanQrCode" data-formid="" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body mt-3">
                        <input type="text" class="scanQrBarCode w-100 d-none" id="txtScanQrCode" name="scan_qr_code" placeholder="Scan Sticker" autocomplete="off">
                        <input type="text" class="scanQrBarCode w-100 d-none" id="txtOqcInspectionScanUserId" name="scan_user_id" placeholder="Scan User ID" autocomplete="off">
                        <div class="text-center text-secondary oqcInspectionScanning"></div>
                        <div class="text-center text-secondary"><h1><i class="fa fa-qrcode fa-lg"></i></h1></div>
                    </div>
                </div>
            </div>
        </div><!-- /.End Scan Modal -->
    @endsection

    @section('js_content')
        <script type="text/javascript">
            let getPoNo
            // let checkedDrawCountFirstStamping
            let dataTableOQCInspection
            let getStatus = '2'

            $(document).ready(function() {
                $('.select2bs4').select2({
                    theme: 'bootstrap-5'
                })

                // ======================= START DATA TABLE =======================
                dataTableOQCInspection = $("#tblOqcInspection").DataTable({
                    "processing"    : false,
                    "serverSide"    : true,
                    "destroy"       : true,
                    "ajax" : {
                        url: "view_oqc_inspection",
                        data: function (pamparam){
                            pamparam.poNo = getPoNo
                            pamparam.getStatus = getStatus
                            // pamparam.prodLotNo = $("#txtOQCProdLotNo").val();
                        },
                    },
                    "columns":[
                        { "data" : "action", orderable:false, searchable:false },
                        { "data" : "status" },
                        { "data" : "part_name" },
                        { "data" : "po_number" },
                        { "data" : "po_quantity" },
                        { "data" : "production_lot" },
                        { "data" : "shipment_output" },
                        { "data" : "ud_ptnr" },
                        { "data" : "sample_size" },
                        { "data" : "judgement" },
                        { "data" : "inspector" },
                        { "data" : "date_inspected" },
                    ],
                    "columnDefs": [
                        // { className: "align-center", targets: [1, 2] },
                    ],
                    "rowCallback": function( row, data, index ) {
                        if (data["production_lot"] == $("#txtOQCProdLotNo").val()){
                            $("td",row).css("background-color","#74f27f");
                            $("td",row).css("color","#000000");
                            $("td",row).find('.actionEditOqcInspection').prop('disabled', false);
                            // $("td",row).css("color","#000000");
                            // $("td",row).css("background-color","#EDE26B");
                            // $("td",row).css("color","#ffffff");
                            // $('td:eq(1)', row).html('<center><span class="badge badge-pill badge-warning" style="height: 20px;">To Receive</span></center>');
                        }
                    }
                })

                $('.oqc-button').click(function() {
                    getStatus = event.target.getAttribute('value')
                    dataTableOQCInspection.draw()
                });

                $('#btnScanPo').on('click', function(e){
                    e.preventDefault()
                    console.log('Show scan qr code field')

                    $('#mdlScanQrCode').modal('show')
                    $('#mdlScanQrCode').on('shown.bs.modal', function () {
                        $('.oqcInspectionScanning').text('Please scan QR Code Sticker')
                        $('#txtOqcInspectionScanUserId').addClass('d-none')
                        $('#txtScanQrCode').removeClass('d-none')
                        $('#txtScanQrCode').focus()
                        const mdlScanQrCodeOqcInspection = document.querySelector("#mdlScanQrCode");
                        const inptQrCodeOqcInspection = document.querySelector("#txtScanQrCode");
                        let focus = false

                        mdlScanQrCodeOqcInspection.addEventListener("mouseover", () => {
                            if (inptQrCodeOqcInspection === document.activeElement) {
                                focus = true
                            } else {
                                focus = false
                            }
                        })

                        mdlScanQrCodeOqcInspection.addEventListener("click", () => {
                            if (focus) {
                                inptQrCodeOqcInspection.focus()
                            }
                        })
                    })
                })

                $('#txtScanQrCode').on('keypress',function(e){
                    if( e.keyCode == 13 ){
                        const scanQrCode = $('#txtScanQrCode').val()
                        console.log('scanQrCode: ', scanQrCode);
                        try{
                            let po = JSON.parse(scanQrCode)
                            console.log('po', po);
                            console.log('part_name', po.part_name);
                            device_name = po.part_name;
                            console.log('device_name', device_name);

                            fetchData(device_name, function(result, error) {
                                if(error){
                                    alert("Something went wrong: " + error);
                                    return;
                                }

                                // if(result.dmrpqc_device_info){ //clark comment for now due to issues in DMRPQC
                                        getPoNo =  po.po_number
                                        $('#txtPoNumber').val(po.po_number)
                                        $('#txtMaterialName').val(po.part_name)
                                        $('#txtPoQuantity').val(po.po_quantity)
                                        $("#txtOQCProdLotNo").val(po.production_lot)
                                        $('#mdlScanQrCode').modal('hide')
                                // }else{ //clark comment for now due to issues in DMRPQC
                                //     alert("Device has no completed DMR & PQC data, Please complete to DMR & PQC first");
                                // }
                            });

                        }catch (error) {
                            alert('The Scan QR Code was not found!')
                            $('.invalidScan').val('')
                            getPoNo = ''
                        }
                        $('#mdlScanQrCode').modal('hide')
                        dataTableOQCInspection.draw()
                        $('#txtScanQrCode').val('')
                    }
                })

                $('#mdlScanQrCode').on('hidden.bs.modal', function() {
                    console.log('HIDE SCAN CODE')
                    $('#txtOqcInspectionScanUserId').addClass('d-none').val('')
                    $('#txtScanQrCode').addClass('d-none').val('')
                    $('.oqcInspectionScanning').text('')
                    // dataTableOQCInspection.draw()//old clark 01/16/2025

                    // const qrScannedProdRuncardItem = $('#txtScanProdRuncardQrData').val();
                    //     let ScannedProdRuncardQrCodeVal = JSON.parse(qrScannedProdRuncardItem)
                    //     console.log('scanned',ScannedProdRuncardQrCodeVal);
                    //     // scannedItem = JSON.parse($(this).val());
                    //     // scannedItem = $('#txtScanQrData').val().toUpperCase();
                    //     // scannedItem = $('#txtScanQrData').val();
                    //     // console.log('scannedItem', scannedItem);
                    //     $('#tblProductionRuncard tbody tr').each(function(index, tr){
                    //         let lot_no = $(tr).find('td:eq(5)').text().trim().toUpperCase();
                    //         let powerOff = $(this).find('td:nth-child(1)').children().children();

                    //         console.log('tbl_lot_no', lot_no);
                    //         console.log('scannedItem', ScannedProdRuncardQrCodeVal.production_lot);
                    //         if(ScannedProdRuncardQrCodeVal.production_lot === lot_no){
                    //             console.log('found');
                    //             $(tr).addClass('checked-ok');
                    //             powerOff.removeAttr('style');
                    //             $('#modalSearchProdRuncardData').modal('hide');
                    //         }
                    //         // console.log(lot_no);
                    //     })
                })


                $(document).on('click', '.actionEditOqcInspection', function(e){
                    e.preventDefault()

                    getPo                       = $(this).attr('prod-po')
                    getPoQty                    = $(this).attr('prod-po_qty')
                    getOqcId                    = $(this).attr('oqc_inspection-id')
                    getProdId                   = $(this).attr('prod-id')
                    getProdLotNo                = $(this).attr('prod-lot_no')
                    getMaterialCode             = $(this).attr('prod-material_name')
                    getProdShipOutput           = $(this).attr('prod-ship_output')

                    $('#txtCheckButton').val('update')

                    $time_now = moment().format('HH:mm:ss');
                    setTimeout(() => {
                        if($time_now >= '7:30 AM' || $time_now <= '7:29 PM'){
                            $('#slctOqcInspectionShift').val('A');
                        }
                        else{
                            $('#slctOqcInspectionShift').val('B');
                        }
                    }, 300);

                    if(getOqcId == 0){
                        $('#slctOqcInspectionSubmission').val('1')
                    }

                    GetOqcInspectionById(
                        getPo,
                        getPoQty,
                        getOqcId,
                        getProdId,
                        getProdLotNo,
                        getMaterialCode,
                        getProdShipOutput
                    )

                    $('#txtProdId').val(getProdId)
                    $('#txtOqcInspectionId').val(getOqcId)
                })

                $('#btnOqcInspectionViewBDrawings').click(function (e) {
                    e.preventDefault();
                    window.open("http://rapid/ACDCS/prdn_home_pats_ppd?doc_no="+$('#txtBDrawingNo').val())
                    SetClassRemove('b-drawing', 'bg-success-custom font-weight-bold text-white')
                    if($('#txtCheckButton').val() == 'update'){
                        $('.actionBtnOqcInspection').removeClass('d-none')
                    }
                });

                $(document).on('click', '.actionViewOqcInspection', function(e){
                    e.preventDefault()
                    console.log('actionViewOqcInspection')
                    getPo                       = $(this).attr('prod-po')
                    modal                       = $(this).attr('data-bs-target')
                    getPoQty                    = $(this).attr('prod-po_qty')
                    getOqcId                    = $(this).attr('oqc_inspection-id')
                    getProdId                   = $(this).attr('prod-id')
                    getProdLotNo                = $(this).attr('prod-lot_no')
                    getMaterialCode             = $(this).attr('prod-material_name')
                    getProdShipOutput           = $(this).attr('prod-ship_output')

                    $('#txtCheckButton').val('view')

                    GetOqcInspectionById(
                        getPo,
                        getPoQty,
                        getOqcId,
                        getProdId,
                        getProdLotNo,
                        getMaterialCode,
                        getProdShipOutput
                    )
                    $('#txtProdId').val(getProdId)
                    $('#txtOqcInspectionId').val(getOqcId)
                })

                $(document).on('click', '.actionEditOqcInspectionHistory', function(e){
                    e.preventDefault()
                    console.log('actionEditOqcInspectionHistory')
                    getPo               = $(this).attr('prod-po')
                    getPoQty            = $(this).attr('prod-po_qty')
                    getOqcId            = $(this).attr('oqc_inspection-id')
                    getProdId           = $(this).attr('prod-id')
                    getProdLotNo        = $(this).attr('prod-lot_no')
                    getMaterialCode     = $(this).attr('prod-material_name')
                    getProdShipOutput   = $(this).attr('prod-ship_output')

                    getPoNo = getPo;

                    dataTableOQCInspection = $("#tblOqcInspectionHistory").DataTable({
                        "processing"    : false,
                        "serverSide"    : true,
                        "destroy"       : true,
                        "ajax" : {
                            url: "view_oqc_inspection_history",
                            data: function (pamparam){
                                pamparam.poNoById = getProdId
                            },
                        },

                        "columns":[
                            { "data" : "action", orderable:false, searchable:false },
                            { "data" : "production_runcard_info.po_number" },
                            { "data" : "production_runcard_info.po_quantity" },
                            { "data" : "production_runcard_info.production_lot" },
                            { "data" : "production_runcard_info.shipment_output" },
                            { "data" : "production_runcard_info.part_name" },
                            { "data" : "fy_ww" },
                            { "data" : "date_inspected" },
                            { "data" : "time_ins_from" },
                            { "data" : "time_ins_to" },
                            { "data" : "submission" },
                            { "data" : "sample_size" },
                            { "data" : "mod" },
                            { "data" : "num_of_defects" },
                            { "data" : "judgement" },
                            { "data" : "inspector" },
                            { "data" : "remarks" },
                            { "data" : "family" },
                            { "data" : "update_user" },
                            { "data" : "created_at" }
                        ],
                        "columnDefs": [
                            // { className: "align-center", targets: [1, 2] },
                        ],
                    })
                })

                $('#modalOqcInspection').on('hide.bs.modal', function() {
                    console.log('Hide OQC Inspection modal')
                    $("#formOqcInspection")[0].reset()
                    $('.mod-class').addClass('d-none')
                    $('#txtScanQrCode').addClass('d-none')
                    $('.actionBtnOqcInspection').addClass('d-none')
                    $('#txtOqcInspectionScanUserId').addClass('d-none')

                    $(`.remove-class`).removeClass('bg-success-custom font-weight-bold text-white')
                    dataTableOQCInspection.draw()
                })

                // ===================== SCRIPT FOR ADD PRINT LOT ===================
                let printLotCounter = 0;
                $('#btnAddPrintLot').on('click', function(e){
                    e.preventDefault()
                    printLotCounter++
                    if(printLotCounter > 0){
                        $('#btnRemovePrintLot').removeClass('d-none')
                    }
                    console.log('Print lot Row(+):', printLotCounter)

                    let html = '<div class="col-3 mb-1 divAddPrintLot_'+printLotCounter+'">'
                        html += '</div>'
                        html += '<div class="col-4 mb-1 divAddPrintLot_'+printLotCounter+'">'
                        html += '   <input type="text" class="form-control form-control-sm w-100" id="txtPrintLotNo_'+printLotCounter+'" name="print_lot_no_'+printLotCounter+'" placeholder="Print Lot No">'
                        html += '</div>'
                        html += '<div class="col-4 mb-1 divAddPrintLot_'+printLotCounter+'">'
                        html += '   <input type="number" class="form-control form-control-sm w-100" id="txtPrintLotQty_'+printLotCounter+'" name="print_lot_qty_'+printLotCounter+'" placeholder="Print Lot Qty">'

                    $('#txtPrintLotCounter').val(printLotCounter)
                    $('#divPrintLotFields').append(html)
                })
                // ================== SCRIPT FOR REMOVE PRINT LOT ======================
                $("#btnRemovePrintLot").on('click', function(e){
                    e.preventDefault()

                    if(printLotCounter > 0){
                        $('.divAddPrintLot_'+printLotCounter).remove()
                        printLotCounter--
                        $('#txtPrintLotCounter').val(printLotCounter).trigger('change')
                        console.log('Print lot Row(-):' + printLotCounter)
                    }

                    if(printLotCounter < 1){
                        $('#btnRemovePrintLot').addClass('d-none')
                    }
                })

                // ===================== SCRIPT FOR ADD REEL LOT ===================
                let reelLotCounter = 0;
                $('#btnAddReelLot').on('click', function(e){
                    e.preventDefault()
                    reelLotCounter++
                    if(reelLotCounter > 0){
                        $('#btnRemoveReelLot').removeClass('d-none')
                    }
                    console.log('Reel lot Row(+):', reelLotCounter)
                    let html = '   <div class="col-3 mb-1 divAddReelLot_'+reelLotCounter+'">'
                        html += '   </div>'
                        html += '   <div class="col-4 mb-1 divAddReelLot_'+reelLotCounter+'">'
                        html += '       <input type="text" class="form-control form-control-sm" id="txtReelLotNo_'+reelLotCounter+'" name="reel_lot_no_'+reelLotCounter+'" placeholder="Reel Lot No">'
                        html += '   </div>'
                        html += '   <div class="col-4 mb-1 divAddReelLot_'+reelLotCounter+'">'
                        html += '       <input type="number" class="form-control form-control-sm" id="txtReelLotQty_'+reelLotCounter+'" name="reel_lot_qty_'+reelLotCounter+'" placeholder="Reel Lot Qty">'
                        html += '   </div>'

                    $('#txtReelLotCounter').val(reelLotCounter)
                    $('#divReelLotFields').append(html)
                })
                // ================== SCRIPT FOR REMOVE REEL LOT ======================
                $("#btnRemoveReelLot").on('click', function(e){
                    e.preventDefault()

                    if(reelLotCounter > 0){
                        $('.divAddReelLot_'+reelLotCounter).remove()
                        reelLotCounter--
                        $('#txtReelLotCounter').val(reelLotCounter).trigger('change')
                        console.log('Reel lot Row(-):' + reelLotCounter)
                    }

                    if(reelLotCounter < 1){
                        $('#btnRemoveReelLot').addClass('d-none')
                    }
                })

                // ===================== SCRIPT FOR ADD MOD ===================
                let modCounter = 0;
                $('#btnAddMod').on('click', function(e){
                    e.preventDefault()
                    modCounter++
                    if(modCounter > 0){
                        $('#btnRemoveMod').removeClass('d-none')
                    }
                    console.log('Reel lot Row(+):', modCounter)
                    let html = '   <div class="col-2 mb-1 divAddMod_'+modCounter+'">'
                        html += '   </div>'
                        html += '   <div class="col-4 mb-1 divAddMod_'+modCounter+'">'
                        html += '       <select class="form-select form-control-sm selectEmpty inspectionModDropdown_'+modCounter+' mb-1" id="txtMod_'+modCounter+'" name="mod_'+modCounter+'"  placeholder="Mode of Defect"></select>'
                        html += '   </div>'
                        html += '   <div class="col-5 mb-1 mr-1 divAddMod_'+modCounter+'">'
                        html += '       <input type="number" class="form-control defectCounts form-control-sm" id="txtModQty_'+modCounter+'" name="mod_qty_'+modCounter+'" placeholder="Defect of Defect Qty">'
                        html += '   </div>'

                    $('#txtModCounter').val(modCounter)
                    $('#divModFields').append(html)

                    GetMOD($('.inspectionModDropdown_'+modCounter+''))
                })
                // ================== SCRIPT FOR REMOVE MOD ======================
                $("#btnRemoveMod").on('click', function(e){
                    e.preventDefault()

                    if(modCounter > 0){
                        $('.divAddMod_'+modCounter).remove()
                        modCounter--
                        $('#txtModCounter').val(modCounter).trigger('change')
                        console.log('Reel lot Row(-):' + modCounter)
                    }

                    if(modCounter < 1){
                        $('#btnRemoveMod').addClass('d-none')
                    }
                })

                $('#slctOqcInspectionLotAccepted').on('change', function () {
                    if($('#slctOqcInspectionLotAccepted').val() == '1' || $('#slctOqcInspectionLotAccepted').val() == ''){
                        $('.mod-class').addClass('d-none')
                        if($('#slctOqcInspectionLotAccepted').val() != ''){
                            $('#txtOqcInspectionJudgement').val('Accept')
                            $('.selectEmpty').empty()
                            $('.defectCounts').val('')
                        }else{
                            $('#txtOqcInspectionJudgement').val('')
                        }
                    }else{
                        GetMOD($('.inspectionModDropdown_0'))
                        $('#txtOqcInspectionJudgement').val('Reject')
                        $('.mod-class').removeClass('d-none')
                    }
                })

                $('#formOqcInspection').submit(function (e) {
                    e.preventDefault()
                    console.log('Save OQC Inspection')
                    $('#mdlScanQrCode').modal('show')
                    $('#mdlScanQrCode').on('shown.bs.modal', function () {
                        $('.oqcInspectionScanning').text('Please scan employee ID')
                        $('#txtScanQrCode').addClass('d-none')
                        $('#txtOqcInspectionScanUserId').removeClass('d-none')
                        $('#txtOqcInspectionScanUserId').focus()

                        const mdlScanUserId = document.querySelector("#mdlScanQrCode");
                        const inptScanUserId = document.querySelector("#txtOqcInspectionScanUserId");
                        let focus = false

                        mdlScanUserId.addEventListener("mouseover", () => {
                            if (inptScanUserId === document.activeElement) {
                                focus = true
                            } else {
                                focus = false
                            }
                        });

                        mdlScanUserId.addEventListener("click", () => {
                            if (focus) {
                                inptScanUserId.focus()
                            }
                        });
                    });
                })

                $('#txtOqcInspectionScanUserId').on('keypress',function(e){
                    if( e.keyCode == 13 ){
                        $.ajax({
                            url: "scan_user_id",
                            type: "get",
                            data: {
                                user_id : $('#txtOqcInspectionScanUserId').val().toUpperCase(),
                            },
                            dataType: "json",
                            success: function (response) {
                                let userDetails = response['userDetails']
                                if(userDetails != null){
                                    $('#txtEmployeeNo').val(userDetails.employee_id)
                                    UpdateOqcInspection()
                                }else{
                                    toastr.error('Only QC supervisors and inspectors are authorized to save!')
                                }
                            }
                        })
                        $('#txtOqcInspectionScanUserId').val('')
                        $('#mdlScanQrCode').modal('hide')
                    }
                })
            })

            if("<?php echo Auth::user()->position; ?>" == 0 || "<?php echo Auth::user()->position; ?>" == 2){
                $('#txtPoNumber').attr('readonly', false)
                $('#txtPoNumber').on('keypress',function(e){
                    if( e.keyCode == 13 ){
                        getPoNo =  $('#txtPoNumber').val()
                        $.ajax({
                            url: "production_runcard_details",
                            type: "get",
                            data: {
                                getPoNo : getPoNo,
                            },
                            dataType: "json",
                            success: function (response) {
                                let getProductionRuncardDetails = response['getProductionRuncardDetails']
                                if(getProductionRuncardDetails != null){
                                    $('#txtMaterialName').val(getProductionRuncardDetails.part_name)
                                    $('#txtPoQuantity').val(getProductionRuncardDetails.po_quantity)
                                }
                            }
                        })
                        dataTableOQCInspection.draw()
                    }
                })
            }
        </script>
    @endsection
@endauth
