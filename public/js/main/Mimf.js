function UpdateMimf(){
	$.ajax({
        url: "update_mimf",
        method: "post",
        data: $('#formMimf').serialize(),
        dataType: "json",
        beforeSend: function(){
            $("#iBtnMimfIcon").addClass('spinner-border spinner-border-sm')
            $("#btnMimf").addClass('disabled')
            $("#iBtnMimfIcon").removeClass('fa fa-check')
        },
        success: function(response){
            if(response['validationHasError'] == 1){
                toastr.error('Saving failed!')

                if(response['error']['mimf_control_no'] === undefined){
                    $("#txtMimfControlNo").removeClass('is-invalid')
                    $("#txtMimfControlNo").attr('title', '')
                }
                else{
                    $("#txtMimfControlNo").addClass('is-invalid');
                    $("#txtMimfControlNo").attr('title', response['error']['mimf_control_no'])
                }

                if(response['error']['mimf_pmi_po_no'] === undefined){
                    $("#txtMimfPmiPoNo").removeClass('is-invalid')
                    $("#txtMimfPmiPoNo").attr('title', '')
                }
                else{
                    $("#txtMimfPmiPoNo").addClass('is-invalid')
                    $("#txtMimfPmiPoNo").attr('title', response['error']['mimf_pmi_po_no'])
                }

                if(response['error']['mimf_date_issuance'] === undefined){
                    $("#dateMimfDateOfInssuance").removeClass('is-invalid')
                    $("#dateMimfDateOfInssuance").attr('title', '')
                }
                else{
                    $("#dateMimfDateOfInssuance").addClass('is-invalid')
                    $("#dateMimfDateOfInssuance").attr('title', response['error']['mimf_date_issuance'])
                }

                if(response['error']['mimf_prodn_quantity'] === undefined){
                    $("#txtMimfProdnQuantity").removeClass('is-invalid')
                    $("#txtMimfProdnQuantity").attr('title', '')
                }
                else{
                    $("#txtMimfProdnQuantity").addClass('is-invalid')
                    $("#txtMimfProdnQuantity").attr('title', response['error']['mimf_prodn_quantity'])
                }

                if(response['error']['mimf_device_code'] === undefined){
                    $("#txtMimfDeviceCode").removeClass('is-invalid')
                    $("#txtMimfDeviceCode").attr('title', '')
                }
                else{
                    $("#txtMimfDeviceCode").addClass('is-invalid')
                    $("#txtMimfDeviceCode").attr('title', response['error']['mimf_device_code'])
                }

                if(response['error']['mimf_device_name'] === undefined){
                    $("#txtMimfDeviceName").removeClass('is-invalid')
                    $("#txtMimfDeviceName").attr('title', '')
                }
                else{
                    $("#txtMimfDeviceName").addClass('is-invalid')
                    $("#txtMimfDeviceName").attr('title', response['error']['mimf_device_name'])
                }

                if(response['error']['mimf_created_by'] === undefined){
                    $("#txtMimfCreatedBy").removeClass('is-invalid')
                    $("#txtMimfCreatedBy").attr('title', '')
                }
                else{                    
                    $("#txtMimfCreatedBy").addClass('is-invalid')
                    $("#txtMimfCreatedBy").attr('title', response['error']['mimf_created_by'])
                }
            }else if(response['result'] == 0){
                alert('Device Name: "'+$("#txtMimfDeviceName").val()+'" is not found on Matrix.')
            }else if(response['result'] == 1){
                alert('Control No. "'+$("#txtMimfControlNo").val()+'" is already exist! '+"\n\n"+' Please refresh the browser to process the request once again.')
            }else if(response['result'] == 2){
                alert('It is not allowed to change the PMI PO Number in the current Control Number!')
            }else if(response['result'] == 3){
                alert('PMI Po No. "'+$("#txtMimfPmiPoNo").val()+'" is already exist!')
            }else{
                $('.mimfClass').removeClass('is-invalid')
                $("#formMimf")[0].reset()
                $('#modalMimf').modal('hide')
                dataTableMimf.draw()
                toastr.success('Succesfully saved!')
            }

            $("#iBtnMimfIcon").removeClass('spinner-border spinner-border-sm')
            $("#btnMimf").removeClass('disabled')
            $("#iBtnMimfIcon").addClass('fa fa-check')
        },
        error: function(data, xhr, status){
            toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status)
        }
    })
}

function GetMimfById(mimfID,poReceivedID){
	$.ajax({
        url: "get_mimf_by_id",
        method: "get",
        data: {
            'mimfID'        :   mimfID,
            'poReceivedID'  :   poReceivedID,
        },
        dataType: "json",
        beforeSend: function(){
            $('.mimfClass').removeClass('is-invalid')
        },

        success: function(response){
            let getMimfToEdit   = response['getMimfToEdit']
            if(getMimfToEdit.length > 0){
                if(getMimfToEdit[0].category == 1){
                    $('.first').prop('checked', true)
                    $('.second').prop('disabled', true)
                }else{
                    $('.first').prop('disabled', true)
                    $('.second').prop('checked', true)
                }         

                $('#txtMimfControlNo').val(getMimfToEdit[0].control_no)
                $('#txtMimfPmiPoNo').val(getMimfToEdit[0].pmi_po_no)
                $('#dateMimfDateOfInssuance').val(getMimfToEdit[0].date_issuance)
                $('#txtMimfProdnQuantity').val(getMimfToEdit[0].prodn_qty)
                $('#txtMimfDeviceCode').val(getMimfToEdit[0].device_code)
                $('#txtMimfDeviceName').val(getMimfToEdit[0].device_name)
            }
        },
    })
}

function GetPpdMaterialType(cboElement){
    let result = '<option value="">N/A</option>'

    $.ajax({
        url: "get_ppd_material_type",
        method: "get",
        data: {
            getMimfDeviceName   : $('#txtMimfDeviceName').val(),
        },
        dataType: "json",

        beforeSend: function(){
            result = '<option selected disabled> -- No Results Found! -- </option>'
            cboElement.html(result);
        },
        success: function(response){
            result = '';
            let getDevice = response['getDeviceName'].material_details;
            if(getDevice.length > 0){
                result = '<option selected value="" disabled> --- Select --- </option>';
                for(let index = 0; index < response['getDeviceName'].material_details.length; index++){
                    if(getDevice.length == 1){
                        $('#slctMimfMaterialType').addClass('slct');
                        $('#slctMimfMaterialType').attr('readonly', true);
                        result += '<option selected value="' + getDevice[index].material_type +'">'+ getDevice[index].material_type +'</option>'
                    }else{
                        $('#slctMimfMaterialType').attr('readonly', false);
                        $('#slctMimfMaterialType').removeClass('slct');
                        result += '<option value="' + getDevice[index].material_type +'">'+ getDevice[index].material_type +'</option>'
                    }
                }    
            }
            else{
                result = '<option value="0" selected disabled> No record found </option>'
            }
            cboElement.html(result)
        }
    })
}

function GetQtyFromInventory(ppsWarehouseInventory){
	$.ajax({
        url: "get_pps_warehouse_inventory",
        method: "get",
        data: {
            'ppsWarehouseInventory' :   ppsWarehouseInventory,
        },
        dataType: "json",
        beforeSend: function(){
        
        },

        success: function(response){
            let getInventory   = response['getInventory']
            let totalBalanace   = response['totalBalanace']
            let result   = response['result']
            console.log('getInventory: ', getInventory);
            if(getInventory != undefined){
                if(getInventory.length > 0){
                    $('#txtMimfMaterialCode').val(getInventory[0].PartNumber)
                    if(getInventory[0].pps_warehouse_transaction_info != null){
                        $('#txtMimfQuantityFromInventory').val(totalBalanace)
                        $('#txtPpsWhseId').val(getInventory[0].id)
                    }
                }else{
                    alert('Material Type not found!!')
                }
            }else{
                $('#txtMimfMaterialCode').val('')
                if($('#slctMimfMaterialType').val() != null){
                    alert('Material Type not found!')
                }
            }

            if(result == 0){
                $('#txtPpsWhseId').val('')
            }
        },
    })
}

function CheckRequestQtyForIssuance(getMimfPoNo){
    $.ajax({
        url: "check_request_qty_for_issuance",
        method: "get",
        data: {
            'getMimfPoNo'   :   getMimfPoNo,
        },
        dataType: "json",

        beforeSend: function(){
        },
        success: function(response){
            let checkRequestQty = response['checkRequestQty'];
            let checkTotalRequestQty = response['checkTotalRequestQty'];
            let totalRequestQty = $('#txtMimfProdnQuantity').val() - checkTotalRequestQty;

            if(checkRequestQty[0].mimf_request_details.length > 0) {
                if($('#txtRequestQuantity').val() > totalRequestQty){
                    alert('The request quantity is greater than the PO Quantity.')
                    $('#modalMimfPpsRequest').modal('hide')
                }            
            }

            console.log('txtRequestQuantity: ', $('#txtRequestQuantity').val());
            console.log('txtMimfProdnQuantity: ', $('#txtMimfProdnQuantity').val());
            if(Number($('#txtRequestQuantity').val()) > Number($('#txtMimfProdnQuantity').val())){
                alert('The request quantity is greater than the PO Quantity..')
                $('#modalMimfPpsRequest').modal('hide')
            }
        }
    })
}

function CreateUpdateMimfPpsRequest(){
	$.ajax({
        url: "create_update_mimf_pps_request",
        method: "post",
        data: $('#formMimfPpsRequest').serialize(),
        dataType: "json",
        beforeSend: function(){
            $("#iBtnMimfPpsRequestIcon").addClass('spinner-border spinner-border-sm')
            $("#btnMimfPpsRequest").addClass('disabled')
            $("#iBtnMimfPpsRequestIcon").removeClass('fa fa-check')
        },
        success: function(response){
            if(response['result'] == 0){
                alert('Material Type: '+$('#slctMimfMaterialType').val()+' '+"\n"+'Material Code: '+$('#txtMimfMaterialCode').val()+' '+"\n\n"+'is not found on PPS Dieset System')
            }else if(response['result'] == 1){
                alert('Material Type: '+$('#slctMimfMaterialType').val()+' '+"\n"+'Material Code: '+$('#txtMimfMaterialCode').val()+' '+"\n\n"+'is not found on Matrix')
            }else if(response['result'] == 2){
                alert('Material Type: '+$('#slctMimfMaterialType').val()+' '+"\n"+'Material Code: '+$('#txtMimfMaterialCode').val()+' '+"\n\n"+'is not found on PPS Item List')
            }else if(response['validationHasError'] == 1){
                toastr.error('Saving failed!')

                if(response['error']['mimf_material_type'] === undefined){
                    $("#slctMimfMaterialType").removeClass('is-invalid')
                    $("#slctMimfMaterialType").attr('title', '')
                }
                else{
                    $("#slctMimfMaterialType").addClass('is-invalid');
                    $("#slctMimfMaterialType").attr('title', response['error']['mimf_material_type'])
                }

                if(response['error']['mimf_material_code'] === undefined){
                    $("#txtMimfMaterialCode").removeClass('is-invalid')
                    $("#txtMimfMaterialCode").attr('title', '')
                }
                else{
                    $("#txtMimfMaterialCode").addClass('is-invalid')
                    $("#txtMimfMaterialCode").attr('title', response['error']['mimf_material_code'])
                }

                if(response['error']['mimf_quantity_from_inventory'] === undefined){
                    $("#txtMimfQuantityFromInventory").removeClass('is-invalid')
                    $("#txtMimfQuantityFromInventory").attr('title', '')
                }
                else{
                    $("#txtMimfQuantityFromInventory").addClass('is-invalid')
                    $("#txtMimfQuantityFromInventory").attr('title', response['error']['mimf_quantity_from_inventory'])
                }

                if(response['error']['request_quantity'] === undefined){
                    $("#txtRequestQuantity").removeClass('is-invalid')
                    $("#txtRequestQuantity").attr('title', '')
                }
                else{
                    $("#txtRequestQuantity").addClass('is-invalid')
                    $("#txtRequestQuantity").attr('title', response['error']['request_quantity'])
                }

                if(response['error']['mimf_needed_kgs'] === undefined){
                    $("#txtMimfNeededKgs").removeClass('is-invalid')
                    $("#txtMimfNeededKgs").attr('title', '')
                }
                else{
                    $("#txtMimfNeededKgs").addClass('is-invalid')
                    $("#txtMimfNeededKgs").attr('title', response['error']['mimf_needed_kgs'])
                }

                if(response['error']['mimf_request_pins_pcs'] === undefined){
                    $("#txtMimfRequestPinsPcs").removeClass('is-invalid')
                    $("#txtMimfRequestPinsPcs").attr('title', '')
                }
                else{
                    $("#txtMimfRequestPinsPcs").addClass('is-invalid')
                    $("#txtMimfRequestPinsPcs").attr('title', response['error']['mimf_request_pins_pcs'])
                }

                if(response['error']['mimf_virgin_material'] === undefined){
                    $("#txtMimfVirginMaterial").removeClass('is-invalid')
                    $("#txtMimfVirginMaterial").attr('title', '')
                }
                else{
                    $("#txtMimfVirginMaterial").addClass('is-invalid')
                    $("#txtMimfVirginMaterial").attr('title', response['error']['mimf_virgin_material'])
                }
                if(response['error']['mimf_recycled'] === undefined){
                    $("#txtMimfRecycled").removeClass('is-invalid')
                    $("#txtMimfRecycled").attr('title', '')
                }
                else{
                    $("#txtMimfRecycled").addClass('is-invalid')
                    $("#txtMimfRecycled").attr('title', response['error']['mimf_recycled'])
                }
                if(response['error']['date_mimf_prodn'] === undefined){
                    $("#dateMimfProdn").removeClass('is-invalid')
                    $("#dateMimfProdn").attr('title', '')
                }
                else{
                    $("#dateMimfProdn").addClass('is-invalid')
                    $("#dateMimfProdn").attr('title', response['error']['date_mimf_prodn'])
                }
                if(response['error']['mimf_delivery'] === undefined){
                    $("#dateMimfDelivery").removeClass('is-invalid')
                    $("#dateMimfDelivery").attr('title', '')
                }
                else{
                    $("#dateMimfDelivery").addClass('is-invalid')
                    $("#dateMimfDelivery").attr('title', response['error']['mimf_delivery'])
                }
                if(response['error']['mimf_remark'] === undefined){
                    $("#txtMimfRemark").removeClass('is-invalid')
                    $("#txtMimfRemark").attr('title', '')
                }
                else{
                    $("#txtMimfRemark").addClass('is-invalid')
                    $("#txtMimfRemark").attr('title', response['error']['mimf_remark'])
                }
                if(response['error']['created_by'] === undefined){
                    $("#txtCreatedBy").removeClass('is-invalid')
                    $("#txtCreatedBy").attr('title', '')
                }
                else{
                    $("#txtCreatedBy").addClass('is-invalid')
                    $("#txtCreatedBy").attr('title', response['error']['created_by'])
                }
            }else{
                $('.reset-value').removeClass('is-invalid')
                $("#formMimfPpsRequest")[0].reset()
                $('#modalMimfPpsRequest').modal('hide')
                dataTableMimfPpsRequest.draw()
                toastr.success('Succesfully saved!')
            }

            $("#iBtnMimfPpsRequestIcon").removeClass('spinner-border spinner-border-sm')
            $("#btnMimfPpsRequest").removeClass('disabled')
            $("#iBtnMimfPpsRequestIcon").addClass('fa fa-check')
        },
        error: function(data, xhr, status){
            toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status)
        }
    })
}





