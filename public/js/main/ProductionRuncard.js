function GetDeviceName(cboElement){
    // console.log('prod_get_device_name');
    let result = '<option value="" disabled selected> Select Device Name </option>';
    $.ajax({
        type: "get",
        url: "get_data_from_matrix",
        dataType: "json",
        beforeSend: function(){
            result = '<option value="0" disabled selected>--Loading--</option>';
        },
        success: function (response) {
            let device_details = response['device_details'];
            if(device_details.length > 0) {
                    result = '<option value="" disabled selected> Select Device Name </option>';
                for (let index = 0; index < device_details.length; index++) {
                    result += '<option value="' + device_details[index]['name'] + '">' + device_details[index]['name'] + '</option>';
                }
            }else{
                result = '<option value="0" selected disabled> -- No record found -- </option>';
            }
            cboElement.html(result);
        },
        error: function(data, xhr, status) {
            result = '<option value="0" selected disabled> -- Reload Again -- </option>';
            cboElement.html(result);
            console.log('Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
        }
    });
}

$(document).ready(function(){

    $('.select2bs5').select2({
        theme: 'bootstrap-5',
    });

    // Apply Select2 to all select elements inside any modal dynamically
    $('.modal').on('shown.bs.modal', function () {
        $(this).find('.select2bs5').each(function() {
            $(this).select2({
                theme: 'bootstrap-5',
                dropdownParent: $(this).closest('.modal') // Ensures correct parent modal
            });
        });
    });

    // GetDeviceName($('#txtSelectDeviceName'));

    $('#txtSelectDeviceName').on('change', function(e){
        // console.log('prod_change_device_name');

        let deviceName = $('#txtSelectDeviceName').val();
        $.ajax({
            type: "get",
            url: "get_data_from_matrix",
            data: {
                "device_name" : deviceName
            },
            dataType: "json",
            beforeSend: function(){
            },
            success: function (response) {
                let device_details = response['device_details'];
                let material_details = response['material_details'];
                // let material_codes = response['material_codes'];
                let material_class = response['material_class'];

                if(device_details == 0 && material_details == 0){
                    toastr.error('No Process Found!, Please Insert Process');
                    $('#btnAddProductionRuncard').prop('disabled', true);
                }else{
                    $('#btnAddProductionRuncard').prop('disabled', false);

                    $('#txtSearchDeviceCode').val(device_details[0].code);
                    $('#txtSearchMaterialName').val(material_details);
                    $('#txtSearchReqOutput').val(device_details[0].qty_per_box);

                    $('#ResinMatLotNumber').prop('hidden', true); //LAPEROS
                    $('#ContactLotNumber').prop('hidden', true); //CONTACT
                    $('#MELotNumber').prop('hidden', true); //ME

                    $('#formProductionRuncard #txtMatName').prop('required', false);
                    $('#formProductionRuncard #txtContactMatName').prop('required', false);
                    $('#formProductionRuncard #txtMEMaterialName').prop('required', false);

                    if(material_details.indexOf('LAPEROS') != -1){//RESIN
                        $('#ResinMatLotNumber').prop('hidden', false);
                        $('#formProductionRuncard #txtMatName').prop('required', true);
                    }else if(material_class.indexOf(1) != -1){//RESIN
                        // console.log('test');
                        $('#ResinMatLotNumber').prop('hidden', false);
                        $('#formProductionRuncard #txtMatName').prop('required', true);
                    }

                    if(material_details.indexOf('CT') != -1){// CONTACT
                        $('#ContactLotNumber').prop('hidden', false);
                        $('#formProductionRuncard #txtContactMatName').prop('required', true);
                    }

                    if(material_details.indexOf('ME') != -1){// #ME
                        $('#MELotNumber').prop('hidden', false);
                        $('#formProductionRuncard #txtMEMaterialName').prop('required', true);
                    }

                    //STATIONS
                    let result = '<option value="" disabled selected>-- Select Station --</option>';
                    if (device_details[0].material_process.length > 0) {
                            result = '<option value="" disabled selected>-- Select Station --</option>';
                        for (let index = 0; index < device_details[0].material_process.length; index++) {
                            result += '<option value="' + device_details[0].material_process[index].station_details[0].stations['id'] + '">' + device_details[0].material_process[index].station_details[0].stations['station_name'] + '</option>';
                        }
                    } else {
                        result = '<option value="0" selected disabled> -- No record found -- </option>';
                    }
                    $('#txtSelectRuncardStation').html(result);
                    dtProdRuncard.draw();
                }
            }
        });
    });

    dtProdRuncard = $("#tblProductionRuncard").DataTable({
        "processing" : true,
        "serverSide" : true,
        "lengthMenu": [ [25, -1], [25, "All"] ],
        "ajax" : {
            url: "view_production_runcard",
            data: function (param){
                param.device_name = $("#txtSelectDeviceName").val();
            }
        },
        fixedHeader: true,
        "columns":[
            { "data" : "id", searchable:false,visible:false },
            { "data" : "action", orderable:false, searchable:false },
            { "data" : "status" },
            { "data" : "part_name" },
            { "data" : "po_number" },
            { "data" : "po_quantity" },
            { "data" : "production_lot" },
            { "data" : "machine_no" },
            { "data" : "operator_names" },
            { "data" : "created_at" },
        ],
        "columnDefs": [
            {"className": "dt-center", "targets": "_all"},
            {
                "targets": [2],
                "data": null,
                "defaultContent": "---"
            },
        ],
        "order": [0, 'desc']
    });

    dtProdRuncardStation = $("#tblProdRuncardStation").DataTable({
        "processing" : true,
        "serverSide" : true,
        "ajax" : {
            url: "view_prod_runcard_station",
            data: function (param){
                param.prod_runcard_id = $('#formProductionRuncard #txtProdRuncardId').val();
            },
        },
        fixedHeader: true,
        "columns":[
            { "data" : "action", orderable:false, searchable:false },
            { "data" : "station_name" },
            // { "data" : "station" },
            { "data" : "sub_station" },
            { "data" : "date" },
            { "data" : "operator" },
            { "data" : "input_quantity" },
            { "data" : "ng_quantity" },
            { "data" : "output_quantity" },
            { "data" : "remarks" },
        ],
        "columnDefs": [
            {"className": "dt-center", "targets": "_all"},
            {
                "targets": [2],
                "data": null,
                "defaultContent": "---"
            },
        ],
    });

    $('#btnAddProductionRuncard').on('click', function(e){
        if($('#txtSelectDeviceName').val() != "" && $('#txtSearchMaterialName').val() != ""){
            $.ajax({
                type: "get",
                url: "get_dmrpqc_by_name",
                data: {
                    device_name: $('#txtSelectDeviceName').val(),
                },
                dataType: "json",
                success: function (response) {
                    let data = response['dmrpqc_device_info'];
                    if(data){
                        $('#modalProdRuncard').modal('show');
                        $('#txtPartName').val($('#txtSelectDeviceName').val());
                        $('#txtPartCode').val($('#txtSearchDeviceCode').val());
                        $('#txtRequiredOutput').val($('#txtSearchReqOutput').val());

                        if($('#txtProdRuncardId').val() == ''){
                            $('#btnAddRuncardStation').prop('disabled', true);
                        }else{
                            $('#btnAddRuncardStation').prop('disabled', false);
                        }

                        $('#btnSaveRuncardDetails').prop('hidden', false);
                        $('#btnRuncardDetails').prop('hidden', false);
                        $('#txtPONumber').prop('disabled', false);
                        $('#btnSubmitAssemblyRuncardData').prop('hidden', true);
                        GetPOFromPPSDB($('#txtPONumber'), $('#txtSelectDeviceName').val());
                        GetMachineNo($('.SelMachineNo'), $('#txtSelectDeviceName').val());
                    }else{
                        toastr.error('Device has no DMR & PQC data, Please process to DMR & PQC first');
                    }
                }
            });
        }else{
            toastr.error('Please Select Device Name')
        }
    });

    function GetPOFromPPSDB(cboElement, device_name, PoNumber = null){
        let result = '<option value="" disabled selected> Select PO Number </option>';
        $.ajax({
            method: "get",
            url: "get_po_from_ppsdb",
            data: {
                'device_name': device_name,
                'po_number': PoNumber,
            },
            dataType: "json",
            beforeSend: function(){
                result = '<option value="0" disabled selected>--Loading--</option>';
            },
            success: function (response) {
                let po_details = response['po_details'];
                if(po_details.length > 0) {
                        result = '<option value="" disabled selected> Select PO Number </option>';
                    for (let index = 0; index < po_details.length; index++) {
                        if(po_details[index]['po_number'] == PoNumber || po_details[index]['po_quantity'] > 0){
                            result += '<option value="' + po_details[index]['po_number'] + '">' + po_details[index]['po_number'] + '</option>';
                        }
                    }
                }else{
                    result = '<option value="0" selected disabled> -- No record found -- </option>';
                }
                cboElement.html(result);
                if(PoNumber != null){
                    cboElement.val(PoNumber).trigger('change');
                    // GetPPSDBDataByPO(PoNumber, device_name, 1);
                }
            },
            error: function(data, xhr, status) {
                result = '<option value="0" selected disabled> -- Reload Again -- </option>';
                cboElement.html(result);
                console.log('Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
            }
        });
    }

    function GetMachineNo(cboElement, device_name, MachineNo = null){
        let result = '<option value="" disabled selected> Select PO Number </option>';
        $.ajax({
            method: "get",
            url: "get_machine_no_from_matrix",
            data: {
                'device_name': device_name,
            },
            dataType: "json",
            beforeSend: function(){
                result = '<option value="0" disabled selected>--Loading--</option>';
            },
            success: function (response) {
                let machine_data = response['machine_data'];
                if(machine_data.length > 0) {
                        result = '<option value="" disabled selected> Select Machine Number </option>';
                    for (let index = 0; index < machine_data.length; index++) {
                        result += '<option value="' + machine_data[index]['machine_name'] + '">' + machine_data[index]['machine_name'] + '</option>';
                    }
                }else if(MachineNo != null){
                    result = '<option value="" disabled selected> Select Machine Number </option>';
                    result += '<option value="' + MachineNo + '">' + MachineNo + '</option>';
                }else{
                    result = '<option value="0" selected disabled> -- No record found -- </option>';
                }
                cboElement.html(result);
                if(MachineNo != null){
                    cboElement.val(MachineNo).trigger('change');
                    // GetPPSDBDataByPO(PoNumber, device_name, 1);
                }
            },
            error: function(data, xhr, status) {
                result = '<option value="0" selected disabled> -- Reload Again -- </option>';
                cboElement.html(result);
                console.log('Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
            }
        });
    }

    // $(document).on('click', '#btnSubmitAssemblyRuncardData',function(e){
    $('#btnSubmitAssemblyRuncardData').on('click', function(e){
        // let _token = '{{ csrf_token() }}';
        // console.log();
        let token = $('#formProductionRuncard input[name="_token"]').val();
        // let token = $('#formAddQualiDetails input[name="_token"]').val('{{ csrf_token() }}');
        let runcard_id = $('#txtProdRuncardId').val();
        CheckExistingStations(runcard_id);
        $.ajax({
            type: "post",
            url: "update_prod_runcard_status",
            data: {
                '_token': token,
                'runcard_id': runcard_id
            },
            dataType: "json",
            success: function (response) {
                if (response['result'] == 1 ) {
                    toastr.success('Successful!');
                    $("#modalProdRuncard").modal('hide');
                    dtProdRuncard.draw();
                }else{
                    toastr.error('Error!, Please Contanct ISS Local 208');
                }
            }
        });
    });

    $(document).on('click', '#btnSubmitRuncardData', function(e){
        // let ipqc_id = $(this).attr('ipqc_data-id');
        let runcard_id = $(this).attr('prod_runcard-id');
        let runcard_status = $(this).attr('prod_runcard-status');
        $("#cnfrmtxtId").val(runcard_id);
        $("#cnfrmtxtStatus").val(runcard_status);
        // $.ajax({
        //     type: "get",
        //     url: "get_assembly_data",
        //     data: {
        //         runcard_id: assy_runcard_id,
        //     },
        //     dataType: "json",
        //     success: function (response) {
        //         let ipqc_data = response['ipqc_data'][0];
        //         $("#cnfrmtxtId").val(ipqc_data.id);
        //         // $("#cnfrmtxtIPQCProdLot").val(ipqc_data.production_lot);
        //         $("#cnfrmtxtStatus").val(ipqc_data.status);
        //         // $("#cnfrmtxtIPQCProcessCat").val(ipqc_data.process_category);
        //     }
        // });
        $("#modalConfirmSubmit").modal('show');
    });

    $("#FrmConfirmSubmit").submit(function(event) {
        event.preventDefault();
        $.ajax({
            url: "submit_prod_runcard",
            method: "post",
            data: $('#FrmConfirmSubmit').serialize(),
            dataType: "json",
            success: function (response) {
                let result = response['result'];
                if (result == 'Successful') {
                    toastr.success('Successful!');
                    dtProdRuncard.draw();
                    $("#modalConfirmSubmit").modal('hide');
                }else{
                    toastr.error('Error!, Please Contanct ISS Local 208');
                }
            }
        });
    });

    $(document).on('click', '.btnViewProdRuncardData',function(e){
        e.preventDefault();
        let production_runcard_id = $(this).attr('prod_runcard-id');
        $.ajax({
            url: "get_prod_runcard_data",
            type: "get",
            data: {
                prod_runcard_id: production_runcard_id
            },
            dataType: "json",
            success: function(response){
                const prod_runcard_data = response['runcard_data'];

                CheckExistingStations(production_runcard_id, 'viewing');
                CheckExistingSubStations(production_runcard_id);
                $('#btnAddRuncardStation').attr('runcard_id', prod_runcard_data[0].id);

                $('#modalProdRuncard').modal('show');
                $('#formProductionRuncard #txtProdRuncardId').val(prod_runcard_data[0].id);
                $('#formProductionRuncard #txtPartName').val(prod_runcard_data[0].part_name);
                $('#formProductionRuncard #txtPartCode').val(prod_runcard_data[0].part_code);
                // $('#formProductionRuncard #txtPONumber').val(prod_runcard_data[0].po_number);
                // $('#formProductionRuncard #txtPONumber').val(prod_runcard_data[0].po_number).trigger('change');
                GetPOFromPPSDB($('#txtPONumber'), $('#txtSelectDeviceName').val(), prod_runcard_data[0].po_number);
                GetMachineNo($('.SelMachineNo'), $('#txtSelectDeviceName').val(), prod_runcard_data[0].machine_no);

                $('#formProductionRuncard #txtPOQty').val(prod_runcard_data[0].po_quantity);
                // $('#formProductionRuncard #txtRequiredOutput').val(prod_runcard_data[0].required_qty);
                $('#formProductionRuncard #txtRequiredOutput').val($('#txtSearchReqOutput').val());
                $('#formProductionRuncard #txtProductionLot').val(prod_runcard_data[0].production_lot);
                $('#formProductionRuncard #txtDrawingNo').val(prod_runcard_data[0].drawing_no);
                $('#formProductionRuncard #txtDrawingRev').val(prod_runcard_data[0].drawing_rev);
                $('#formProductionRuncard #txtMatName').val(prod_runcard_data[0].material_name);
                $('#formProductionRuncard #txtMaterialLot').val(prod_runcard_data[0].material_lot);
                $('#formProductionRuncard #txtMaterialMatQty').val(prod_runcard_data[0].material_qty);
                $('#formProductionRuncard #txtContactMatName').val(prod_runcard_data[0].contact_name);
                $('#formProductionRuncard #txtContactMatLot').val(prod_runcard_data[0].contact_lot);
                $('#formProductionRuncard #txtContactMatQty').val(prod_runcard_data[0].contact_qty);
                $('#formProductionRuncard #txtMEMaterialName').val(prod_runcard_data[0].me_name);
                $('#formProductionRuncard #txtMEMaterialLot').val(prod_runcard_data[0].me_lot);
                $('#formProductionRuncard #txtMEMatQty').val(prod_runcard_data[0].me_qty);
                $('#formProductionRuncard #txtUdPtnrNo').val(prod_runcard_data[0].ud_ptnr_no);
                $('#formProductionRuncard #txtSarNo').val(prod_runcard_data[0].sar_no);
                $('#formProductionRuncard #txtAerNo').val(prod_runcard_data[0].aer_no);
                dtProdRuncardStation.draw();
            },
            error: function(data, xhr, status){
                toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
            }
        });

        // $('#btnRuncardDetails').prop('hidden', true);
        // $('#txtPONumber').prop('disabled', true);
        // $('#btnScanMaterialLot').prop('disabled', true);
        // $('#btnScanContactLot').prop('disabled', true);
        // $('#btnScanMELot').prop('disabled', true);
        $('#btnSaveRuncardDetails').prop('hidden', true);
        $('#btnAddRuncardStation').prop('hidden', true);
        $('#btnAddRuncardStation').prop('disabled', true);
        $('#btnSubmitAssemblyRuncardData').prop('hidden', true);
    });

    // $('.select2bs5').select2( {
    //     theme: 'bootstrap-5'
    // });

    const delay = (fn, ms) => {
        let timer = 0
        return function(...args) {
            clearTimeout(timer)
            timer = setTimeout(fn.bind(this, ...args), ms || 0)
        }
    }

    // $('#formProductionRuncard #txtPONumber').keyup(delay(function(e){
    // $('#formProductionRuncard #txtPONumber').click(function(e){
        // console.log('change po click true');
    // $("#formProductionRuncard #txtPONumber").focus(function(){
        // console.log('focus true');
        $('#formProductionRuncard #txtPONumber').change(delay(function(e){
                // console.log('change po test true');
            let po_number = $(this).val();
            let device_name = $('#formProductionRuncard').find('#txtPartName').val();
            // let current_value = '0';
            if(po_number != ''){
                GetPPSDBDataByPO(po_number, device_name);
            }
        }, 300));
    // });
    // });

    function GetPPSDBDataByPO(po_number, device_name){
        $.ajax({
            url: "search_po_from_ppsdb",
            method: "get",
            data: {
                'po_number': po_number,
                'device_name': device_name,
                'doc_type': 'B Drawing'
            },
            dataType: "json",
            success: function(response){
                let now = new Date();
                let year = now.getFullYear();
                    year = year.toString();
                    year = year.substr(2);

                let month = (now.getMonth() + 1);
                    month = month.toString();
                if(month.length == 1){
                    month = +'0'+month;
                }

                let date = now.getDate();
                date = date.toString();
                if(date.length == 1){
                    date = +'0'+date;
                }

                let rev_no;
                let prod_lot;
                let maintenance;
                let production_lot_time;
                if(response['result'] != '0'){
                    let po_details = response['po_details'];
                    $("#formProductionRuncard #txtPartName").val(po_details.part_name);
                    $("#formProductionRuncard #txtPartCode").val(po_details.part_code);
                    $("#formProductionRuncard #txtPONumber").val(po_details.po_number);
                    $("#formProductionRuncard #txtPOQty").val(po_details.order_quantity);
                    $("#formProductionRuncard #txtPOBalance").val(response['po_balance']);
                }

                if(response['result'] == '1'){ //RAPID PO RECEIVE & DIESET
                    // console.log('true');
                    let po_details = response['po_details'];
                    $("#formProductionRuncard #txtDrawingNo").val(po_details.drawing_no);
                    $("#formProductionRuncard #txtDrawingRev").val(po_details.drawing_rev);
                    rev_no = po_details.drawing_rev;
                }else if (response['result'] == '2'){ //ACDCS
                    // toastr.error('Error, PO Number doesn`t match with the Device Name');
                    let doc_details = response['acdcs_data'];
                    $("#formProductionRuncard #txtDrawingNo").val(doc_details.doc_no);
                    $("#formProductionRuncard #txtDrawingRev").val(doc_details.rev_no);
                    rev_no = doc_details.rev_no;
                }
                // else if(response['result'] == '1'){
                //     // console.log('true');
                //     let po_details = response['po_details'];
                //     $("#formProductionRuncard #txtDrawingNo").val(po_details.drawing_no);
                //     $("#formProductionRuncard #txtDrawingRev").val(po_details.drawing_rev);
                //     rev_no = po_details.drawing_rev;
                // }

                //old 01/17/2025
                // else if(response['result'] == '0'){
                //     console.log('true');
                //     let po_details = response['po_details'];
                //     $("#formProductionRuncard #txtDrawingNo").val(po_details.drawing_no);
                //     $("#formProductionRuncard #txtDrawingRev").val(po_details.drawing_rev);
                //     rev_no = po_details.drawing_rev;
                // }else{
                //     let doc_details = response['acdcs_data'];

                //     $("#formProductionRuncard #txtDrawingNo").val(doc_details.doc_no);
                //     $("#formProductionRuncard #txtDrawingRev").val(doc_details.rev_no);
                //     rev_no = doc_details.rev_no;
                // }

                if($('#formProductionRuncard #txtNewlyMaintenance').prop('checked') == true){
                    maintenance = '-M';
                }else{
                    maintenance = '';
                }

                if($("#formProductionRuncard #txtProductionLotTime").val() != ''){
                    production_lot_time = '-' + $("#formProductionRuncard #txtProductionLotTime").val();
                }else{
                    production_lot_time = '';
                }

                prod_lot = rev_no + year + month + date + maintenance + production_lot_time;
                $("#formProductionRuncard #txtProductionLot").val(prod_lot);
            }
        });
    }

    // $('#formProductionRuncard #txtNewlyMaintenance').click(function(e){
    //     if($(this).prop('checked')){
    //         let ProductionLot = $('#txtProductionLot').val();
    //         let ProductionLotwithM = `${ProductionLot}-M`;
    //         $('#txtProductionLot').val(ProductionLotwithM)
    //         console.log('clark test');
    //     }
    // });

    $("#modalProdRuncard").on('hidden.bs.modal', function () {
        // Reset form values
        $("#formProductionRuncard")[0].reset();
        $("#formAddProductionRuncardStation")[0].reset();

        // Remove invalid & title validation
        $('div').find('input').removeClass('is-invalid');
        $("div").find('input').attr('title', '');
        dtProdRuncardStation.draw();
    });

    $('#txtProductionLotTime').mask('0000-0000', {reverse: false});
    $('#txtProductionLotTime').keyup(delay(function(e){
            let textProductionLot = $('#txtProductionLot').val();
            let textProductionLotTime = $('#txtProductionLotTime').val();
            $("#formProductionRuncard #txtNewlyMaintenance").prop('disabled', true);

            if(textProductionLotTime.length == 9){ //check if the production lot time is filled-up completely
                if(textProductionLot.length > 12 && $('#formProductionRuncard #txtNewlyMaintenance').prop('checked') == true){ //check if the production lot_no already have time, if true remove the existing time
                    textProductionLot = textProductionLot.slice(0, -12);
                }else if(textProductionLot.length > 10 && $('#formProductionRuncard #txtNewlyMaintenance').prop('checked') == false){
                    textProductionLot = textProductionLot.slice(0, -10);
                }

                if($('#formProductionRuncard #txtNewlyMaintenance').prop('checked')){
                    textProductionLot = `${textProductionLot}-M`;
                }

                let concattedProductionLot = `${textProductionLot}-${textProductionLotTime}`;
                $('#txtProductionLot').val(concattedProductionLot)

            }else if($('#formProductionRuncard #txtProductionLotTime').val() == ''){
                $('#formProductionRuncard #txtNewlyMaintenance').prop('disabled', false);
                newProductionLot = $('#txtProductionLot').val();

                if(textProductionLot.length > 9 && $('#formProductionRuncard #txtNewlyMaintenance').prop('checked') == true){
                    newProductionLot = newProductionLot.slice(0, -12);
                }else if(textProductionLot.length > 8 && $('#formProductionRuncard #txtNewlyMaintenance').prop('checked') == false){
                    newProductionLot = newProductionLot.slice(0, -10);
                }
                $('#txtProductionLot').val(newProductionLot);
            }
    }, 400));

    $('#btnScanMaterialLot, #btnScanContactLot, #btnScanMELot').each(function(e){
        $(this).on('click',function (e) {
            let FormValueMatName = $(this).attr('form-name-value');
            let FormValueMatLotNo = $(this).attr('form-lotnumber-value');
            $('#modalQrScanner').attr({'data-form-mat-name': FormValueMatName, 'data-form-lotnumber': FormValueMatLotNo}).modal('show');
            // $('#modalQrScanner').attr('data-form-lotnumber', FormValueMatLotNo);
            // $('#modalQrScanner').show();
            $('#textQrScanner').val('');
            setTimeout(() => {
                $('#textQrScanner').focus();
            }, 500);
        });
    });

    $('#textQrScanner').keyup(delay(function(e){
        let FormValueMatName = $('#modalQrScanner').attr('data-form-mat-name');
        let FormValueMatLotNo = $('#modalQrScanner').attr('data-form-lotnumber');
        console.log('qrheader',FormValueMatName, FormValueMatLotNo);
        if( e.keyCode == 13 ){

            let Material;
            let Material1;
            let Material2;
            let Material3;

            if(FormValueMatLotNo == 'txtMaterialLot'){
                Material = 'RESIN'
                MaterialClass = 1
            }else if(FormValueMatLotNo == 'txtContactMatLot'){
                Material = 'CT'
                MaterialClass = 2
            }else if(FormValueMatLotNo == 'txtMEMaterialLot'){
                Material = 'ME'
                MaterialClass = 2
            }

            let explodedMat = $('#textQrScanner').val().split(' | ');
            console.log(explodedMat);
            if(explodedMat.length != 4){
                toastr.error('Invalid Sticker');
                $(this).val('');
                $('#modalScanQr').modal('hide');
                return;
            }else{
                validateScannedMaterial(explodedMat[0], $('#txtPartName').val(), Material, MaterialClass, function(result){
                  //  // validateScannedMaterial($('#txtPartName').val(),explodedMat[3], '1st Stamping', function(result){
                //   console.log('result', result);
                    if(result != false){
                        $(`#${FormValueMatName}`).val(result);
                        $(`#${FormValueMatLotNo}`).val(explodedMat[0]);
                        $('#modalQrScanner').modal('hide')
                    }else{
                        toastr.error('Scanned material is not for this Device');
                        $(`#${FormValueMatName}`).val('');
                        $(`#${FormValueMatLotNo}`).val('');
                        $('#textQrScanner').val(''); // Clear after enter
                    }
                });
            }
        }
    }, 100));

    const validateScannedMaterial = (LotNumber, DeviceName, Material, MaterialClass, callback) => {
        $.ajax({
            type: "get",
            url: "validate_material_lot_number",
            data: {
                'mat_lot_number' : LotNumber,
                'device_name' : DeviceName,
                // 'material_name' : MatName,
                // 'material_type_to_match' : Material,
            },
            dataType: "json",
            success: function (response) {
                let material_name_value
                console.log('response',response);
                if(response['matrix_data'] != 'blank'){
                    if(response['matrix_data'].length > 0){
                        let material_name = response['matrix_data'][0].material_type;
                        let material_class = response['material_class'][0].class_id;
                        console.log('test', material_name);
                        // let class_id = response['matrix_data'][0].class_id;
                        // material_name_value = true;
                        if(material_name.includes(`${Material}`)){
                            //  console.log('test1', Material);
                        // if(material_name.includes(`${Material}`) || class_id.includes(`${MaterialClass}`)){
                            material_name_value = material_name;
                        // }else if(material_class.includes(`${MaterialClass}`)){//clark comment 09/24/2024
                        }else if(material_class == MaterialClass){
                            // console.log('test2', material_class);
                            material_name_value = material_name;
                        }else{
                            // console.log('nandito');
                            material_name_value = false;
                        }
                    }else{
                        // console.log('nandito2');
                        material_name_value = false;
                    }
                }else{
                    // console.log('nandito3');
                    material_name_value = false;
                }

                console.log('value',material_name_value);
                callback(material_name_value);
            },
            error: function(data, xhr, status){
                toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
            }
        });
    }

    $('#btnSaveRuncardDetails').click( function(e){
        e.preventDefault();
        // let data = $('#formCNAssemblyRuncard').serialize();
        $.ajax({
            type:"POST",
            url: "add_production_runcard_data",
            data: $('#formProductionRuncard').serialize(),
            dataType: "json",
            success: function(response){
                if(response['validation'] == 'hasError'){
                    toastr.error('Saving failed!, Please complete all required fields');
                    if (response['error']['po_number'] === undefined) {
                        $("#txtPONumber").removeClass('is-invalid');
                        $("#txtPONumber").attr('title', '');
                    } else {
                        $("#txtPONumber").addClass('is-invalid');
                        $("#txtPONumber").attr('title', response['error']['po_number']);
                    }

                    if (response['error']['machine_number'] === undefined) {
                        $("#txtMachineNumber").removeClass('is-invalid');
                        $("#txtMachineNumber").attr('title', '');
                    } else {
                        $("#txtMachineNumber").addClass('is-invalid');
                        $("#txtMachineNumber").attr('title', response['error']['machine_number']);
                    }

                    if (response['error']['production_lot_time'] === undefined) {
                        $("#txtProductionLotTime").removeClass('is-invalid');
                        $("#txtProductionLotTime").attr('title', '');
                    } else {
                        $("#txtProductionLotTime").addClass('is-invalid');
                        $("#txtProductionLotTime").attr('title', response['error']['production_lot_time']);
                    }

                    if (response['error']['material_lot'] === undefined) {
                        $("#txtMaterialLot").removeClass('is-invalid');
                        $("#txtMaterialLot").attr('title', '');
                    } else {
                        $("#txtMaterialLot").addClass('is-invalid');
                        $("#txtMaterialLot").attr('title', response['error']['material_lot']);
                    }

                    if (response['error']['contact_mat_lot'] === undefined) {
                        $("#txtContactMatLot").removeClass('is-invalid');
                        $("#txtContactMatLot").attr('title', '');
                    } else {
                        $("#txtContactMatLot").addClass('is-invalid');
                        $("#txtContactMatLot").attr('title', response['error']['contact_mat_lot']);
                    }

                    if (response['error']['me_mat_lot'] === undefined) {
                        $("#txtMEMaterialLot").removeClass('is-invalid');
                        $("#txtMEMaterialLot").attr('title', '');
                    } else {
                        $("#txtMEMaterialLot").addClass('is-invalid');
                        $("#txtMEMaterialLot").attr('title', response['error']['me_mat_lot']);
                    }
                }else if (response['result'] == 1 ) {
                    toastr.success('Successful!');
                    $("#modalProdRuncard").modal('hide');
                    dtProdRuncard.draw();
                }else{
                    toastr.error('Error!, Please Contanct ISS Local 208');
                }
                // console.log('success');
            }
        });
    });

    $(document).on('click', '.btnUpdateProdRuncardData',function(e){
        e.preventDefault();
        let production_runcard_id = $(this).attr('prod_runcard-id');
        // let prod_runcard_station_id = $(this).attr('prod_runcard_stations-id');
        $.ajax({
            url: "get_prod_runcard_data",
            type: "get",
            data: {
                prod_runcard_id: production_runcard_id
                // station_id: prod_runcard_station_id
            },
            dataType: "json",
            beforeSend: function(){
            },
            success: function(response){
                const prod_runcard_data = response['runcard_data'];

                CheckExistingStations(production_runcard_id, 'updating');
                CheckExistingSubStations(production_runcard_id);
                $('#btnAddRuncardStation').attr('runcard_id', prod_runcard_data[0].id);

                // $('#txtProductionLotTime').prop('disabled', true);
                $('#btnRuncardDetails').prop('hidden', false);
                $('#txtPONumber').prop('disabled', false);
                $('#btnScanMaterialLot').prop('disabled', false);
                $('#btnScanContactLot').prop('disabled', false);
                $('#btnScanMELot').prop('disabled', false);
                $('#btnAddRuncardStation').prop('hidden', false);
                $('#btnAddRuncardStation').prop('disabled', false);
                $('#btnSubmitAssemblyRuncardData').prop('hidden', true);
                $('#btnSaveRuncardDetails').prop('hidden', false);
                $('#btnSaveNewRuncardStation').prop('hidden', false);

                $('#modalProdRuncard').modal('show');
                $('#formProductionRuncard #txtProdRuncardId').val(prod_runcard_data[0].id);
                $('#formProductionRuncard #txtPartName').val(prod_runcard_data[0].part_name);
                $('#formProductionRuncard #txtPartCode').val(prod_runcard_data[0].part_code);
                // $('#formProductionRuncard #txtPONumber').val(prod_runcard_data[0].po_number);
                GetPOFromPPSDB($('#txtPONumber'), $('#txtSelectDeviceName').val(), prod_runcard_data[0].po_number);
                GetMachineNo($('.SelMachineNo'), $('#txtSelectDeviceName').val(), prod_runcard_data[0].machine_no);

                $('#formProductionRuncard #txtPOQty').val(prod_runcard_data[0].po_quantity);
                // $('#formProductionRuncard #txtRequiredOutput').val(prod_runcard_data[0].required_qty);
                $('#formProductionRuncard #txtRequiredOutput').val($('#txtSearchReqOutput').val());

                // console.log('production lot lenght',prod_runcard_data[0].production_lot.length);
                if(prod_runcard_data[0].production_lot.length >= 17){
                    production_lot_time = prod_runcard_data[0].production_lot.substr(-9);
                }else{
                    production_lot_time = prod_runcard_data[0].production_lot.substr(-4);
                }

                $('#formProductionRuncard #txtProductionLotTime').val(production_lot_time);

                $('#formProductionRuncard #txtProductionLot').val(prod_runcard_data[0].production_lot);
                $('#formProductionRuncard #txtDrawingNo').val(prod_runcard_data[0].drawing_no);
                $('#formProductionRuncard #txtDrawingRev').val(prod_runcard_data[0].drawing_rev);
                $('#formProductionRuncard #txtMatName').val(prod_runcard_data[0].material_name);
                $('#formProductionRuncard #txtMaterialLot').val(prod_runcard_data[0].material_lot);
                $('#formProductionRuncard #txtMaterialMatQty').val(prod_runcard_data[0].material_qty);
                $('#formProductionRuncard #txtContactMatName').val(prod_runcard_data[0].contact_name);
                $('#formProductionRuncard #txtContactMatLot').val(prod_runcard_data[0].contact_lot);
                $('#formProductionRuncard #txtContactMatQty').val(prod_runcard_data[0].contact_qty);
                $('#formProductionRuncard #txtMEMaterialName').val(prod_runcard_data[0].me_name);
                $('#formProductionRuncard #txtMEMaterialLot').val(prod_runcard_data[0].me_lot);
                $('#formProductionRuncard #txtMEMatQty').val(prod_runcard_data[0].me_qty);
                $('#formProductionRuncard #txtUdPtnrNo').val(prod_runcard_data[0].ud_ptnr_no);
                $('#formProductionRuncard #txtSarNo').val(prod_runcard_data[0].sar_no);
                $('#formProductionRuncard #txtAerNo').val(prod_runcard_data[0].aer_no);
                dtProdRuncardStation.draw();
            },
            error: function(data, xhr, status){
                toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
            }

        });
    });

    function CheckExistingStations(runcard_id, mode = null){
        $.ajax({
            type: "get",
            url: "chck_existing_stations",
            data: {
                "runcard_id" : runcard_id,
            },
            dataType: "json",
            success: function (response){
                GetStations($('#txtSelectRuncardStation'), response['current_step']);
                $('#txtStep').val(response['current_step']);

                if(response['output_quantity'] != ''){
                    $('#txtInputQuantity').val(response['output_quantity']);
                    $('#txtInputQuantity').prop('readonly', true);
                }else{ //clark 01/07/2025
                    $('#txtInputQuantity').prop('readonly', false);
                    let po_balance = parseInt($('#txtPOBalance').val());
                    let packing_qty = parseInt($('#txtRequiredOutput').val());

                    if(po_balance < packing_qty){
                        toastr.warning('PO Balance is less than Packing Qty, Remaining PO Balance will be used');
                        $('#txtInputQuantity').val($('#txtPOBalance').val());
                    }else{
                        $('#txtInputQuantity').val($('#txtRequiredOutput').val());
                    }
                }

                if(mode == 'updating'){
                    console.log('update');
                    if(response['current_step'] == 0){
                        $('#btnAddRuncardStation').prop('disabled', true);
                        $('#btnSubmitAssemblyRuncardData').prop('hidden', false);
                    }else{
                        $('#btnAddRuncardStation').prop('disabled', false);
                        if(response['current_step'] > 0 && response['existing_ipqc'] == 'false'){ //NO EXISTING IPQC
                            $('#btnAddRuncardStation').addClass('d-none');
                            $('#btnAddQualificationData').removeClass('d-none');
                        }else{// EXITING IPQC
                            $('#btnAddRuncardStation').removeClass('d-none');
                            $('#btnAddQualificationData').addClass('d-none');
                        }
                    }
                }else if(mode == 'viewing'){
                    console.log('viewing');
                    $('#btnSubmitAssemblyRuncardData').prop('hidden', true);
                }
            }
        });
    }

    function CheckExistingSubStations(runcard_id){
        $.ajax({
            type: "get",
            url: "chck_existing_sub_stations",
            data: {
                "runcard_id" : runcard_id,
            },
            dataType: "json",
            success: function (response){
                GetSubStations($('#txtSelectRuncardSubStation'), response['current_step']);
                $('#txtSubStationStep').val(response['current_step']);
            }
        });
    }

    $('#btnAddRuncardStation').on('click', function(e){
        $('#modalAddStation').modal('show');
        let runcard_id = $(this).attr('runcard_id');

        CheckExistingStations(runcard_id);
        CheckExistingSubStations(runcard_id);

        setTimeout(function(){
            if($('#txtSelectRuncardStation option:selected').text() == 'Visual Inspection' && $('#txtSelectRuncardSubStation option:selected').text() == 'Visual Inspection'){
                fetchCavityCount();
            }else{
                $('#CavityCountDiv').addClass('d-none');
            }

            // $('#buttonAddRuncardModeOfDefect').prop('hidden', false);
            $('#formAddProductionRuncardStation #txtFrmStationsRuncardId').val(runcard_id);
            $("#buttonAddRuncardModeOfDefect").prop('disabled', true);

            $("#txtInputQuantity").prop('disabled', false);
            $("#txtOutputQuantity").prop('disabled', false);
            $("#txtNgQuantity").prop('disabled', false);
            $("#txtRemarks").prop('disabled', false);
        }, 300); // adjust delay as needed
    });

    function fetchCavityCount() {
        let tbody = $('#tableCavityCount tbody');
        $.ajax({
            // url: "get_cavity_count",
            url: "get_box_over_bundle",
            type: "get",
            data: {
                "device_name": $('#formProductionRuncard #txtPartName').val(),
            },
            dataType: 'json',
            cache: false,
            beforeSend: function () {
                tbody.empty();
            },
            success: function (response) {
                let box_over_bundle = response.data;
                let qty_per_box     = box_over_bundle.qty_per_box || 1;
                let qty_per_reel    = box_over_bundle.qty_per_reel || 1;
                let stickerCount    = parseInt(qty_per_box / qty_per_reel) || 1;

                let inputQty = parseInt($('#formAddProductionRuncardStation #txtInputQuantity').val()) || 0;
                let inputCavityVal = stickerCount > 0 ? Math.floor(inputQty / stickerCount) : 0;

                if(stickerCount > 1){
                    $('#CavityCountDiv').removeClass('d-none');
                    for (let i = 1; i <= stickerCount; i++) {
                        let cavityLabel = String.fromCharCode(64 + i);
                        tbody.append(`
                            <tr>
                                <td><input type="text" name="cavity[]" class="form-control form-control-sm cls_cavity" value="${cavityLabel}"></td>
                                <td><input type="number" name="input_cav[]" class="form-control form-control-sm cls_input" value="${inputCavityVal}"></td>
                                <td><input type="number" name="output_cav[]" class="form-control form-control-sm cls_output" min="0"></td>
                                <td><input type="number" name="ng_cav[]" class="form-control form-control-sm cls_ng" min="0" readonly></td>
                            </tr>
                        `);
                    }
                }else{
                    $('#CavityCountDiv').addClass('d-none');
                }
            }
        });
    }

    $('#tableCavityCount tbody').on('input', '.cls_cavity', function (){
        $(this).val($(this).val().toUpperCase());
    });

    $('#formAddProductionRuncardStation #txtNoCavity').click(function(e){
        console.log('clicked');

        if($(this).prop('checked')){
            console.log('checked');
            $('#tableCavityCount tbody').find('.cls_cavity').val('N/A');
            $('#tableCavityCount tbody').find('.cls_cavity').prop('readonly', true);
        }else{
            console.log('unchecked');
            $('#tableCavityCount tbody').find('.cls_cavity').val('');
            $('#tableCavityCount tbody').find('.cls_cavity').prop('readonly', false);
        }
    });

    $('#tableCavityCount tbody').on('input', '.cls_input, .cls_output', function (){
        let row = $(this).closest('tr'); // find the row where the change happened

        let inputVal = parseInt(row.find('.cls_input').val()) || 0;
        let outputVal = parseInt(row.find('.cls_output').val()) || 0;
        let stationNgQty = $('#formAddProductionRuncardStation').find('#txtNgQuantity').val();

        // NG = Input - Output (but prevent negatives)
        console.log('ng value', $('#formAddProductionRuncardStation').find('#txtNgQuantity').val());

        // clear any existing timer for this row
        clearTimeout(row.data('ngTimer'));

        // set a new timer (3 seconds)
        let timer = setTimeout(function () {
            let ngVal = inputVal - outputVal;
            console.log('initial ngVal', ngVal);

            let swal_title;

            if(ngVal < 0){
                swal_title = 'NG Quantity cannot be less than Zero!';
            }else if(ngVal > stationNgQty){
                swal_title = 'NG Quantity cannot be greater than Station NG Quantity!';
            }

            if(ngVal < 0 || ngVal > stationNgQty){
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: swal_title,
                    showConfirmButton: false,
                    timer: 500
                });
                row.find('.cls_output').val('');
                ngVal = 0;
            }

            row.find('.cls_ng').val(ngVal);
        }, 1000);

        // store the timer reference on the row
        row.data('ngTimer', timer);
    });

    $('#txtOutputQuantity, #txtInputQuantity').each(function(e){
        $(this).keyup(delay(function(e){
            let input_val = parseFloat($('#txtInputQuantity').val());
            let output_val = parseFloat($('#txtOutputQuantity').val());
            let ng_value;

            if(output_val === "" || isNaN(output_val) || input_val === "" || isNaN(input_val)){
                ng_value = '';
            }else if(output_val != "" || input_val != ""){
                ng_value = input_val - output_val;
                if(ng_value < 0){
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Output Quantity cannot be less than Zero!",
                        showConfirmButton: false,
                        timer: 1500
                    });

                    // $('#txtInputQuantity').val('');
                    $('#txtOutputQuantity').val('');

                    ng_value = 0;
                    return;
                }
            }
            $('#txtNgQuantity').val(ng_value);

            if(parseInt(ng_value) > 0){
                $("#buttonAddRuncardModeOfDefect").prop('disabled', false);
            }
            else{
                $('#tableRuncardStationMOD tbody').empty();
                $('#buttonAddRuncardModeOfDefect').prop('disabled', true);
                $("#labelTotalNumberOfNG").text(parseInt(0));
            }

            if(parseInt(ng_value) === parseInt($('#labelTotalNumberOfNG').text())){
                $('#labelTotalNumberOfNG').css({color: 'green'})
                $('#labelIsTally').css({color: 'green'})
                $('#labelIsTally').addClass('fa-thumbs-up')
                $('#labelIsTally').removeClass('fa-thumbs-down')
                // $("#btnAddRuncardStation").prop('disabled', false);
                $("#buttonAddRuncardModeOfDefect").prop('disabled', true);
                $("#btnSaveNewRuncardStation").prop('disabled', false);
            }else if(parseInt(ng_value) > parseInt($('#labelTotalNumberOfNG').text())){
                console.log('Mode of Defect NG is greater than NG qty');
                $('#labelTotalNumberOfNG').css({color: 'red'})
                $('#labelIsTally').css({color: 'red'})
                $('#labelIsTally').addClass('fa-thumbs-down')
                $('#labelIsTally').removeClass('fa-thumbs-up')

                // $("#btnAddRuncardStation").prop('disabled', true);
                $("#buttonAddRuncardModeOfDefect").prop('disabled', false);
                $("#btnSaveNewRuncardStation").prop('disabled', true);
            }
        }, 500));
    });

    $(document).on('click', '#btnSaveNewRuncardStation',function(e){
        e.preventDefault();
        let SaveMode = 'Normal';
        let stationNgQuantity = $('#formAddProductionRuncardStation').find('#txtNgQuantity').val();
        let totalNgPerCavity = 0;
        if($('#txtSelectRuncardStation option:selected').text() == 'Visual Inspection' && $('#txtSelectRuncardSubStation option:selected').text() == 'Visual Inspection'){
            SaveMode = 'WithCavityQty';
            $('#tableCavityCount tbody').find('.cls_ng').each(function(){
                let val = parseFloat($(this).val()) || 0; // convert to number, or 0 if empty
                totalNgPerCavity += val;
            });
        }

        if(SaveMode === 'Normal' || (SaveMode === 'WithCavityQty' && totalNgPerCavity == 0 ) || (SaveMode === 'WithCavityQty' && totalNgPerCavity == stationNgQuantity)){
            $.ajax({
                type:"POST",
                url: "add_runcard_station_data",
                data: $('#formAddProductionRuncardStation').serialize() + '&' + $('#formAddQualiDetails').serialize(),
                dataType: "json",
                success: function(response){
                    if(response['result'] == 1){
                        toastr.success('Successful!');
                        $('#formProductionRuncard #txtShipmentOutput').val(response['shipment_output']);
                        $("#modalAddStation").modal('hide');
                        dtProdRuncardStation.draw();
                        CheckExistingStations($('#txtFrmStationsRuncardId').val(), 'updating');
                        CheckExistingSubStations($('#txtFrmStationsRuncardId').val(), 'updating');
                    }else{
                        toastr.error('Error!, Please Contanct ISS Local 208');
                    }
                }
            });
        }else{
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Total NG per Cavity umst be equal to Station NG Quantity!",
                showConfirmButton: false,
                timer: 2000
            });
            return;
        }
    });

    $(document).on('click', '.btnUpdateProdRuncardStationData',function(e){
        e.preventDefault();
        // let prod_runcard_id = $('#txtProdRuncardId').val();
        let prod_runcard_id = $(this).attr('prod_runcard-id');
        let prod_runcard_stations_id = $(this).attr('prod_runcard_stations-id');

        GetProdRuncardStationData(prod_runcard_id, prod_runcard_stations_id);

        // NEW CODE CLARK 07292024
        // $('#txtInputQuantity').prop('readonly', false);
        // $('.QualiDetailsDiv').addClass('d-none', true);
        // NEW CODE CLARK 07292024

        // $('#txtInputQuantity').prop('disabled', false);
        $('#txtOutputQuantity').prop('disabled', false);
        $('#txtNgQuantity').prop('disabled', false);
        $('#txtSelectDocNoRDrawing').prop('disabled', false);
        $('#txtSelectDocNoADrawing').prop('disabled', false);
        $('#txtSelectDocNoGDrawing').prop('disabled', false);
        $('#txtRemarks').prop('disabled', false);
        $('#buttonAddRuncardModeOfDefect').prop('hidden', false);
        $('#btnSaveNewRuncardStation').prop('hidden', false);
        $('#modalAddStation').modal('show');
    });

    $(document).on('click', '.btnViewProdRuncardStationData',function(e){
        e.preventDefault();
        // let prod_runcard_id = $('#txtFrmStationsRuncardId').val();
        let prod_runcard_id = $(this).attr('prod_runcard-id');
        let prod_runcard_stations_id = $(this).attr('prod_runcard_stations-id');

        GetProdRuncardStationData(prod_runcard_id, prod_runcard_stations_id);

        $('#txtInputQuantity').prop('disabled', true);
        $('#txtOutputQuantity').prop('disabled', true);
        $('#txtNgQuantity').prop('disabled', true);
        // $('#txtSelectDocNoRDrawing').prop('disabled', true);
        // $('#txtSelectDocNoADrawing').prop('disabled', true);
        // $('#txtSelectDocNoGDrawing').prop('disabled', true);
        $('#txtRemarks').prop('disabled', true);
        $('#buttonAddRuncardModeOfDefect').prop('hidden', true);
        $('#btnSaveNewRuncardStation').prop('hidden', true);
        $('#modalAddStation').modal('show');
    });

    $("#buttonAddRuncardModeOfDefect").click(function(){
        let totalNumberOfMOD = 0;
        // totalNumberOfMOD = 0;
        let ngQty = $('#formAddProductionRuncardStation #txtNgQuantity').val();
        let rowModeOfDefect = `
            <tr>
                <td>
                    <select class="form-control select2 select2bs4 selectMOD" name="mod_id[]">
                        <option value="0">N/A</option>
                    </select>
                </td>
                <td id=textMODQuantity>
                    <input type="number" class="form-control textMODQuantity" name="mod_quantity[]" value="1" min="1">
                </td>
                <td id="buttonRemoveMOD">
                    <center><button class="btn btn-md btn-danger buttonRemoveMOD" title="Remove" type="button"><i class="fa fa-times"></i></button></center>
                </td>
            </tr>
        `;
        $("#tableRuncardStationMOD tbody").append(rowModeOfDefect);

        getModeOfDefect($("#tableRuncardStationMOD tr:last").find('.selectMOD'));
        getValidateTotalNgQty (ngQty,totalNumberOfMOD);
    });

    const getModeOfDefect = (elementId, modeOfDefectId = null) => {
        let result = `<option value="0" selected> N/A </option>`;
        $.ajax({
            url: 'get_mode_of_defect_for_prod',
            method: 'get',
            dataType: 'json',
            beforeSend: function(){
                result = `<option value="0" selected disabled> - Loading - </option>`;
                elementId.html(result);
            },
            success: function(response){
                // result = '';
                result = `<option value="0" selected disabled> Please Select Mode of Defect </option>`;
                if(response['data'].length > 0){
                    for(let index = 0; index < response['data'].length; index++){
                        result += `<option value="${response['data'][index].id}">${response['data'][index].defects}</option>`;
                    }
                }else{
                    result = `<option value="0" selected disabled> - No data found - </option>`;
                }
                elementId.html(result);
                if(modeOfDefectId != null){
                    elementId.val(modeOfDefectId).trigger('change');
                }
            },
            error: function(data, xhr, status){
                result = `<option value="0" selected disabled> - Reload Again - </option>`;
                elementId.html(result);
                console.log('Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
            }
        });
    }

    const getValidateTotalNgQty = function (ngQty,totalNumberOfMOD){
        $('#tableRuncardStationMOD .textMODQuantity').each(function(){
            totalNumberOfMOD += parseInt($(this).val());
            if(totalNumberOfMOD > ngQty){
                $("#tableRuncardStationMOD tbody").empty();
                $("#labelTotalNumberOfNG").text(parseInt(0));
            }
        });

        if(parseInt(ngQty) === totalNumberOfMOD){
            $('#labelTotalNumberOfNG').css({color: 'green'})
            $('#labelIsTally').css({color: 'green'})
            $('#labelIsTally').addClass('fa-thumbs-up')
            $('#labelIsTally').removeClass('fa-thumbs-down')
            $('#labelIsTally').attr('title','')
            // $("#btnAddRuncardStation").prop('disabled', false);
            $("#buttonAddRuncardModeOfDefect").prop('disabled', true);
            $("#btnSaveNewRuncardStation").prop('disabled', false);
        }else if(parseInt(ngQty) < totalNumberOfMOD){
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Defect Quantity cannot be more than the NG Quantity!",
                showConfirmButton: false,
                timer: 1500
            });
            totalNumberOfMOD = 0;
            $('#tableRuncardStationMOD .textMODQuantity').val(0);
            $('#tableRuncardStationMOD tbody').find('tr').remove();
            $("#buttonAddRuncardModeOfDefect").prop('disabled', false);
            $("#btnSaveNewRuncardStation").prop('disabled', true);
        }else if(parseInt(ngQty) > totalNumberOfMOD){
            console.log('Mode of Defect & NG Qty not tally!');
            $('#labelTotalNumberOfNG').css({color: 'red'})
            $('#labelIsTally').css({color: 'red'})
            $('#labelIsTally').addClass('fa-thumbs-down')
            $('#labelIsTally').removeClass('fa-thumbs-up')
            $('#labelIsTally').attr('title','Mode of Defect & NG Qty are not tally!')
            // $("#btnAddRuncardStation").prop('disabled', true);
            $("#buttonAddRuncardModeOfDefect").prop('disabled', false);
            $("#btnSaveNewRuncardStation").prop('disabled', true);
        }
        $("#labelTotalNumberOfNG").text(totalNumberOfMOD);
    }

    $("#tableRuncardStationMOD").on('click', '.buttonRemoveMOD', function(){
        // let row_defect_qty = $(this).attr(); //clarkkkkkk
        // let row_defect_qty = $(this).closest('tr').find('td#textMODQuantity input').val();
        // console.log('sibling', row_defect_qty);
        // $(this).closest ('tr').remove();
        let totalNumberOfMOD = 0;
        let ngQty = $('#txtNgQuantity').val();

        $(this).closest ('tr').remove();
        getValidateTotalNgQty (ngQty,totalNumberOfMOD);
    });

    $(document).on('keyup','.textMODQuantity', function (e){
        let totalNumberOfMOD = 0;
        let ngQty = $('#txtNgQuantity').val();
        let defectQty = $('.textMODQuantity').val();
        // console.log('defectQty', defectQty);

        getValidateTotalNgQty (ngQty,totalNumberOfMOD);
    });

    $("#modalAddStation").on('hidden.bs.modal', function(){
        // Reset form values
        $("#formAddProductionRuncardStation")[0].reset();
        $("#tableRuncardStationMOD tbody").empty();
        $("#labelTotalNumberOfNG").text(parseInt(0));
        // $("#txtSelectRuncardSubStation option").prop('selected', false);

        // CLARK NEW CODE
        $("#formAddQualiDetails")[0].reset();
        $('.QualiDetailsDiv').addClass('d-none', true);
        $('#tableCavityCount tbody').empty();
        // CLARK NEW CODE

        // $('#LubricantCoatingDiv').addClass('d-none', true);
        // $('#VisualInspDocNoDiv').addClass('d-none', true);

        // $("#labelTotalNumberOfNG").val('');
        // Remove invalid & title validation
        $('div').find('input').removeClass('is-invalid');
        $("div").find('input').attr('title', '');
    });

    function GetProdRuncardStationData(prodRuncardId, prodRuncardStationsId){
        let tbody = $('#tableCavityCount tbody');
        let loop_count = 0;

        $.ajax({
            url: "get_prod_runcard_data",
            type: "get",
            data: {
                prod_runcard_id: prodRuncardId,
                prod_runcard_station_id: prodRuncardStationsId
            },
            dataType: "json",
            beforeSend: function(){
            },
            success: function(response){
                const station_data = response['runcard_data'][0];
                const mode_of_defect_data = response['mode_of_defect_data'];
                const cavity_count_data = response['cavity_count_data'];

                $('#formAddProductionRuncardStation #txtStep').val(station_data.station_step);
                $('#formAddProductionRuncardStation #txtSubStationStep').val(station_data.sub_station_step);

                $('#formAddProductionRuncardStation #txtShipmentOutput').val(station_data.shipment_output);

                $('#formAddProductionRuncardStation #txtRemarks').val(station_data.station_remarks);
                // $('#formAddProductionRuncardStation #txtMachineNo').val(station_data.station_plastic_injection_machine_no);
                $('#formAddProductionRuncardStation #txtDate').val(station_data.station_date);
                // $('#formAddProductionRuncardStation #txtOperatorName').val(station_data.station_operator_name);

                $('#formAddProductionRuncardStation #txtAnnealingMachineNo').val(station_data.station_machine_no_annealing);
                $('#formAddProductionRuncardStation #txtSamplingPcs').val(station_data.station_sampling_annealing);

                if(station_data.station_type_annealing == 1){
                    $('#formAddProductionRuncardStation #txt100Annealing').prop('checked', true);
                }else if(station_data.station_type_annealing == 2){
                    $('#formAddProductionRuncardStation #txtSamplingAnnealing').prop('checked', true);
                }else{
                    $('#formAddProductionRuncardStation #txt100Annealing').prop('checked', false);
                    $('#formAddProductionRuncardStation #txtSamplingAnnealing').prop('checked', false);
                }

                if(station_data.station_sampling_result_annealing == 1){
                    $('#formAddProductionRuncardStation #txtOkSample').prop('checked', true);
                }else if(station_data.station_sampling_result_annealing == 2){
                    $('#formAddProductionRuncardStation #txtNgSample').prop('checked', true);
                }else{
                    $('#formAddProductionRuncardStation #txtOkSample').prop('checked', false);
                    $('#formAddProductionRuncardStation #txtNgSample').prop('checked', false);
                }
                $('#formAddProductionRuncardStation #txtOperatorName').val(station_data.first_name+' '+station_data.last_name);
                $('#formAddProductionRuncardStation #txtInputQuantity').val(station_data.station_input_qty);
                $('#formAddProductionRuncardStation #txtOutputQuantity').val(station_data.station_output_qty);
                $('#formAddProductionRuncardStation #txtNgQuantity').val(station_data.station_ng_qty);

                //Stations Forms
                $('#formAddProductionRuncardStation #txtFrmStationsRuncardId').val(station_data.id);
                $('#formAddProductionRuncardStation #txtFrmStationsRuncardStationId').val(station_data.station_id);

                $('#formAddQualiDetails #txtQualiProdJudgement').val(station_data.quali_prod_sample_result);
                $('#formAddQualiDetails #txtQualiProdActualSample').val(station_data.quali_prod_sample_used);
                $('#formAddQualiDetails #txtQualiProdRemarks').val(station_data.quali_prod_sample_remarks);
                $('#formAddQualiDetails #txtQualiQcJudgement').val(station_data.quali_qc_sample_result);
                $('#formAddQualiDetails #txtQualiQcActualSample').val(station_data.quali_qc_sample_used);
                $('#formAddQualiDetails #txtQualiQcRemarks').val(station_data.quali_qc_sample_remarks);
                $('#formAddQualiDetails #txtCtHeightDataQc').val(station_data.quali_qc_height_data);
                $('#formAddQualiDetails #txtCtHeightDataEngr').val(station_data.quali_engr_height_data);
                $('#formAddQualiDetails #txtCtHeightDataRemarks').val(station_data.quali_engr_height_data_remarks);
                // $('#formAddQualiDetails #txtCtHeightDataRemarks').val(station_data.quali_engr_height_data_remarks);
                $('#formAddQualiDetails #txtDefectCheckpointRemarks').val(station_data.quali_defect_remarks);
                // $('#formAddProductionRuncardStation #txtModeOfDefect').val(runcard_station_data.mode_of_defect);

                $.each(station_data.defect_checkpoints ,function(value){
                    $("#txtDefectCheckpoint option[value="+value+"]").prop('selected', true);
                });

                GetStations($('#txtSelectRuncardStation'), station_data.station_step);
                GetSubStations($('#txtSelectRuncardSubStation'), station_data.sub_station_step);

                loop_count = 0;
                let input_val = 0;
                let output_val = 0;
                let ng_val = 0;
                let cavityLabel;

                if(response['cav_data_mode'] == 'edit'){
                    loop_count = cavity_count_data.length
                    category = 'edit';
                }else if(response['cav_data_mode'] == 'new'){
                    loop_count  = parseInt(cavity_count_data.qty_per_box / cavity_count_data.qty_per_reel) || 1;
                    category = 'new';
                }

                let inputQty = parseInt($('#formAddProductionRuncardStation #txtInputQuantity').val()) || 0;
                input_val = loop_count > 0 ? Math.floor(inputQty / loop_count) : 0;

                tbody.empty(); // clear old rows
                if(loop_count > 1){
                    $('#CavityCountDiv').removeClass('d-none');
                    for(var i = 1; i <= loop_count; i++){

                        if(category == 'edit'){
                            cavityLabel = cavity_count_data[i - 1].cavity;
                            input_val = cavity_count_data[i - 1].input_quantity;
                            output_val = cavity_count_data[i - 1].output_quantity;
                            ng_val = cavity_count_data[i - 1].ng_quantity;
                        }else{
                            cavityLabel = String.fromCharCode(64 + i);
                        }
                        // else if(category == 'new'){
                        //     input_val = cavity_count_data.input_quantity;
                        //     output_val = cavity_count_data.output_quantity;
                        //     ng_val = cavity_count_data.ng_quantity;
                        // }


                        let row = `
                            <tr>
                                <td><input type="text" name="cavity[]" class="form-control form-control-sm cls_cavity" value="${cavityLabel}"></td>
                                <td><input type="number" name="input_cav[]" class="form-control form-control-sm cls_input" min="0" value="${input_val}"></td>
                                <td><input type="number" name="output_cav[]" class="form-control form-control-sm cls_output" min="0" value="${output_val}"></td>
                                <td><input type="number" name="ng_cav[]" class="form-control form-control-sm cls_ng" min="0" value="${ng_val}" readonly></td>
                            </tr>
                        `;
                        tbody.append(row);
                    }
                }else{
                    $('#CavityCountDiv').addClass('d-none');
                }

                for(let index = 0; index < mode_of_defect_data.length; index++){
                    let rowModeOfDefect = `
                        <tr>
                            <td>
                                <select class="form-control select2bs5 selectMOD" name="mod_id[]">
                                </select>
                            </td>
                            <td id=textMODQuantity>
                                <input type="number" class="form-control textMODQuantity" name="mod_quantity[]" value="${mode_of_defect_data[index].mod_quantity}" min="1">
                            </td>
                            <td id="buttonRemoveMOD">
                                <center><button class="btn btn-md btn-danger buttonRemoveMOD" title="Remove" type="button"><i class="fa fa-times"></i></button></center>
                            </td>
                        </tr>
                    `;
                    $("#tableRuncardStationMOD tbody").append(rowModeOfDefect);
                    getModeOfDefect($("#tableRuncardStationMOD tr:last").find('.selectMOD'), mode_of_defect_data[index].mode_of_defects);
                }

                getValidateTotalNgQty (station_data.station_ng_qty, 0);
                // $("#labelTotalNumberOfNG").text(parseInt(0));

                if(station_data.station_status == 2 || station_data.station_status == 3){
                    $('#tableRuncardStationMOD .selectMOD').prop('disabled', true);
                    $('#tableRuncardStationMOD .textMODQuantity').prop('disabled', true);
                    $('#tableRuncardStationMOD .buttonRemoveMOD').prop('disabled', true);
                }else{
                    $('#tableRuncardStationMOD .selectMOD').prop('disabled', false);
                    $('#tableRuncardStationMOD .textMODQuantity').prop('disabled', false);
                    $('#tableRuncardStationMOD .buttonRemoveMOD').prop('disabled', false);
                }
            },
            error: function(data, xhr, status){
                toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
            }
        });
    }

    // function GetDeviceName(cboElement){
    //     console.log('prod_get_device_name');
    //     let result = '<option value="" disabled selected> Select Device Name </option>';
    //     $.ajax({
    //         type: "get",
    //         url: "get_data_from_matrix",
    //         dataType: "json",
    //         beforeSend: function(){
    //             result = '<option value="0" disabled selected>--Loading--</option>';
    //         },
    //         success: function (response) {
    //             let device_details = response['device_details'];
    //             if(device_details.length > 0) {
    //                     result = '<option value="" disabled selected> Select Device Name </option>';
    //                 for (let index = 0; index < device_details.length; index++) {
    //                     result += '<option value="' + device_details[index]['name'] + '">' + device_details[index]['name'] + '</option>';
    //                 }
    //             }else{
    //                 result = '<option value="0" selected disabled> -- No record found -- </option>';
    //             }
    //             cboElement.html(result);
    //         },
    //         error: function(data, xhr, status) {
    //             result = '<option value="0" selected disabled> -- Reload Again -- </option>';
    //             cboElement.html(result);
    //             console.log('Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
    //         }
    //     });
    // }

    function GetStations(cboElement, step = null, is_ud_ptnr = null){
        let result = '<option value="" disabled selected>-- Select Station --</option>';
        let deviceName = $('#txtPartName').val();
        $.ajax({
            type: "get",
            url: "get_data_from_matrix",
            data: {
                "device_name" : deviceName
            },
            dataType: "json",
            beforeSend: function(){
                result = '<option value="0" disabled selected>--Loading--</option>';
            },
            success: function (response) {
                let device_details = response['device_details'];
                if(device_details[0].material_process.length > 0) {
                        result = '<option value="" disabled selected>-- Select Station --</option>';
                    for (let index = 0; index < device_details[0].material_process.length; index++) {
                        result += '<option step="'+ device_details[0].material_process[index].step +'" stations_name="'+ device_details[0].material_process[index].station_details[0].stations['station_name'] +'" value="' + device_details[0].material_process[index].station_details[0].stations['id'] + '">' + device_details[0].material_process[index].station_details[0].stations['station_name'] + '</option>';
                    }
                }else{
                    result = '<option value="0" selected disabled> -- No record found -- </option>';
                }
                cboElement.html(result);

                // console.log('test', $("#txtSelectRuncardStation option[step='"+step+"']"));
                $("#txtSelectRuncardStation option[step='"+step+"']").attr('selected', true);
                $("#txtRuncardStation").val($("#txtSelectRuncardStation option[step='"+step+"']").val());

                if($("#txtSelectRuncardStation option[step='"+step+"']").prop('checked')){
                    if($("#txtSelectRuncardStation option[step='"+step+"']")[0].outerText == 'Annealing'){
                        $('#AnnealingAddDiv').removeClass('d-none');
                    }else{
                        $('#AnnealingAddDiv').addClass('d-none');
                    }
                }

                console.log('station', $('#txtSelectRuncardStation option:selected').text());
                console.log('sub station', $('#txtSelectRuncardSubStation option:selected').text());
                let stickerCount = parseInt(device_details[0].qty_per_box / device_details[0].qty_per_reel) || 1;
                if($('#txtSelectRuncardStation option:selected').text() == 'Visual Inspection'
                    && $('#txtSelectRuncardSubStation option:selected').text() == 'Visual Inspection'
                    && stickerCount > 1){

                    $('#CavityCountDiv').removeClass('d-none');
                }else{
                    $('#CavityCountDiv').addClass('d-none');
                }
            },
            error: function(data, xhr, status) {
                result = '<option value="0" selected disabled> -- Reload Again -- </option>';
                cboElement.html(result);
                console.log('Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
            }
        });
    }

    function GetSubStations(cboElement, step = null){
        let sub_station = ['N/A', 'N/A', 'Rework', 'Segregation', 'Airblowing', 'Visual Inspection'];
        let sub_station_step = ['1', '2', '3', '4', '5', '6'];

        let result = '<option value="" disabled selected>-- Select Sub Station --</option>';
            for (let index = 0; index < sub_station.length; index++){
                result += '<option value="'+sub_station[index]+'" step="'+ sub_station_step[index] +'">' + sub_station[index] + '</option>';
            }
        cboElement.html(result);

        $("#txtSelectRuncardSubStation option[step='"+step+"']").attr('selected', true);
        $("#txtRuncardSubStation").val($("#txtSelectRuncardSubStation option[step='"+step+"']").val());
    }

    $(document).on('click', '#btnPrintProdRuncard', function(e){
        e.preventDefault();
        let prod_runcard_id = $(this).attr('prod_runcard-id');
        // $('#hiddenPreview').append(dataToAppend)
        $.ajax({
            type: "get",
            url: "get_prod_runcard_qr_code",
            data: {
                runcard_id: prod_runcard_id
            },
            dataType: "json",
            success: function (response){
                $("#img_barcode_PO").attr('src', response['qr_code']);
                $("#img_barcode_PO_text").html(response['label']);
                img_barcode_PO_text_hidden = response['label_hidden'];
                $('#modalAssemblyPrintQr').modal('show');
            }, error: function(data, xhr, status) {
                console.error();
            }
        });
    });

    $(document).on('click', '#btnTestPrint', function(e){
        e.preventDefault();
        $('#modalNotification').modal('show');
    });

    $('#btnPrintQrCode').on('click', function(){
        popup = window.open();
        let content = '';
        content += '<html>';
        content += '<head>';
        content += '<title></title>';
        content += '<style type="text/css">';
        content += '@media print { .pagebreak { page-break-before: always; } }';
        content += '</style>';
        content += '</head>';
        content += '<body>';
        // Loop through all QR codes
        for (let i = 0; i < img_barcode_PO_text_hidden.length; i++) {
            content += '<table style="margin-left: -5px; margin-top: 18px;">';
                content += '<tr style="width: 290px;">';
                    content += '<td style="vertical-align: bottom;">';
                        content += '<img src="' + img_barcode_PO_text_hidden[i]['img'] + '" style="min-width: 90px; max-width: 90px;">';
                    content += '</td>';
                    content += '<td style="font-size: 10px; font-family: Calibri;">' + img_barcode_PO_text_hidden[i]['text'] + '</td>';
                content += '</tr>';
            content += '</table>';
            content += '<br>';

            // add page break between stickers, except after the last one
            if(i < img_barcode_PO_text_hidden.length-1 ){
                content += '<div class="pagebreak"> </div>';
            }
        }
        content += '</body>';
        content += '</html>';
        popup.document.write(content);

        popup.focus(); //required for IE
        popup.print();

        /*
            * this event will trigger after closing the tab of printing
        */
        // popup.addEventListener("beforeunload", function (e) {
        //     changePrintCount(img_barcode_PO_text_hidden[0]['id']);
        // });

        popup.close();

    });
});
