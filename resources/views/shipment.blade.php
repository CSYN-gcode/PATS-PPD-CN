@php $layout = 'layouts.admin_layout'; @endphp
@auth
@extends($layout)
@section('title', 'Dashboard')
@section('content_page')
    <style>
        table.table tbody td{
            padding: 4px 4px;
            margin: 1px 1px;
            font-size: 13px;
            /* text-align: center; */
            vertical-align: middle;
        }
        table.table thead th{
            padding: 4px 4px;
            margin: 1px 1px;
            font-size: 15px;
            text-align: center;
            vertical-align: middle;
        }
        table#tblFVIRuncards thead th{
            padding: 4px 4px;
            margin: 1px 1px;
            font-size: 13px;
            text-align: center;
            vertical-align: middle;
        }
        .select2-container--bootstrap-5 .select2-selection--single .select2-selection__rendered {
            font-size: .85rem;
            padding: .0em 0.55vmax;
            margin-bottom: 0px;
        }
        .select2-container--bootstrap-5 .select2-selection--multiple{
            pointer-events: none;
        }
    </style>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <!-- Content Header (Page header) -->
        <section class="content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <h1>Internal Invoice</h1>
                    </div>
                    <div class="col-sm-6">
                        <ol class="breadcrumb float-sm-right">
                            <li class="breadcrumb-item active">Internal Invoice</li>
                        </ol>
                    </div>
                </div>
            </div><!-- /.container-fluid -->
        </section>

        <!-- Main content -->
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="card">
                            <div class="card-header">
                                {{-- <h3 class="card-title">2. Delivery Summary</h3> --}}
                                <button class="btn btn-primary btn-sm" style="float: left;" data-bs-toggle="modal" data-bs-target="#modalAddShipmentData" id="btnAddShipmentData"><i class="fa fa-plus"></i> New Invoice </button>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-sm table-bordered table-hover w-100" id="tblShipment">
                                        <thead>
                                            <tr>
                                                <th>Action</th>
                                                <th>Ctrl #</th>
                                                <th>Pre-shipment Ctrl #</th>
                                                <th>Date</th>
                                                <th>Rev #</th>
                                                <th>Sold to</th>
                                                <th>Shipped by</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->

   <!-- MODALS -->
<div class="modal fade" id="modalAddShipmentData" data-bs-backdrop="static">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Internal Invoice</h4>
                {{-- <h4 class="modal-title"><i class="fa fa-plus"></i> Add Shipment Data</h4> --}}
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="formAddShipmentData" autocomplete="off">
                @csrf
                <div class="modal-body">
                    <div class="row">
                        <div class="col border px-4 py-3">
                            <div class="d-flex justify-content-start align-items-center mb-3">
                                <span class="badge badge-secondary mr-2">1.</span>
                                <span class="font-weight-bold">Shipment Data</span>
                                <div class="ml-auto">
                                    <div class="d-flex">
                                        <div class="input-group input-group-sm mb-3">
                                            <div class="input-group-prepend w-50">
                                                <span class="input-group-text w-100" id="basic-addon1">Pre-Shipment Ctrl #</span>
                                            </div>
                                            <input type="text" class="form-control" name="ps_ctrl_number" id="txtPsCtrlNumber" aria-describedby="basic-addon1"/>
                                            <div class="input-group-append">
                                                <button class="btn btn-primary btn-sm" id="loadPOReceivedDetails" type="button" style="height: 100%;">
                                                    Load
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Form Section -->
                            <div class="row">
                                <div class="col-sm-6">
                                    <div>
                                        <input type="hidden" class="form-control" name="shipment_id" id="txtShipmentId" readonly/>
                                    </div>
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon1">Control No</span>
                                        </div>
                                        <input type="text" class="form-control" name="ctrl_number" id="txtCtrlNumber" placeholder="Auto Generated" readonly aria-describedby="basic-addon1"/>
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon3">Rev No</span>
                                        </div>
                                        <input type="text" class="form-control" name="rev_no" id="txtRevNo" value="0" readonly aria-describedby="basic-addon3">
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon2">Date</span>
                                        </div>
                                        <input type="date" class="form-control" name="shipment_date" id="txtShipmentDate" aria-describedby="basic-addon2"/>
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon3">Shipped By</span>
                                        </div>
                                        <input type="text" class="form-control" name="shipped_by" id="txtShippedBy" value="PPD" readonly aria-describedby="basic-addon3">
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon3">Sold To</span>
                                        </div>
                                        <input type="text" class="form-control" name="sold_to" id="txtSoldTo" aria-describedby="basic-addon3">
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon3">Pre-Shipment Control No</span>
                                        </div>
                                        <input type="text" class="form-control d-none" name="preShipment_id" id="txtPreShipmentId">
                                        <input type="text" class="form-control" name="preShipment_ctrl" id="txtPreShipmentCtrl" aria-describedby="basic-addon3">
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon3">Sales Cut-off</span>
                                        </div>
                                        <select name="cut_off_date" id="txtCutOffDate" class="form-control">
                                            <option value="-" selected disabled>-- Select Sales-cutoff --</option>
                                            <option value="01">January</option>
                                            <option value="02">Febuary</option>
                                            <option value="03">March</option>
                                            <option value="04">April</option>
                                            <option value="05">May</option>
                                            <option value="06">June</option>
                                            <option value="07">July</option>
                                            <option value="08">August</option>
                                            <option value="09">September</option>
                                            <option value="10">October</option>
                                            <option value="11">November</option>
                                            <option value="12">December</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row" style="margin-top: 1rem;">
                        <div class="col border px-4 border">
                            <div class="py-3">
                                <div style="float: left;">
                                    <span class="badge badge-secondary">2.</span> Shipment Details
                                </div>
                                <div style="float: right;">
                                    <button class="btn btn-primary btn-sm" id="btnAddShipmentDetails" data-bs-toggle="modal" data-bs-target="#modalAddShipmentDetails" type="button" style="margin-bottom: 5px;">
                                        <i class="fa fa-plus"></i> Add Shipment Details
                                    </button>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-sm small table-bordered table-hover" id="tblShipmentDetails" style="width: 100%;">
                                        <thead>
                                            <tr class="bg-light">
                                                <th>Action</th>
                                                <th hidden>Category</th>
                                                <th hidden>PO No</th>
                                                <th>Item Code</th>
                                                <th>Item Name</th>
                                                <th>Order #</th>
                                                <th>Shipout Qty</th>
                                                <th>Unit Prices ($)</th>
                                                <th>Amount($)</th>
                                                <th>Lot #</th>
                                                <th>Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-6"></div>{{-- Blank Column --}}
                    <div class="col-sm-6">
                        <div class="ml-auto">
                            <div class="d-flex">
                                <div class="input-group input-group-sm mb-3">
                                    <div class="input-group-prepend w-50">
                                        <span class="input-group-text w-100" id="basic-addon1">Grand Total</span>
                                    </div>
                                    <input type="text" class="form-control" name="grand_total" id="txtGrandTotal" readonly aria-describedby="basic-addon1"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-default" data-bs-dismiss="modal">Close</button>
                    <button type="submit" id="btnSubmitShipmentData" class="btn btn-primary"><i id="btnSubmitShipmentDataDefIcon" class="fa fa-submit"></i> Submit</button>
                </div>
            </form>
        </div>
    <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
<!-- /.modal -->

<div class="modal fade" id="modalAddShipmentDetails" data-bs-backdrop="static">
    <div class="modal-dialog modal-md">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title"><i class="fa fa-plus"></i> Internal Invoice</h4>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="formAddShipmentDetails" autocomplete="off">
                @csrf
                <div class="modal-body">
                    <div class="row">
                        <div class="col border px-4 py-3">
                            <!-- Form Section -->
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="order-label">ORDER #</span>
                                        </div>
                                        <input list="order_no" name="order_no" id="txtOrderNo" class="form-control form-control-sm" aria-labelledby="order-label">
                                        <datalist id="order_no"></datalist>
                                    </div>
                                </div>

                                <div class="col-sm-12">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon3">CATEGORY</span>
                                        </div>
                                        <input type="text" class="form-control" name="category" id="txtCategory" readonly aria-describedby="basic-addon3">
                                    </div>
                                </div>

                                {{-- <div class="col-sm-12">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon3">Lot NO</span>
                                        </div>
                                        <input type="text" class="form-control" name="category" id="txtCategory" readonly aria-describedby="basic-addon3">
                                    </div>
                                </div> --}}

                                <div class="col-sm-12">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon3">PRODUCT PO #</span>
                                        </div>
                                        <input type="text" class="form-control" name="product_po_no" id="txtProductPoNo" readonly aria-describedby="basic-addon3">
                                    </div>
                                </div>

                                <div class="col-sm-12">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon3">ITEM CODE</span>
                                        </div>
                                        <input type="text" class="form-control" name="item_code" id="txtItemCode" readonly aria-describedby="basic-addon3">
                                    </div>
                                </div>

                                <div class="col-sm-12">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon3">ITEM NAME</span>
                                        </div>
                                        <input type="text" class="form-control" name="item_name" id="txtItemName" readonly aria-describedby="basic-addon3">
                                    </div>
                                </div>

                                <div class="col-sm-12">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon3">SHIPOUT QTY</span>
                                        </div>
                                        <input type="text" class="form-control" name="shipout_qty" id="txtShipoutQty" readonly aria-describedby="basic-addon3">
                                    </div>
                                </div>

                                <div class="col-sm-12">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon3">UNIT PRICE</span>
                                        </div>
                                        <input type="text" class="form-control" name="unit_price" id="txtUnitPrice" readonly aria-describedby="basic-addon3">
                                    </div>
                                </div>

                                <div class="col-sm-12">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon3">AMOUNT</span>
                                        </div>
                                        <input type="text" class="form-control" name="amount" id="txtAmount" readonly aria-describedby="basic-addon3">
                                    </div>
                                </div>

                                <div class="col-sm-12">
                                    <div class="input-group input-group-sm mb-3">
                                        <div class="input-group-prepend w-50">
                                            <span class="input-group-text w-100" id="basic-addon3">REMARKS</span>
                                        </div>
                                        <input type="text" class="form-control" name="remarks" id="txtRemarks" aria-describedby="basic-addon3">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-default" data-bs-dismiss="modal">Close</button>
                    <button type="submit" id="btnSubmitShipmentDetails" class="btn btn-primary"><i id="btnSubmitShipmentDetailsDefIcon" class="fa fa-submit"></i> Save</button>
                </div>
            </form>
        </div>
    <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

@endsection
@section('js_content')
<script>
</script>
@endsection
@endauth
