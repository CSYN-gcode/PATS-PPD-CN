function AddShipmentData(){
    toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": true,
      "progressBar": true,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "3000",
      "timeOut": "3000",
      "extendedTimeOut": "3000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut",
    };

    let form_data = new FormData($('#formAddShipmentData')[0]);

    $.ajax({
        url: "add_shipment_data",
        method: "post",
        processData: false,
        contentType: false,
        data: form_data,
        dataType: "json",
        beforeSend: function(){
            $("#btnSubmitShipmentDataDefIcon").removeClass('fa fa-upload')
            $("#btnSubmitShipmentDataDefIcon").addClass('fa fa-spinner fa-pulse');
            $("#btnSubmitShipmentData").prop('disabled', 'disabled');
        },
        success: function(JsonObject){

            $("#btnSubmitShipmentDataDefIcon").removeClass('fa fa-spinner fa-pulse');
            $("#btnSubmitShipmentData").removeAttr('disabled');
            $("#btnSubmitShipmentDataDefIcon").addClass('fa fa-upload');

            if(JsonObject['result'] == 1){
              $("#modalAddShipmentData").modal('hide');
              $("#formAddShipmentData")[0].reset();

              dtShipmentTable.draw();
              toastr.success('Data succesfully saved!');
            }else{
                toastr.error(' Saving Request Failed!');

                // if(JsonObject['result']['shipment_date'] === undefined){
                //     $("#txtShipmentDate").removeClass('is-invalid');
                //     $("#txtShipmentDate").attr('title', '');
                // }
                // else{
                //     $("#txtShipmentDate").addClass('is-invalid');
                //     $("#txtShipmentDate").attr('title', JsonObject['error']['shipment_date']);
                // }

                // if(JsonObject['result']['sold_to'] === undefined){
                //     $("#txtSoldTo").removeClass('is-invalid');
                //     $("#txtSoldTo").attr('title', '');
                // }
                // else{
                //     $("#txtSoldTo").addClass('is-invalid');
                //     $("#txtSoldTo").attr('title', JsonObject['result']['sold_to']);
                // }

                // if(JsonObject['result']['preShipment_ctrl'] === undefined){
                //     $("#txtPreShipmentCtrl").removeClass('is-invalid');
                //     $("#txtPreShipmentCtrl").attr('title', '');
                // }
                // else{
                //     $("#txtPreShipmentCtrl").addClass('is-invalid');
                //     $("#txtPreShipmentCtrl").attr('title', JsonObject['result']['preShipment_ctrl']);
                // }

                // if(JsonObject['result']['cut_off_date'] === undefined){
                //     $("#txtCutOffDate").removeClass('is-invalid');
                //     $("#txtCutOffDate").attr('title', '');
                // }
                // else{
                //     $("#txtCutOffDate").addClass('is-invalid');
                //     $("#txtCutOffDate").attr('title', JsonObject['result']['cut_off_date']);
                // }
            }

        },
        error: function(data, xhr, status){
            toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
            $("#btnSubmitShipmentDataDefIcon").removeClass('fa fa-spinner fa-pulse');
            $("#btnSubmitShipmentData").removeAttr('disabled');
            $("#btnSubmitShipmentDataDefIcon").addClass('fa fa-upload');
        }
    });
}

let dtShipmentTable;
let dtShipmentDetailsTable;
let ordersData = [];

$(document).ready(function(){
    $(document).on('click', '#btnAddShipmentDetails', function(e){

        $("#txtOrderNo").on("input", function (){
            console.log('nandito');

            var selectedOrderNo = $(this).val();
            var selectedOrder = ordersData.find(order => order.OrderNo == selectedOrderNo);

            if (selectedOrder) {
                $("#txtCategory").val(selectedOrder.Category);
                $("#txtProductPoNo").val(selectedOrder.ProductPONo);
                $("#txtItemCode").val(selectedOrder.ItemCode);
                $("#txtItemName").val(selectedOrder.ItemName);
                $("#txtShipoutQty").val(selectedOrder.OrderQty);
                $("#txtUnitPrice").val(selectedOrder.Price);
                $("#txtAmount").val(selectedOrder.Amount);
            } else {
                // Clear fields if no match found
                $("#txtCategory, #txtProductPoNo, #txtItemCode, #txtItemName, #txtShipoutQty, #txtUnitPrice, #txtAmount").val("");
            }
        });

        // Handle form submission (add row to DataTable)
        $("#formAddShipmentDetails").submit(function (event) {
            event.preventDefault();

            let orderNo = $("#txtOrderNo").val();
            let category = $("#txtCategory").val();
            let productPoNo = $("#txtProductPoNo").val();
            let itemCode = $("#txtItemCode").val();
            let itemName = $("#txtItemName").val();
            let shipoutQty = $("#txtShipoutQty").val();
            let unitPrice = $("#txtUnitPrice").val();
            let amount = $("#txtAmount").val();
            let remarks = $("#txtRemarks").val();

                // Add row to DataTable
            dtShipmentDetailsTable.row.add([
                '<button class="btn btn-danger btn-sm btnDeleteRow"><i class="fa fa-trash"></i></button>',
                category,
                productPoNo,
                itemCode,
                itemName,
                orderNo,
                shipoutQty,
                unitPrice,
                amount,
                productPoNo,
                remarks
            ]).draw(false);

            // Calculate Grand Total
            calculateGrandTotal();

            // Close modal and reset form
            $("#modalAddShipmentDetails").modal("hide");
            $("#formAddShipmentDetails")[0].reset();
        });
    });

    dtShipmentTable = $("#tblShipment").DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: "view_shipment_data",
        },
        fixedHeader: true,
        "columns": [
            { data: "action", orderable:false, searchable:false },
            { data: "ctrl_no" },
            { data: "ps_ctrl_no" },
            { data: "shipment_date" },
            { data: "rev_no" },
            { data: "sold_to" },
            { data: "shipped_by" }
        ],
        "columnDefs": [
            {
                "targets": 4, // Targets the "rev_no" column (index 4)
                "className": "text-center" // Adds a CSS class for centering
            }
        ]
    }); //end of dataTableShipmentTable

    // dtShipmentDetailsTable = $("#tblShipmentDetails").DataTable({
    //     responsive: true,
    //     autoWidth: false,
    //     columnDefs: [
    //         { targets: 0, className: "text-center" } // Center align first column
    //     ]
    // });

    dtShipmentDetailsTable = $("#tblShipmentDetails").DataTable({
        responsive: true,
        autoWidth: false,
        columnDefs: [
            { targets: 0, className: "text-center" } // Center align first column
        ],
        columns: [
            { data: null, defaultContent: '<button class="btn btn-danger btn-sm btnDeleteRow"><i class="fa fa-trash"></i></button>' },
            { data: "category", visible: false },
            { data: "product_po_no", visible: false },
            { data: "item_code" },
            { data: "item_name" },
            { data: "order_no" },
            { data: "shipout_qty" },
            { data: "unit_price" },
            { data: "amount" },
            { data: "lot_no" },
            { data: "remarks" }
        ]
    });

    $('#loadPOReceivedDetails').on('click', function(){
        let psCtrlNumber = $('#txtPsCtrlNumber').val();
        $('#txtPreShipmentCtrl').val(psCtrlNumber);
        $.ajax({
            type: "GET",
            url: "load_preshipment_details",
            data: { 'ps_ctrl_number': psCtrlNumber },
            dataType: "json",
            success: function (response) {
                console.log('response', response);
                $('#txtPreShipmentId').val(response['pre_shipment_details'][0]['preshipment_id']);
                dtShipmentDetailsTable.clear().draw(); // Clear existing rows
                if (response['result'] == 1) {
                    let poReceivedDetails = response['pre_shipment_details']; // ✅ Correct key
                    dtShipmentDetailsTable.rows.add(poReceivedDetails).draw();
                }
                calculateGrandTotal();
            }
        });
    });

    $('#modalAddShipmentData').on('shown.bs.modal', function () {
        // Fetch PO Received Details for datalist
        $.ajax({
            url: "get_po_received_details", // Replace with your API URL
            method: "GET",
            dataType: "json",
            success: function (data) {
                ordersData = data.po_details;
                var dataList = $("#order_no");
                dataList.empty(); // Clear existing options
                $.each(ordersData, function (index, order) {
                    dataList.append(`<option value="${order.OrderNo}">`);
                });
            },
            error: function () {
                console.error("Error fetching data.");
            }
        });
    });

    // Delete row from table0
    $(document).on("click", ".btnDeleteRow", function () {
        // $(this).closest("tr").remove();
        dtShipmentDetailsTable.row($(this).closest("tr")).remove().draw();
        calculateGrandTotal();
    });

    // Function to calculate Grand Total
    function calculateGrandTotal() {
        let total = 0;
        $("#tblShipmentDetails tbody tr").each(function () {
            let amount = parseFloat($(this).find("td:eq(6)").text()) || 0;
            total += amount;
        });
        $("#txtGrandTotal").val(total.toFixed(2));
    }

    // Submit Shipment Data
    $("#formAddShipmentData").submit(function (e){
        e.preventDefault();

        var filteredData = dtShipmentDetailsTable.rows({ filter: 'applied' }).data().toArray();
        // console.log('datatype',typeof(filteredData));
        filteredData = JSON.stringify(filteredData);

        $.ajax({
            url: "add_shipment_data",
            type: "POST",
            data: $(this).serialize() + '&shipment_details=' + encodeURIComponent(filteredData),
            success: function (response) {
                if(response['validation'] == 'hasError'){
                    toastr.error('Saving failed!, Please complete all required fields');
                    if (response['error']['preShipment_ctrl'] === undefined) {
                        $("#txtPreShipmentCtrl").removeClass('is-invalid');
                        $("#txtPreShipmentCtrl").attr('title', '');
                    } else {
                        $("#txtPreShipmentCtrl").addClass('is-invalid');
                        $("#txtPreShipmentCtrl").attr('title', response['error']['preShipment_ctrl']);
                    }

                    if (response['error']['shipment_date'] === undefined) {
                        $("#txtShipmentDate").removeClass('is-invalid');
                        $("#txtShipmentDate").attr('title', '');
                    } else {
                        $("#txtShipmentDate").addClass('is-invalid');
                        $("#txtShipmentDate").attr('title', response['error']['shipment_date']);
                    }

                    if (response['error']['rev_no'] === undefined) {
                        $("#txtRevNo").removeClass('is-invalid');
                        $("#txtRevNo").attr('title', '');
                    } else {
                        $("#txtRevNo").addClass('is-invalid');
                        $("#txtRevNo").attr('title', response['error']['rev_no']);
                    }

                    if (response['error']['sold_to'] === undefined) {
                        $("#txtSoldTo").removeClass('is-invalid');
                        $("#txtSoldTo").attr('title', '');
                    } else {
                        $("#txtSoldTo").addClass('is-invalid');
                        $("#txtSoldTo").attr('title', response['error']['sold_to']);
                    }

                    if (response['error']['shipped_by'] === undefined) {
                        $("#txtShippedBy").removeClass('is-invalid');
                        $("#txtShippedBy").attr('title', '');
                    }else{
                        $("#txtShippedBy").addClass('is-invalid');
                        $("#txtShippedBy").attr('title', response['error']['shipped_by']);
                    }

                    if (response['error']['cut_off_date'] === undefined) {
                        $("#txtCutOffDate").removeClass('is-invalid');
                        $("#txtCutOffDate").attr('title', '');
                    }else{
                        $("#txtCutOffDate").addClass('is-invalid');
                        $("#txtCutOffDate").attr('title', response['error']['cut_off_date']);
                    }
                }else if(response['result'] == 1){
                    toastr.success('Data succesfully saved!');
                    dtShipmentTable.draw(); // Clear DataTable
                    dtShipmentDetailsTable.draw(); // Clear DataTable
                    $("#modalAddShipmentData").modal("hide");
                    $("#formAddShipmentData")[0].reset(); // Reset form
                }else if(response['result'] == 2){
                    toastr.success('Data Successfully updated!');
                    dtShipmentTable.draw(); // Clear DataTable
                    dtShipmentDetailsTable.draw(); // Clear DataTable
                    $("#modalAddShipmentData").modal("hide");
                    $("#formAddShipmentData")[0].reset(); // Reset form
                }else{
                    toastr.error('Saving Request Failed!');
                }
            },
            error: function (error) {
                toastr.error(' Saving Request Failed!');
                console.error("Error saving data:", error);
            }
        });
    });

    $('#modalAddShipmentData').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
        $('#tblShipmentDetails').DataTable().clear().draw();
    })

    $('#modalAddShipmentDetails').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
    })

    $(document).on('click', '.btnEditShipmentData', function(e){
        let shipmentId = $(this).data('id');
        $('#txtShipmentId').val(shipmentId);
        $('#modalAddShipmentData').modal('show');

        $.ajax({
            type: "get",
            url: "get_shipment_data",
            data: {'shipment_id': shipmentId},
            dataType: "json",
            success: function (response) {
                if(response['shipmentData'].length > 0){
                    // console.log('success');
                    let shipmentData = response['shipmentData'];
                    let shipmentDetails = response['shipmentData'][0]['shipment_details'];

                    $('#txtCtrlNumber').val(shipmentData[0]['ctrl_no']);
                    $('#txtRevNo').val(shipmentData[0]['rev_no']);
                    $('#txtShipmentDate').val(shipmentData[0]['shipment_date']);
                    $('#txtShippedBy').val(shipmentData[0]['shipped_by']);
                    $('#txtSoldTo').val(shipmentData[0]['sold_to']);
                    $('#txtPreShipmentCtrl').val(shipmentData[0]['ps_ctrl_no']);
                    $('#txtCutOffDate').val(shipmentData[0]['cutoff_month']);
                    $('#txtGrandTotal').val(shipmentData[0]['grand_total']);

                    $('#txtRevNo').removeAttr('readonly');

                    dtShipmentDetailsTable.clear().draw(); // Clear existing rows

                    let testArray = Object.values(shipmentDetails);
                    dtShipmentDetailsTable.rows.add(testArray).draw();
                }
            }
        });
    });
});
