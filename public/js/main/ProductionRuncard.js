$(document).ready(function(){

    $('.select2bs5').select2({
        theme: 'bootstrap-5'
    });

    GetDeviceName($('#txtSelectDeviceName'));

    $('#txtSelectDeviceName').on('change', function(e){
        let deviceName = $('#txtSelectDeviceName').val();
        $.ajax({
            type: "get",
            url: "get_data_from_matrix",
            data: {
                "device_name" : deviceName
            },
            dataType: "json",
            beforeSend: function(){
                // prodData = {};
            },
            success: function (response) {
                let device_details = response['device_details'];
                let material_details = response['material_details'];
                let material_codes = response['material_codes'];
                let material_class = response['material_class'];
                console.log(material_codes);
                // let station_details = response['station_details'];
                // console.log(station_details);

                $('#txtSearchDeviceCode').val(device_details[0].code);
                $('#txtSearchMaterialName').val(material_details);
                $('#txtSearchReqOutput').val(device_details[0].qty_per_reel);

                // $('#txtDeviceName', $('#formCNAssemblyRuncard')).val($('#txtSelectDeviceName').val());
                // $('#txtMaterialName', $('#formCNAssemblyRuncard')).val(material_details);

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
                    console.log('test');
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
        });
    });

    dtProdRuncard = $("#tblProductionRuncard").DataTable({
        "processing" : true,
        "serverSide" : true,
        "ajax" : {
            url: "view_production_runcard",
            data: function (param){
                param.device_name = $("#txtSelectDeviceName").val();
            }
        },
        fixedHeader: true,
        "columns":[
            { "data" : "action", orderable:false, searchable:false },
            { "data" : "status" },
            { "data" : "part_name" },
            { "data" : "po_number" },
            { "data" : "po_quantity" },
            { "data" : "production_lot" },
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
            // $('#btnScanSZeroSevenProdLot').prop('disabled', false);
            // $('#btnScanSZeroTwoProdLot').prop('disabled', false);
            // $('#btnAddRuncardStation').prop('hidden', false);
            $('#btnSubmitAssemblyRuncardData').prop('hidden', true);
            GetPOFromPPSDB($('.SelPoNumber'), $('#txtSelectDeviceName').val());
            //

            //     GetDocumentNoFromACDCS($('#txtDeviceName').val(), 'R Drawing', $("#txtSelectDocNoRDrawing"));
            //     GetDocumentNoFromACDCS($('#txtDeviceName').val(), 'A Drawing', $("#txtSelectDocNoADrawing"));
            //     GetDocumentNoFromACDCS($('#txtDeviceName').val(), 'G Drawing', $("#txtSelectDocNoGDrawing"));
        }
        else{
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
                        result += '<option value="' + po_details[index]['po_number'] + '">' + po_details[index]['po_number'] + '</option>';
                    }
                }else{
                    result = '<option value="0" selected disabled> -- No record found -- </option>';
                }
                cboElement.html(result);
                if(PoNumber != null){
                    cboElement.val(PoNumber).trigger('change');
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
                GetPOFromPPSDB($('.SelPoNumber'), $('#txtSelectDeviceName').val(), prod_runcard_data[0].po_number);

                $('#formProductionRuncard #txtPOQuantity').val(prod_runcard_data[0].po_quantity);
                $('#formProductionRuncard #txtRequiredOutput').val(prod_runcard_data[0].required_qty);
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

    $('.select2bs5').select2( {
        theme: 'bootstrap-5'
    });

    const delay = (fn, ms) => {
        let timer = 0
        return function(...args) {
            clearTimeout(timer)
            timer = setTimeout(fn.bind(this, ...args), ms || 0)
        }
    }

    // $('#formProductionRuncard #txtPONumber').keyup(delay(function(e){
    $('#formProductionRuncard #txtPONumber').change(delay(function(e){
       let po_number = $(this).val();
       let device_name = $('#formProductionRuncard').find('#txtPartName').val();
       if(po_number != ''){
        GetPPSDBDataByPO(po_number, device_name);
       }
    }, 300));

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
                if (response['result'] == '1') {
                    toastr.error('Error, PO Number doesn`t match with the Device Name');
                }else{
                    let po_details = response['po_details'];
                    let doc_details = response['acdcs_data'];
                    // console.log('details', po_details);
                    $("#formProductionRuncard #txtPartName").val(po_details.part_name);
                    $("#formProductionRuncard #txtPartCode").val(po_details.part_code);
                    $("#formProductionRuncard #txtPONumber").val(po_details.po_number);
                    $("#formProductionRuncard #txtPOQuantity").val(po_details.po_qty);
                    $("#formProductionRuncard #txtDrawingNo").val(doc_details.doc_no);
                    $("#formProductionRuncard #txtDrawingRev").val(doc_details.rev_no);

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

                    let rev_no = doc_details.rev_no;
                    let prod_lot = rev_no + year + month + date;
                    $("#formProductionRuncard #txtProductionLot").val(prod_lot);
                }
            }
        });
    }

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
            if(textProductionLotTime.length >= 9){ //check if the production lot time is filled-up completely
                if(textProductionLot.length > 8){ //check if the production lot no already have time, if true remove the existing time
                    textProductionLot = textProductionLot.slice(0, -10);
                }
                let concattedProductionLot = `${textProductionLot}-${textProductionLotTime}`;
                $('#txtProductionLot').val(concattedProductionLot)
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
        // const qrScannerValue = $('#textQrScanner').val();
        // let ScanQrCodeVal = JSON.parse(qrScannerValue)
                // getLotNo =  ScanQrCodeVal.lot_no
            // qrScannerValue = qrScannerValue.lot_no;
            // console.log(qrScannerValue.lot_no);
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
                // validateScannedMaterial($('#txtPartName').val(),explodedMat[3], '1st Stamping', function(result){

            // $('#textQrScanner').val(''); // Clear after enter
                validateScannedMaterial(explodedMat[0], $('#txtPartName').val(), Material, MaterialClass, function(result){
                    // validateScannedMaterial($('#txtPartName').val(),explodedMat[3], '1st Stamping', function(result){
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
            // switch (formId) {
            //     case 'ScanPZeroTwoProdLot':
            //         production_lot_no = ScanQrCodeVal.production_lot;
            //         verifyProdLotfromMolding(production_lot_no, '', formId, 'txtPZeroTwoProdLot', 'txtPZeroTwoDeviceId', 'CN171P-02#IN-VE', 'txtPZeroTwoDevicePO','txtPZeroTwoDeviceQty');
            //         break;
            //     case 'ScanSZeroSevenProdLot':
            //         production_lot_no = ScanQrCodeVal.production_lot;
            //         verifyProdLotfromMolding(production_lot_no, '', formId, 'txtSZeroSevenProdLot', 'txtSZeroSevenDeviceId', 'CN171S-07#IN-VE', 'txtSZeroSevenDevicePO','txtSZeroSevenDeviceQty');
            //         break;
            //     case 'ScanSZeroTwoProdLot':
            //         production_lot_no = ScanQrCodeVal.lot_no;
            //         production_lot_ext = ScanQrCodeVal.lot_no_ext;
            //         verifyProdLotfromMolding(production_lot_no, production_lot_ext, formId, 'txtSZeroTwoProdLot', 'txtSZeroTwoDeviceId', 'CN171S-02#MO-VE', 'txtSZeroTwoDevicePO', 'txtSZeroTwoDeviceQty');
            //         break;
            //     default:
            //         break;
            // }
        }
    }, 100));

    // $('#txtScanQrCode').on('keyup', function(e){
    //     if(e.keyCode == 13){
    //         let explodedMat = $(this).val().split(' | ');
    //         console.log(explodedMat);
    //         if(explodedMat.length != 4){
    //             toastr.error('Invalid Sticker');
    //             $(this).val('');
    //             $('#modalScanQr').modal('hide');
    //             return;
    //         }else{
    //             validateScannedMaterial($('#txtPartName').val(),explodedMat[3], '1st Stamping', function(result){
    //                 if(result == true){
    //                     $('#txtMaterialLot').val(explodedMat[0]);
    //                     $('#txtMaterialLotQty').val(explodedMat[1]);
    //                 }
    //                 else{
    //                     toastr.error('Scanned material is not for this Device');
    //                 }
    //             });
    //         }

    //         // console.log(explodedMat);
    //         // $(`#${multipleMatId}`).val($(this).val());
    //         $(this).val('');
    //         $('#modalScanQr').modal('hide');
    //     }
    // });

    const validateScannedMaterial = (LotNumber, DeviceName, Material, MaterialClass, callback) => {
        $.ajax({
            type: "get",
            url: "validate_material_lot_number",
            data: {
                'mat_lot_number' : LotNumber,
                'device_name' : DeviceName,
                // 'material_type_to_match' : Material,
            },
            dataType: "json",
            success: function (response) {
                let material_name_value
                // console.log(response['matrix_data'].length > 0);
                if(response['matrix_data'] != 'blank'){
                    if(response['matrix_data'].length > 0){
                        let material_name = response['matrix_data'][0].material_type;
                        let material_class = response['material_class'][0].class_id;
                        console.log('test',material_name);
                        // let class_id = response['matrix_data'][0].class_id;
                        // material_name_value = true;
                        if(material_name.includes(`${Material}`)){
                        // if(material_name.includes(`${Material}`) || class_id.includes(`${MaterialClass}`)){
                            material_name_value = material_name;
                        // }else if(material_class.includes(`${MaterialClass}`)){//clark comment 09/24/2024
                        }else if(material_class == MaterialClass){
                            material_name_value = material_name;
                        }else{
                            material_name_value = false;
                        }
                    }else{
                        material_name_value = false;
                    }
                }else{
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

    // CHRIS CODE
    // $('#txtScanQrCode').on('keyup', function(e){
    //     if(e.keyCode == 13){
    //         let explodedMat = $(this).val().split(' | ');
    //         console.log(explodedMat);
    //         if(explodedMat.length != 4){
    //             toastr.error('Invalid Sticker');
    //             $(this).val('');
    //             $('#modalScanQr').modal('hide');
    //             return;
    //         }
    //         else{
    //             validateScannedMaterial($('#txtMatName').val(),explodedMat[3], '1st Stamping', function(result){
    //                 if(result == true){
    //                     $('#txtMaterialLot').val(explodedMat[0]);
    //                     $('#txtMaterialLotQty').val(explodedMat[1]);
    //                 }
    //                 else{
    //                     toastr.error('Scanned material is not for this Device');
    //                 }
    //             });
    //         }

    //         // console.log(explodedMat);
    //         // $(`#${multipleMatId}`).val($(this).val());
    //         $(this).val('');
    //         $('#modalScanQr').modal('hide');
    //     }
    // });
    // CHRIS CODE

    // $('#textQrScanner').keyup(delay(function(e){
    //     const qrScannerValue = $('#textQrScanner').val();
    //     let ScanQrCodeVal = JSON.parse(qrScannerValue)
    //             // getLotNo =  ScanQrCodeVal.lot_no
    //         // qrScannerValue = qrScannerValue.lot_no;
    //         // console.log(qrScannerValue.lot_no);
    //     let formId = $('#modalQrScanner').attr('data-form-id');
    //     if( e.keyCode == 13 ){
    //         $('#textQrScanner').val(''); // Clear after enter
    //         switch (formId) {
    //             case 'ScanPZeroTwoProdLot':
    //                 production_lot_no = ScanQrCodeVal.production_lot;
    //                 verifyProdLotfromMolding(production_lot_no, '', formId, 'txtPZeroTwoProdLot', 'txtPZeroTwoDeviceId', 'CN171P-02#IN-VE', 'txtPZeroTwoDevicePO','txtPZeroTwoDeviceQty');
    //                 break;
    //             case 'ScanSZeroSevenProdLot':
    //                 production_lot_no = ScanQrCodeVal.production_lot;
    //                 verifyProdLotfromMolding(production_lot_no, '', formId, 'txtSZeroSevenProdLot', 'txtSZeroSevenDeviceId', 'CN171S-07#IN-VE', 'txtSZeroSevenDevicePO','txtSZeroSevenDeviceQty');
    //                 break;
    //             case 'ScanSZeroTwoProdLot':
    //                 production_lot_no = ScanQrCodeVal.lot_no;
    //                 production_lot_ext = ScanQrCodeVal.lot_no_ext;
    //                 verifyProdLotfromMolding(production_lot_no, production_lot_ext, formId, 'txtSZeroTwoProdLot', 'txtSZeroTwoDeviceId', 'CN171S-02#MO-VE', 'txtSZeroTwoDevicePO', 'txtSZeroTwoDeviceQty');
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // }, 100));

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
                GetPOFromPPSDB($('.SelPoNumber'), $('#txtSelectDeviceName').val(), prod_runcard_data[0].po_number);

                $('#formProductionRuncard #txtPOQuantity').val(prod_runcard_data[0].po_quantity);
                $('#formProductionRuncard #txtRequiredOutput').val(prod_runcard_data[0].required_qty);

                production_lot_time = prod_runcard_data[0].production_lot.substr(-9);
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
                }else{
                    // $('#txtInputQuantity').val($('#txtRequiredOutput').val());
                }

                if(mode == 'updating'){
                    console.log('update');
                    if(response['current_step'] == 0){
                        $('#btnAddRuncardStation').prop('disabled', true);
                        $('#btnSubmitAssemblyRuncardData').prop('hidden', false);
                    }else{
                        $('#btnAddRuncardStation').prop('disabled', false);
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

        // $('#buttonAddRuncardModeOfDefect').prop('hidden', false);
         $('#formAddProductionRuncardStation #txtFrmStationsRuncardId').val(runcard_id);
         $("#buttonAddRuncardModeOfDefect").prop('disabled', true);
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

            // console.log(input_val);
            // console.log(output_val);
            // CalculateTotalOutputandYield(output_val,input_val);
        }, 1000));
    });

    // const CalculateTotalOutputandYield = function (output_val, input_val){
    //     // let station_yield = (ng_value / input_val) * 100;

    //     // $('#formProductionRuncard #txtPONumber').keyup(delay(function(e){
    //     //     let po_number = $(this).val();
    //     //     if(po_number != ''){
    //     //      GetPPSDBDataByPO(po_number);
    //     //     }
    //     //  }, 300));
    //     let ng_value;
    //     if(output_val === "" || isNaN(output_val) || input_val === "" || isNaN(input_val)){
    //         ng_value = '';
    //     }else if(output_val != "" || input_val != ""){
    //         ng_value = input_val - output_val;
    //         if(ng_value < 0){
    //             Swal.fire({
    //                 position: "center",
    //                 icon: "error",
    //                 title: "Output Quantity cannot be less than Zero!",
    //                 showConfirmButton: false,
    //                 timer: 1500
    //             });

    //             $('#txtInputQuantity').val('');
    //             $('#txtOutputQuantity').val('');

    //             ng_value = 0;
    //             return;
    //         }
    //     }
    //     $('#txtNgQuantity').val(ng_value);
    // };

    $(document).on('click', '#btnSaveNewRuncardStation',function(e){
        e.preventDefault();
        $.ajax({
            type:"POST",
            url: "add_runcard_station_data",
            data: $('#formAddProductionRuncardStation').serialize() + '&' + $('#formAddQualiDetails').serialize(),
            dataType: "json",
            success: function(response){
                if (response['result'] == 1) {
                    toastr.success('Successful!');
                    $('#txtShipmentOutput').val(response['shipment_output']);
                    $("#modalAddStation").modal('hide');
                    dtProdRuncardStation.draw();
                    CheckExistingStations($('#txtFrmStationsRuncardId').val(), 'updating');
                    CheckExistingSubStations($('#txtFrmStationsRuncardId').val(), 'updating');
                }else{
                    toastr.error('Error!, Please Contanct ISS Local 208');
                }
            }
        });
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
        // $('#tableRuncardStationMOD').prop('disabled', false);
        // $("#tableRuncardStationMOD").find("input,button,textarea,select").attr("disabled", "disabled");
        // $('.buttonRemoveMOD').attr('disabled', false);
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
        $('#txtSelectDocNoRDrawing').prop('disabled', true);
        $('#txtSelectDocNoADrawing').prop('disabled', true);
        $('#txtSelectDocNoGDrawing').prop('disabled', true);
        $('#txtRemarks').prop('disabled', true);
        $('#buttonAddRuncardModeOfDefect').prop('hidden', true);
        // $('#tableRuncardStationMOD').prop('disabled', true);
        // $("#tableRuncardStationMOD").find("input,button,textarea,select").attr("disabled", "disabled");
        // $('.buttonRemoveMOD').attr('disabled', true);
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
                }
                else{
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
        // CLARK NEW CODE

        // $('#LubricantCoatingDiv').addClass('d-none', true);
        // $('#VisualInspDocNoDiv').addClass('d-none', true);

        // $("#labelTotalNumberOfNG").val('');
        // Remove invalid & title validation
        $('div').find('input').removeClass('is-invalid');
        $("div").find('input').attr('title', '');
    });

    function GetProdRuncardStationData(prodRuncardId, prodRuncardStationsId){
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

                $('#formAddProductionRuncardStation #txtStep').val(station_data.station_step);
                $('#formAddProductionRuncardStation #txtSubStationStep').val(station_data.sub_station_step);

                $('#formAddProductionRuncardStation #txtShipmentOutput').val(station_data.shipment_output);

                $('#formAddProductionRuncardStation #txtRemarks').val(station_data.station_remarks);
                $('#formAddProductionRuncardStation #txtMachineNo').val(station_data.station_plastic_injection_machine_no);
                $('#formAddProductionRuncardStation #txtDate').val(station_data.station_date);
                // $('#formAddProductionRuncardStation #txtOperatorName').val(station_data.station_operator_name);
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

                $.each(station_data.defect_checkpoints ,function( value){
                    $("#txtDefectCheckpoint option[value="+value+"]").prop('selected', true);
                });

                // getModeOfDefect($("#tableRuncardStationMOD tr:last").find('.selectMOD'), mode_of_defect_data[index].mod_id);
                // $('#formAddQualiDetails #txtRuncardStationId').val(station_data.id);

                GetStations($('#txtSelectRuncardStation'), station_data.station_step);
                GetSubStations($('#txtSelectRuncardSubStation'), station_data.sub_station_step);

                // if(station_data.station_step == '2'){
                //     $('.QualiDetailsDiv').removeClass('d-none', true);
                // }


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

    function GetDeviceName(cboElement){
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

    function GetStations(cboElement, step = null, is_ud_ptnr = null){
        let result = '<option value="" disabled selected>-- Select Station --</option>';
        // let deviceName = $('#txtSelectDeviceName').val();
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
                // cboElement.html(result);
            },
            success: function (response) {
                let device_details = response['device_details'];

                if(device_details[0].material_process.length > 0) {
                        result = '<option value="" disabled selected>-- Select Station --</option>';
                        // result += '<option step="0" value="">-- CLARK --</option>';
                    for (let index = 0; index < device_details[0].material_process.length; index++) {
                        result += '<option step="'+ device_details[0].material_process[index].step +'" value="' + device_details[0].material_process[index].station_details[0].stations['id'] + '">' + device_details[0].material_process[index].station_details[0].stations['station_name'] + '</option>';
                    }
                }else{
                    result = '<option value="0" selected disabled> -- No record found -- </option>';
                }
                cboElement.html(result);

                $("#txtSelectRuncardStation option[step='"+step+"']").attr('selected', true);
                $("#txtRuncardStation").val($("#txtSelectRuncardStation option[step='"+step+"']").val());

                // if(deviceName == 'CN171P-007-1002-VE(01)'){
                //     if(step == 1){//Lubricant Coating Station
                //         $('#LubricantCoatingDiv').addClass('d-none');
                //         $('#VisualInspDocNoDiv').addClass('d-none');
                //     }else if(step == 2){
                //         $('#LubricantCoatingDiv').addClass('d-none');
                //         $('#VisualInspDocNoDiv').removeClass('d-none');
                //     }else{
                //         $('#LubricantCoatingDiv').addClass('d-none');
                //         $('#VisualInspDocNoDiv').addClass('d-none');
                //     }
                // }else if(deviceName == 'CN171S-007-1002-VE(01)'){
                //     if(step == 3){// Visual Inspection
                //         $('#LubricantCoatingDiv').addClass('d-none');
                //         $('#VisualInspDocNoDiv').removeClass('d-none');
                //     }else{
                //         $('#LubricantCoatingDiv').addClass('d-none');
                //         $('#VisualInspDocNoDiv').addClass('d-none');
                //     }
                // }
            },
            error: function(data, xhr, status) {
                result = '<option value="0" selected disabled> -- Reload Again -- </option>';
                cboElement.html(result);
                console.log('Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
            }
        });
    }

    function GetSubStations(cboElement, step = null){
        let sub_station = ['N/A', 'Rework', 'Segregation', 'Airblowing', 'Visual Inspection'];
        let sub_station_step = ['1', '2', '3', '4', '5'];

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
            success: function (response) {
                console.log(response);
                // response['label_hidden'][0]['id'] = id;
                // console.log(response['label_hidden']);
                // for(let x = 0; x < response['label_hidden'].length; x++){
                //     let dataToAppend = `
                //     <img src="${response['label_hidden'][x]['img']}" style="max-width: 200px;"></img>
                //     `;
                //     $('#hiddenPreview').append(dataToAppend)
                // }

                $("#img_barcode_PO").attr('src', response['qr_code']);
                $("#img_barcode_PO_text").html(response['label']);
                img_barcode_PO_text_hidden = response['label_hidden'];
                $('#modalAssemblyPrintQr').modal('show');
            }
        });
    });

    $('#btnAssemblyPrintQrCode').on('click', function(){
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
        // for (let i = 0; i < img_barcode_PO_text_hidden.length; i++) {
            content += '<table style="margin-left: -5px; margin-top: 18px;">';
                content += '<tr style="width: 290px;">';
                    content += '<td style="vertical-align: bottom;">';
                        content += '<img src="' + img_barcode_PO_text_hidden[0]['img'] + '" style="min-width: 90px; max-width: 90px;">';
                    content += '</td>';
                    content += '<td style="font-size: 10px; font-family: Calibri;">' + img_barcode_PO_text_hidden[0]['text'] + '</td>';
                content += '</tr>';
            content += '</table>';
            content += '<br>';
            // if( i < img_barcode_PO_text_hidden.length-1 ){
            //     content += '<div class="pagebreak"> </div>';
            // }
        // }
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
