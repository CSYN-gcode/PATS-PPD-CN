$(document).ready(function () {

    let ActionDonePartsNoArr = [];
    let ActionDoneQuantityArr = [];

    // UPDATE STATUS OF DIESET REQUEST
    $(document).on('click', '.actionChangeStatusBtn', function(e){
        let id = $(this).attr('dmrpqc_id');
        let process_status = $(this).attr('process_status');
        $("#ChangeStatusRequestID").val(id);
        $("#ProcessStatus").val(process_status);
        $("#modalChangeStatusRequest").modal('show');
    });

    $("#FrmChangeStatusRequest").submit(function(event) {
        event.preventDefault();
        let id = $('#ChangeStatusRequestID').val();
        let process_status = $("#ProcessStatus").val();
        let _token = $("#csrf_token").val();
        // let _token = csrf_token();

        UpdateStatusOfDiesetRequest(_token, id, process_status);
    });

    // CONFORM BOTTON
    $(document).on('click', '.actionConformBtn', function(e){
        let id = $(this).attr('dmrpqc_id');
        let process_status = $(this).attr('process_status');
        let _token = $(this).attr('csrf_token');
        // let _token = "{{ csrf_token() }}";
        // $("#ChangeStatusRequestID").val(id);
        // $("#ProcessStatus").val(process_status);
        // $("#modalChangeStatusRequest").modal('show');

        UpdateStatusOfDiesetRequest(_token, id, process_status);
        // function UpdateStatusOfDiesetRequest(){

        // $.ajax({
        //     url: "update_status_of_dieset_request",
        //     method: "post",
        //     data: {
        //         '_token' : _token,
        //         'request_id' : id,
        //         'process_status' : process_status,
        //     },
        //     dataType: "json",
        //     success: function (response) {
        //         let result = response['result'];
        //         if (result == 'Successful') {
        //             dataTableDmrpqc.draw();
        //             toastr.success('Successful!');
        //             $("#modalChangeStatusRequest").modal('hide');
        //         }
        //         else if(result == 'Duplicate'){
        //             toastr.error('Request Already Submitted!');
        //         }
        //         else if(result == 'Session Expired') {
        //             toastr.error('Session Expired!, Please Log-in again');
        //         }else if(result == 'Error'){
        //             toastr.error('Error!, Please Contanct ISS Local 208');
        //         }else{
        //             toastr.error('Error!, Please Contanct ISS Local 208');
        //         }
        //     }
        // });
        // }
    });

    // DELETE REQUEST
    $(document).on('click', '.actionDeleteBtn', function(e){
        let id = $(this).attr('dmrpqc_id');
        $("#deleterequestID").val(id);
        $("#modalDeleteRequest").modal('show');
    });

    $("#FrmDeleteRequest").submit(function(event) {
        event.preventDefault();
        DeleteRequest();
    });

    $("#tbl_dmrpqc").on('click', '.actionViewBtn', function(e){
        let id = $(this).attr('dmrpqc_id');
        let process_status = $(this).attr('process_status');

        var data = {
            'id' : id,
            'process_status' : process_status
        }

        GetUserIDBySession();
        GetDmrpqcDetails(data, 'viewing');
        ProcessStatusDivControls(process_status); //show or hide parts by process status

        $('#idbtnSaveFrm').addClass('d-none');

        ProductIdentificatioViewingMode();
        DiesetConditionAndCheckingViewingMode();
        MachineSetupViewingMode();
        ProdReqCheckingViewingMode();
        MachineParameterViewingMode();
        SpecificationViewingMode();
        CompletionActivityViewingMode();
    });

    $("#tbl_dmrpqc").on('click', '.actionUpdateBtn', function(e){
        $('#idbtnSaveFrm').removeClass('d-none');

        let id = $(this).attr('dmrpqc_id');
        let process_status = $(this).attr('process_status');

        var data = {
            'id' : id,
            'process_status' : process_status
        }
        GetUserIDBySession();
        GetDmrpqcDetails(data, 'updating');
        ProcessStatusDivControls(process_status); //show or hide parts by process status
        ProductIdentificatioViewingMode();

        if(process_status == 2){ //Dieset Condition Part & Dieset Condition Checking Part
            DiesetConditionAndCheckingEdittingMode();
        }else{
            DiesetConditionAndCheckingViewingMode();
        }

        // if(process_status == 3){ //Dieset Condition Checking Part //commented by Clark 04272024
        //     $("#tbl_dieset_condition_checking .dieset_condition_checking_data").attr('disabled', false);
        //     // $('#btnPartsDrawing').removeClass('d-none');
        // }else{
        //     frmProdIdentification.find('#collapseThree').removeClass('show',true); //remove/fold Part3 div
        //     $("#tbl_dieset_condition_checking .dieset_condition_checking_data").attr('disabled', true);
        // }

        if(process_status == 4){ //Machine Setup
            MachineSetupEdittingMode();
        }else{
            MachineSetupViewingMode();
        }

        if(process_status == 5){//Product Requirement Checking
            ProdReqCheckingEdittingMode(data);
        }else{
            ProdReqCheckingViewingMode();
        }

        if(process_status == 6){//Machine Parameter Checking
            MachineParameterEdittingMode();
        }else{
            MachineParameterViewingMode();
        }

        if(process_status == 7){//Specifications
            SpecificationEdittingMode();
        }else{
            SpecificationViewingMode();
        }

        if(process_status == 8){//Completion Activity
            CompletionActivityEdittingMode();
        }else{
            CompletionActivityViewingMode();
        }
    });

    $("#idbtnSaveFrm").click(function(event){
        try {
            event.preventDefault();
            let process_status = $('#txt_global_status').val();
            let request_id = $('#txt_global_dmrpqc_id').val();
            let user_id = $('#txt_user_id').val();
            let csrf_token = $('#csrf_token').val();
            if(process_status == ''){
                console.log('process_status null');
                AddDmrpqc();
            }else if(process_status == 2 || process_status == 3){
                for(let index = 1; index <= $('#row_counter').val(); index++){
                    let parts_no = $('.dieset_condition_data[index="4.'+index+'"][name="parts_no"]').val();
                    let quantity = $('.dieset_condition_data[index="4.'+index+'"][name="quantity"]').val();

                    ActionDonePartsNoArr.push(parts_no);
                    ActionDoneQuantityArr.push(quantity);
                }
                UpdateDiesetConditionData(ActionDonePartsNoArr, ActionDoneQuantityArr, request_id, process_status, user_id, csrf_token);
                UpdateDiesetConditionCheckingData(request_id, process_status, user_id, csrf_token);
            }
            // else if(process_status == 3){
            //     UpdateDiesetConditionCheckingData(request_id, process_status, user_id, csrf_token);
            // }
            else if(process_status == 4){
                UpdateMachineSetupData(request_id, process_status, user_id, csrf_token);
            }else if(process_status == 5){
                UpdateProdReqCheckingData(request_id, process_status, user_id, csrf_token);
            }else if(process_status == 6){
                UpdateMachineParamCheckingData(request_id, process_status, user_id, csrf_token);
            }else if(process_status == 7){
                UpdateSpecifications(request_id, process_status, user_id, csrf_token);
            }else if(process_status == 8){
                UpdateCompletionActivity(request_id, process_status, user_id, csrf_token);
            }
        } catch (error) {
            toastr.error('An error occured!\n' + 'Data: ' + error);
        }
    });
}); //Doc Ready End

function require_if_unchecked(ClassName){
    if(ClassName.prop('checked')){
        console.log('checked, not required');
        ClassName.attr('required', false);
    }else{
        console.log('unchecked, required');
        ClassName.attr('required', true);
    }
}

function AddDmrpqc(){
    $.ajax({
        url: "add_request",
        method: "post",
        data: $('#frm_prod_identification').serialize(),
        dataType: "json",
        beforeSend: function(){
            // $(".icon_save_pilotA").addClass('fa fa-spinner fa-pulse');
            // $("#id_btn_save_pilotA").prop('disabled', 'disabled');
        },
        success: function(JsonObject){
            if(JsonObject['validation'] == "hasError"){
                console.log(JsonObject['error']);

                if(JsonObject['error']['po_no'] === undefined){
                    frmProdIdentification.find('#frm_txt_po_no').removeClass('is-invalid');
                    frmProdIdentification.find('#frm_txt_po_no').attr('title','');
                }else{
                    frmProdIdentification.find('#frm_txt_po_no').addClass('is-invalid');
                    frmProdIdentification.find('#frm_txt_po_no').attr('title',JsonObject['error']['po_no']);
                }

                if(JsonObject['error']['request_type'] === undefined){
                    frmProdIdentification.find('#frm_request_type').removeClass('is-invalid');
                    frmProdIdentification.find('#frm_request_type').attr('title','');
                }else{
                    frmProdIdentification.find('#frm_request_type').addClass('is-invalid');
                    frmProdIdentification.find('#frm_request_type').attr('title',JsonObject['error']['request_type']);
                }

            }else if(JsonObject['result'] == 1){
                $("#modalProdIdentification").modal('hide');
                $("#frm_prod_identification")[0].reset();
                frmProdIdentification.find('input').removeClass('is-invalid');
                frmProdIdentification.find('input').attr('title','');
                frmProdIdentification.find('select').removeClass('is-invalid');
                frmProdIdentification.find('select').attr('title','');
                toastr.success('New Request was succesfully saved!');
            }else if(JsonObject['result'] == 2){
                toastr.error('Saving Failed! Item Code Still Ongoing Preparation');
            }
            else{
                toastr.error('Saving Failed! Please check all fields. Put N/A if not applicable. Check all radio button.');
            }
            dataTableDmrpqc.draw();
        },
        error: function(data, xhr, status){
            toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
        }
    });
}

// GET PREPARED BY FOR MATERIAL ISSUANCE
function GetUserIDBySession(){
    $.ajax({
        url: "get_name_by_session",
        method: "get",
        dataType: "json",
        beforeSend: function(){
        },
        success: function(response){
            let result = response['result'];
            if(result == 1){
                toastr.error('Session Expired!');
            }else{
                $('#txt_user_id').val(result[0].id);
                $('#txt_user_name').val(result[0].firstname +' '+ result[0].lastname);
            }
        },
    });
}
// const getModeOfDefect = (elementId, modeOfDefectId = null) => {
const GetDmrpqcDetails = (data, attr_mode = null) => {

    if(attr_mode == 'viewing'){
        attr_mode = 'disabled';
    }else{
        attr_mode = '';
    }
    //  console.log(mode);

    $.ajax({
        url: "get_dmrpqc_details_id",
        method: "get",
        data: data,
        dataType: "json",
        beforeSend(){
            $('#tbl_parts_no_and_qty tbody .addRowforEdit').remove();
            $('#btn_remove_row').addClass('d-none');
        },
        success: function(response){
            // if(modeOfDefectId != null){
            //     elementId.val(modeOfDefectId).trigger('change');
            // }

                let dmrpqc_details = response['dmrpqc_details'];
                let dieset_condition_details = response['dieset_condition_details'];
                let dieset_condition_checking_details = response['dieset_condition_checking_details'];
                let machine_setup_details = response['machine_setup_details'];
                let product_req_checking_details = response['product_req_checking_details'];
                let machine_setup_sample_details = response['machine_setup_sample_details'];
                let machine_param_checking_details = response['machine_param_checking_details'];
                let specification_details = response['specification_details'];
                let completion_activity_details = response['completion_activity_details'];

                $("#txt_global_dmrpqc_id").val(dmrpqc_details[0].id);
                $("#txt_global_status").val(dmrpqc_details[0].process_status);

                $('#frm_prod_identification .dieset_condition_data[index="1.1.1"]').val(dmrpqc_details[0].device_name);
                $("#frm_txt_device_name").val(dmrpqc_details[0].device_name);
                $("#frm_txt_po_no").val(dmrpqc_details[0].po_number);
                $("#frm_txt_item_code").val(dmrpqc_details[0].item_code);
                $("#frm_txt_die_no").val(dmrpqc_details[0].die_no);
                $("#frm_txt_drawing_no").val(dmrpqc_details[0].drawing_no);
                $("#frm_txt_rev_no").val(dmrpqc_details[0].rev_no);
                $("#frm_txt_start_datetime").val(dmrpqc_details[0].start_date_time);
                $("#frm_request_type").val(dmrpqc_details[0].request_type);
                $("#frm_txt_requested_by_id").val(dmrpqc_details[0].created_by.id);
                $("#frm_txt_requested_by").val(dmrpqc_details[0].created_by.full_name);

                // GetPPSDBDataByItemCode(dmrpqc_details[0].po_number);

                    if(dieset_condition_details != ''){
                        if(dieset_condition_details[0].parts_drawing != undefined){
                        //     $('#btnPartsDrawing').addClass('d-none'); //test
                        // }else{
                            $('#btnPartsDrawing').removeClass('d-none'); //test
                        }

                        let action_done_arr = [];
                        let check_point_arr = [];
                        let mold_check_arr  = [];

                        action_done_arr.push(dieset_condition_details[0].action_1_mold_cleaned,
                                            dieset_condition_details[0].action_2_mold_check,
                                            dieset_condition_details[0].action_3_device_conversion,
                                            dieset_condition_details[0].action_4_dieset_overhaul,
                                            dieset_condition_details[0].action_4a_fix_side,
                                            dieset_condition_details[0].action_4b_movement_side,
                                            dieset_condition_details[0].action_4c_with_parts_marking,
                                            dieset_condition_details[0].action_4d_without_parts_marking,
                                            dieset_condition_details[0].action_5_reversible_parts_installed,
                                            dieset_condition_details[0].action_6_repair,
                                            dieset_condition_details[0].action_7_parts_change,
                                            dieset_condition_details[0].action_7a_new,
                                            dieset_condition_details[0].action_7b_fabricated,
                                            dieset_condition_details[0].action_7c_with_parts_marking,
                                            dieset_condition_details[0].action_7d_with_parts_change_notice
                        );

                        check_point_arr.push(dieset_condition_details[0].check_point_1_marking_check,
                                            dieset_condition_details[0].check_point_2_tanshi_pin,
                                            dieset_condition_details[0].check_point_2a_crack,
                                            dieset_condition_details[0].check_point_2b_bend,
                                            dieset_condition_details[0].check_point_2c_worn_out,
                                            dieset_condition_details[0].check_point_3_dent,
                                            dieset_condition_details[0].check_point_4_porous,
                                            dieset_condition_details[0].check_point_5_ejector_pin,
                                            dieset_condition_details[0].check_point_6_coma,
                                            dieset_condition_details[0].check_point_7_gasvent,
                                            dieset_condition_details[0].check_point_8_assy_orientation,
                                            dieset_condition_details[0].check_point_9_fs_ms_fitting,
                                            dieset_condition_details[0].check_point_10_sub_gate
                        );

                        mold_check_arr.push(dieset_condition_details[0].mold_check_1_withdraw_pin_external,
                                            dieset_condition_details[0].mold_check_2_withdraw_pin_internal,
                                            dieset_condition_details[0].mold_check_3_slidecore_stopper,
                                            dieset_condition_details[0].mold_check_4_locator_ring,
                                            dieset_condition_details[0].mold_check_5_bolts_nuts,
                                            dieset_condition_details[0].mold_check_6_stripper_plate
                        );

                        let action_index = 0;
                        while(action_index < action_done_arr.length){
                            if(action_done_arr[action_index] == 1){
                                $('.dieset_condition_data[index="1.'+action_index+'"]').prop('checked', true);
                            }else{
                                $('.dieset_condition_data[index="1.'+action_index+'"]').prop('checked', false);
                            }
                            if(action_index == 8){
                                if(action_done_arr[action_index] == 1){
                                    $('.dieset_condition_data[index="1.'+action_index+'"][value="1"]').prop('checked', true);
                                }else if(action_done_arr[action_index] == 0){
                                    $('.dieset_condition_data[index="1.'+action_index+'"][value="0"]').prop('checked', true);
                                }else{
                                    $('.dieset_condition_data[index="1.'+action_index+'"]').prop('checked', false);
                                }
                            }
                            action_index++;
                        }

                        let checkpoint_index = 0;
                        while(checkpoint_index < check_point_arr.length){
                            if(check_point_arr[checkpoint_index] == 'OK'){
                                $('.dieset_condition_data[index="2.'+checkpoint_index+'"][value="OK"]').prop('checked', true);
                            }else if(check_point_arr[checkpoint_index] == 'NG'){
                                $('.dieset_condition_data[index="2.'+checkpoint_index+'"][value="NG"]').prop('checked', true);
                            }else{
                                $('.dieset_condition_data[index="2.'+checkpoint_index+'"]').prop('checked', false);
                            }

                            if(checkpoint_index == 2 || checkpoint_index == 3 || checkpoint_index == 4){
                                if(check_point_arr[checkpoint_index] == 1){
                                    $('.dieset_condition_data[index="2.'+checkpoint_index+'"]').prop('checked', true);
                                }else{
                                    $('.dieset_condition_data[index="2.'+checkpoint_index+'"]').prop('checked', false);
                                }
                            }
                            if(checkpoint_index == 9){
                                $('.dieset_condition_data[index="2.'+checkpoint_index+'"]').val(check_point_arr[checkpoint_index]);
                            }
                            checkpoint_index++;
                        }

                        let mold_check_index = 0;
                        while(mold_check_index < mold_check_arr.length){
                            if(mold_check_arr[mold_check_index] == 'OK'){
                                $('.dieset_condition_data[index="3.'+mold_check_index+'"][value="OK"]').prop('checked', true);
                            }else if(mold_check_arr[mold_check_index] == 'NG'){
                                $('.dieset_condition_data[index="3.'+mold_check_index+'"][value="NG"]').prop('checked', true);
                            }else if(mold_check_arr[mold_check_index] == 'N/A'){
                                $('.dieset_condition_data[index="3.'+mold_check_index+'"][value="N/A"]').prop('checked', true);
                            }else{
                                $('.dieset_condition_data[index="3.'+mold_check_index+'"]').prop('checked', false);
                            }
                            mold_check_index++;
                        }

                        let parts_no = dieset_condition_details[0].parts_no.split(",");
                        let quantity = dieset_condition_details[0].quantity.split(",");
                        console.log(parts_no);
                        console.log(quantity);

                        $('.dieset_condition_data[index="4.1"][name="parts_no"]').val(parts_no[0]); //static set of value to static attr:index
                        $('.dieset_condition_data[index="4.1"][name="quantity"]').val(quantity[0]); //static set of value to static attr:index

                        let edit_row_counter = (parts_no.length);
                        if(edit_row_counter > 1){
                            if(dmrpqc_details[0].process_status == 2 && attr_mode != 'disabled'){
                                $('#btn_remove_row').removeClass('d-none');
                            }else{
                                $('#btn_remove_row').addClass('d-none');
                                attr_mode = 'disabled';
                            }
                        }else{
                            $('#btn_remove_row').addClass('d-none');
                        }
                        for(let index = 1; index < parts_no.length && index < quantity.length; index++){
                            var html = '<tr class="addRowforEdit" id="row_'+(index+1)+'">';
                                    // html += '<td>';
                                    //     html += '<input type="text" class="form-control" name="row_counter" id="row_counter" value="'+row_counter+'" readonly>';
                                    // html += '</td>';
                                    html += '<td hidden></td>';
                                    html += '<td class="text-center align-middle">'+(index+1)+'.</td>';
                                    html += '<td>';
                                        html += '<input '+attr_mode+' type="text" class="form-control dieset_condition_data" index="4.'+(index+1)+'" name="parts_no" id="frm_parts_no_'+(index+1)+'" value="'+parts_no[index]+'">';
                                    html += '</td>';
                                    html += '<td>';
                                        html += '<input '+attr_mode+' type="text" class="form-control dieset_condition_data" index="4.'+(index+1)+'" name="quantity" id="frm_quantity_'+(index+1)+'" value="'+quantity[index]+'">';
                                    html += '</td>';
                                html += '</tr>';

                            $('#row_counter').val(edit_row_counter);
                            $('#tbl_parts_no_and_qty tbody').append(html);
                        }

                        $("#selFabricatedBy").val(dieset_condition_details[0].drawing_fabricated_by);
                        $("#selValidatedBy").val(dieset_condition_details[0].drawing_validated_by);

                        $("#frm_txt_details_of_activity").val(dieset_condition_details[0].details_of_activity);
                        $("#frm_txt_action_date_start").val(dieset_condition_details[0].action_done_date_start);
                        $("#frm_txt_action_start_time").val(dieset_condition_details[0].action_done_start_time);
                        $("#frm_txt_action_finish_time").val(dieset_condition_details[0].action_done_finish_time);
                        $("#frm_check_point_remarks").val(dieset_condition_details[0].check_point_remarks);
                        $("#frm_mold_check_remarks").val(dieset_condition_details[0].mold_check_remarks);
                        let mold_check_date_time = dieset_condition_details[0].mold_check_date.concat(" ", dieset_condition_details[0].mold_check_time);
                        $("#frm_mold_check_date_time").val(mold_check_date_time);
                        $("#frm_mold_check_status").val(dieset_condition_details[0].mold_check_status);

                        if(dieset_condition_details[0].final_remarks == 1){
                            $('.dieset_condition_data[name="final_remarks"][value="1"]').prop('checked', true);
                        }else if(dieset_condition_details[0].final_remarks == 2){
                            $('.dieset_condition_data[name="final_remarks"][value="2"]').prop('checked', true);
                        }else{
                            $('.dieset_condition_data[name="final_remarks"]').prop('checked', false);
                        }

                        if(dieset_condition_details[0].in_charged == null){
                            $("#frm_txt_action_done_in_charged_id").val($("#txt_user_id").val());
                            $("#frm_txt_action_done_in_charged").val($("#txt_user_name").val());
                        }else{
                            $("#frm_txt_action_done_in_charged_id").val(dieset_condition_details[0].in_charged.id);
                            $("#frm_txt_action_done_in_charged").val(dieset_condition_details[0].in_charged.full_name);
                        }

                        if(dieset_condition_details[0].mold_check_checked_by == null){
                            $("#frm_txt_mold_check_checked_by_id").val($("#txt_user_id").val());
                            $("#frm_txt_mold_check_checked_by").val($("#txt_user_name").val());
                        }else{
                            $("#frm_txt_mold_check_checked_by_id").val(dieset_condition_details[0].checked_by.id);
                            $("#frm_txt_mold_check_checked_by").val(dieset_condition_details[0].checked_by.full_name);
                        }

                        switch(dieset_condition_details[0].references_used){
                            case 1: $('.dieset_condition_data[name="references_used"][value="1"]').prop('checked', true); break;
                            case 2: $('.dieset_condition_data[name="references_used"][value="2"]').prop('checked', true); break;
                            case 3: $('.dieset_condition_data[name="references_used"][value="3"]').prop('checked', true); break;
                            case 4: $('.dieset_condition_data[name="references_used"][value="4"]').prop('checked', true); break;
                            default: $('.dieset_condition_data[name="references_used"]').prop('checked', false); break;
                        }

                        ActionDone4CheckBoxControls();
                        ActionDone7CheckBoxControls();
                    }

                    if(dieset_condition_checking_details != ''){
                        if(dieset_condition_checking_details[0].checked_by == null){
                            $("#frm_txt_dieset_checking_checked_by_id").val($("#txt_user_id").val());
                            $("#frm_txt_dieset_checking_checked_by").val($("#txt_user_name").val());
                        }else{
                            $("#frm_txt_dieset_checking_checked_by_id").val(dieset_condition_checking_details[0].checked_by.id);
                            $("#frm_txt_dieset_checking_checked_by").val(dieset_condition_checking_details[0].checked_by.full_name);
                        }

                        // $("#frm_txt_good_condition").val(dieset_condition_checking_details[0].good_condition);
                        // $("#frm_txt_under_longevity").val(dieset_condition_checking_details[0].under_longevity);
                        // $("#frm_txt_problematic").val(dieset_condition_checking_details[0].problematic_die_set);

                        if(dieset_condition_checking_details[0].good_condition == 1){
                            $('#frm_txt_good_condition').prop('checked', true);
                        }else{
                            $('#frm_txt_good_condition').prop('checked', false);
                        }

                        if(dieset_condition_checking_details[0].under_longevity == 1){
                            $('#frm_txt_under_longevity').prop('checked', true);
                        }else{
                            $('#frm_txt_under_longevity').prop('checked', false);
                        }

                        if(dieset_condition_checking_details[0].problematic_die_set == 1){
                            $('#frm_txt_problematic').prop('checked', true);
                        }else{
                            $('#frm_txt_problematic').prop('checked', false);
                        }

                        $("#frm_txt_dieset_condition_checking_date").val(dieset_condition_checking_details[0].date);
                    }

                    if(machine_setup_details != ''){
                        if(machine_setup_details[0].process_status == 1){
                            $('#tbl_machine_setup .first_adjustment').prop('disabled', true);
                            $('#tbl_machine_setup .second_adjustment').prop('disabled', false);
                            $('#tbl_machine_setup .third_adjustment').prop('disabled', true);
                        }else if(machine_setup_details[0].process_status == 2){
                            $('#tbl_machine_setup .first_adjustment').prop('disabled', true);
                            $('#tbl_machine_setup .second_adjustment').prop('disabled', true);
                            $('#tbl_machine_setup .third_adjustment').prop('disabled', false);
                        }

                        if(machine_setup_details[0].first_adjustment == 1){
                            $('#frm_txt_machine_setup_1st_adjustment').prop('checked', true);
                        }else{
                            $('#frm_txt_machine_setup_1st_adjustment').prop('checked', false);
                        }

                        if(machine_setup_details[0].second_adjustment == 1){
                            $('#frm_txt_machine_setup_2nd_adjustment').prop('checked', true);
                        }else{
                            $('#frm_txt_machine_setup_2nd_adjustment').prop('checked', false);
                        }

                        if(machine_setup_details[0].third_adjustment == 1){
                            $('#frm_txt_machine_setup_3rd_adjustment').prop('checked', true);
                        }else{
                            $('#frm_txt_machine_setup_3rd_adjustment').prop('checked', false);
                        }

                        $("#selProductionUser").val(machine_setup_details[0].first_in_charged);
                        $("#selTechnicianUser").val(machine_setup_details[0].second_in_charged);
                        $("#selSupervisorEngrUser").val(machine_setup_details[0].third_in_charged);

                        switch(machine_setup_details[0].category){
                            case 1: $('.machine_setup_data[name="machine_setup_category"][value="1"]').prop('checked', true); break;
                            case 2: $('.machine_setup_data[name="machine_setup_category"][value="2"]').prop('checked', true); break;
                            default: $('.machine_setup_data[name="machine_setup_category"]').prop('checked', false); break;
                        }

                        $("#frm_txt_machine_setup_1st_datetime").val(machine_setup_details[0].first_date_time);
                        $("#frm_txt_machine_setup_2nd_datetime").val(machine_setup_details[0].second_date_time);
                        $("#frm_txt_machine_setup_3rd_datetime").val(machine_setup_details[0].third_date_time);

                        $("#frm_txt_machine_setup_1st_remarks").val(machine_setup_details[0].first_remarks);
                        $("#frm_txt_machine_setup_2nd_remarks").val(machine_setup_details[0].second_remarks);
                        $("#frm_txt_machine_setup_3rd_remarks").val(machine_setup_details[0].third_remarks);
                    }else{
                        $('#tbl_machine_setup .first_adjustment').prop('disabled', false);
                        $('#tbl_machine_setup .second_adjustment').prop('disabled', true);
                        $('#tbl_machine_setup .third_adjustment').prop('disabled', true);
                    }

                    if(product_req_checking_details != ''){
                        let prod_req_details = product_req_checking_details[0].prod_req_checking_details;
                        let prchecking_production_arr  = [];
                        let prchecking_engr_tech_arr  = [];
                        let prchecking_lqc_arr  = [];
                        let prchecking_process_engr_arr  = [];

                        // Machine Sample Data Start
                        if(machine_setup_sample_details != ''){
                            if(machine_setup_sample_details[0].number_of_shots == 1){
                                $('.machine_setup_sample_data[name="number_of_shots"]').prop('checked', true);
                            }else{
                                $('.machine_setup_sample_data[name="number_of_shots"]').prop('checked', false);
                            }

                            if(machine_setup_sample_details[0].judgement == 1){
                                $('.machine_setup_sample_data[name="judgement"]').prop('checked', true);
                            }else{
                                $('.machine_setup_sample_data[name="judgement"]').prop('checked', false);
                            }

                            if(machine_setup_sample_details[0].machine_parts == 1){
                                $('.machine_setup_sample_data[name="machine_parts"]').prop('checked', true);
                            }else{
                                $('.machine_setup_sample_data[name="machine_parts"]').prop('checked', false);
                            }

                            if(machine_setup_sample_details[0].output_path == 1){
                                $('.machine_setup_sample_data[name="output_path"]').prop('checked', true);
                            }else{
                                $('.machine_setup_sample_data[name="output_path"]').prop('checked', false);
                            }

                            if(machine_setup_sample_details[0].product_catcher == 1){
                                $('.machine_setup_sample_data[name="product_catcher"]').prop('checked', true);
                            }else{
                                $('.machine_setup_sample_data[name="product_catcher"]').prop('checked', false);
                            }

                            $('#frm_txt_actual_quantity').val(machine_setup_sample_details[0].actual_quantity);
                            $('#frm_txt_pic_date').val(machine_setup_sample_details[0].pic_datetime);
                            $('#frm_txt_qc_date').val(machine_setup_sample_details[0].engr_datetime);
                            $('#frm_txt_engr_date').val(machine_setup_sample_details[0].qc_datetime);

                            $('#selMachineSetupSamplesPIC').val(machine_setup_sample_details[0].pic);
                            $('#selMachineSetupSamplesQc').val(machine_setup_sample_details[0].qc);
                            $('#selMachineSetupSamplesEngr').val(machine_setup_sample_details[0].engr);
                        }

                        for (let index = 0; index < prod_req_details.length; index++) {
                            if(prod_req_details[index].process_category == 1){ //PRODUCTION
                                prchecking_production_arr.push(
                                    prod_req_details[index].eval_sample,
                                    prod_req_details[index].japan_sample,
                                    prod_req_details[index].last_prodn_sample,
                                    prod_req_details[index].dieset_eval_report,
                                    prod_req_details[index].cosmetic_defect,
                                    prod_req_details[index].pingauges,
                                    prod_req_details[index].measurescope,
                                    prod_req_details[index].n_a,
                                    prod_req_details[index].visual_insp_result,
                                    prod_req_details[index].dimension_insp_result
                                );

                                let prchecking_prod_index = 0;
                                while(prchecking_prod_index < prchecking_production_arr.length){
                                    if(prchecking_production_arr[prchecking_prod_index] == 1){
                                        $('.prod_req_checking_data[index="1.'+prchecking_prod_index+'"]').prop('checked', true);
                                    }else{
                                        $('.prod_req_checking_data[index="1.'+prchecking_prod_index+'"]').prop('checked', false);
                                    }
                                    if(prchecking_prod_index == 8 || prchecking_prod_index == 9){
                                        if(prchecking_production_arr[prchecking_prod_index] == 1){
                                            $('.prod_req_checking_data[index="1.'+prchecking_prod_index+'"][value="1"]').prop('checked', true);
                                        }else if(prchecking_production_arr[prchecking_prod_index] == 0){
                                            $('.prod_req_checking_data[index="1.'+prchecking_prod_index+'"][value="0"]').prop('checked', true);
                                        }else{
                                            $('.prod_req_checking_data[index="1.'+prchecking_prod_index+'"]').prop('checked', false);
                                        }
                                    }
                                    prchecking_prod_index++;
                                }

                                $("#selProductionVisualUser").val(prod_req_details[index].visual_insp_name);
                                $("#selProductionDimentionUser").val(prod_req_details[index].dimension_insp_name);
                                $("#frm_txt_prod_visual_insp_datetime").val(prod_req_details[index].visual_insp_datetime);
                                $("#frm_txt_prod_dimension_insp_datetime").val(prod_req_details[index].dimension_insp_datetime);
                                $("#frm_txt_prod_actual_checking_remarks").val(prod_req_details[index].actual_checking_remarks);

                            }else if(prod_req_details[index].process_category == 2){// ENGR TECHNICIAN
                                // console.log('iconsole mo',product_req_checking_details[0].prod_req_checking_details);

                                prchecking_engr_tech_arr.push(
                                    prod_req_details[index].eval_sample,
                                    prod_req_details[index].japan_sample,
                                    prod_req_details[index].last_prodn_sample,
                                    prod_req_details[index].material_drawing,
                                    prod_req_details[index].insp_guide,
                                    prod_req_details[index].dieset_eval_report,
                                    prod_req_details[index].cosmetic_defect,
                                    prod_req_details[index].pingauges,
                                    prod_req_details[index].measurescope,
                                    prod_req_details[index].n_a,
                                    prod_req_details[index].visual_insp_result,
                                    prod_req_details[index].dimension_insp_result
                                );

                                let prchecking_engr_tech_index = 0;
                                while(prchecking_engr_tech_index < prchecking_engr_tech_arr.length){
                                    if(prchecking_engr_tech_arr[prchecking_engr_tech_index] == 1){
                                        $('.prod_req_checking_data[index="2.'+prchecking_engr_tech_index+'"]').prop('checked', true);
                                    }else{
                                        $('.prod_req_checking_data[index="2.'+prchecking_engr_tech_index+'"]').prop('checked', false);
                                    }
                                    if(prchecking_engr_tech_index == 10 || prchecking_engr_tech_index == 11){
                                        if(prchecking_engr_tech_arr[prchecking_engr_tech_index] == 1){
                                            $('.prod_req_checking_data[index="2.'+prchecking_engr_tech_index+'"][value="1"]').prop('checked', true);
                                        }else if(prchecking_engr_tech_arr[prchecking_engr_tech_index] == 0){
                                            $('.prod_req_checking_data[index="2.'+prchecking_engr_tech_index+'"][value="0"]').prop('checked', true);
                                        }else{
                                            $('.prod_req_checking_data[index="2.'+prchecking_engr_tech_index+'"]').prop('checked', false);
                                        }
                                    }
                                    prchecking_engr_tech_index++;
                                }

                                $("#frm_txt_engr_tech_material_drawing_no").val(prod_req_details[index].material_drawing_no);
                                $("#frm_txt_engr_tech_material_rev_no").val(prod_req_details[index].material_rev_no);
                                $("#frm_txt_engr_tech_insp_guide_drawing_no").val(prod_req_details[index].insp_guide_drawing_no);
                                $("#frm_txt_engr_tech_insp_guide_rev_no").val(prod_req_details[index].insp_guide_rev_no);
                                $("#selTechnicianVisualUser").val(prod_req_details[index].visual_insp_name);
                                $("#selTechnicianDimensionUser").val(prod_req_details[index].dimension_insp_name);
                                $("#frm_txt_engr_tech_visual_insp_datetime").val(prod_req_details[index].visual_insp_datetime);
                                $("#frm_txt_engr_tech_dimension_insp_datetime").val(prod_req_details[index].dimension_insp_datetime);
                                $("#frm_txt_engr_tech_actual_checking_remarks").val(prod_req_details[index].actual_checking_remarks);
                            }else if(prod_req_details[index].process_category == 3){// LQC
                                prchecking_lqc_arr.push(
                                    prod_req_details[index].eval_sample,
                                    prod_req_details[index].japan_sample,
                                    prod_req_details[index].last_prodn_sample,
                                    prod_req_details[index].material_drawing,
                                    prod_req_details[index].insp_guide,
                                    prod_req_details[index].dieset_eval_report,
                                    prod_req_details[index].cosmetic_defect,
                                    prod_req_details[index].pingauges,
                                    prod_req_details[index].measurescope,
                                    prod_req_details[index].n_a,
                                    prod_req_details[index].visual_insp_result,
                                    prod_req_details[index].dimension_insp_result
                                );

                                let prchecking_lqc_index = 0;
                                while(prchecking_lqc_index < prchecking_lqc_arr.length){
                                    if(prchecking_lqc_arr[prchecking_lqc_index] == 1){
                                        $('.prod_req_checking_data[index="3.'+prchecking_lqc_index+'"]').prop('checked', true);
                                    }else{
                                        $('.prod_req_checking_data[index="3.'+prchecking_lqc_index+'"]').prop('checked', false);
                                    }
                                    if(prchecking_lqc_index == 10 || prchecking_lqc_index == 11){
                                        if(prchecking_lqc_arr[prchecking_lqc_index] == 1){
                                            $('.prod_req_checking_data[index="3.'+prchecking_lqc_index+'"][value="1"]').prop('checked', true);
                                        }else if(prchecking_lqc_arr[prchecking_lqc_index] == 0){
                                            $('.prod_req_checking_data[index="3.'+prchecking_lqc_index+'"][value="0"]').prop('checked', true);
                                        }else{
                                            $('.prod_req_checking_data[index="3.'+prchecking_lqc_index+'"]').prop('checked', false);
                                        }
                                    }
                                    prchecking_lqc_index++;
                                }

                                $("#frm_txt_lqc_material_drawing_no").val(prod_req_details[index].material_drawing_no);
                                $("#frm_txt_lqc_material_rev_no").val(prod_req_details[index].material_rev_no);
                                $("#frm_txt_lqc_insp_guide_drawing_no").val(prod_req_details[index].insp_guide_drawing_no);
                                $("#frm_txt_lqc_insp_guide_rev_no").val(prod_req_details[index].insp_guide_rev_no);
                                $("#selQcVisualUser").val(prod_req_details[index].visual_insp_name);
                                $("#selQcDimensionUser").val(prod_req_details[index].dimension_insp_name);
                                $("#frm_txt_lqc_visual_insp_datetime").val(prod_req_details[index].visual_insp_datetime);
                                $("#frm_txt_lqc_dimension_insp_datetime").val(prod_req_details[index].dimension_insp_datetime);
                                $("#frm_txt_lqc_actual_checking_remarks").val(prod_req_details[index].actual_checking_remarks);

                            }else if(prod_req_details[index].process_category == 4){// PROCESS ENGR
                                prchecking_process_engr_arr.push(
                                    prod_req_details[index].eval_sample,
                                    prod_req_details[index].japan_sample,
                                    prod_req_details[index].last_prodn_sample,
                                    prod_req_details[index].material_drawing,
                                    prod_req_details[index].insp_guide,
                                    prod_req_details[index].dieset_eval_report,
                                    prod_req_details[index].cosmetic_defect,
                                    prod_req_details[index].pingauges,
                                    prod_req_details[index].measurescope,
                                    prod_req_details[index].n_a,
                                    prod_req_details[index].visual_insp_result,
                                    prod_req_details[index].dimension_insp_result
                                );

                                let prchecking_process_engr_index = 0;
                                while(prchecking_process_engr_index < prchecking_process_engr_arr.length){
                                    if(prchecking_process_engr_arr[prchecking_process_engr_index] == 1){
                                        $('.prod_req_checking_data[index="4.'+prchecking_process_engr_index+'"]').prop('checked', true);
                                    }else{
                                        $('.prod_req_checking_data[index="4.'+prchecking_process_engr_index+'"]').prop('checked', false);
                                    }
                                    if(prchecking_process_engr_index == 10 || prchecking_process_engr_index == 11){
                                        if(prchecking_process_engr_arr[prchecking_process_engr_index] == 1){
                                            $('.prod_req_checking_data[index="4.'+prchecking_process_engr_index+'"][value="1"]').prop('checked', true);
                                        }else if(prchecking_process_engr_arr[prchecking_process_engr_index] == 0){
                                            $('.prod_req_checking_data[index="4.'+prchecking_process_engr_index+'"][value="0"]').prop('checked', true);
                                        }else{
                                            $('.prod_req_checking_data[index="4.'+prchecking_process_engr_index+'"]').prop('checked', false);
                                        }
                                    }
                                    prchecking_process_engr_index++;
                                }

                                $("#frm_txt_process_engr_material_drawing_no").val(prod_req_details[index].material_drawing_no);
                                $("#frm_txt_process_engr_material_rev_no").val(prod_req_details[index].material_rev_no);
                                $("#frm_txt_process_engr_insp_guide_drawing_no").val(prod_req_details[index].insp_guide_drawing_no);
                                $("#frm_txt_process_engr_insp_guide_rev_no").val(prod_req_details[index].insp_guide_rev_no);
                                $("#selEngrVisualUser").val(prod_req_details[index].visual_insp_name);
                                $("#selEngrDimensionUser").val(prod_req_details[index].dimension_insp_name);
                                $("#frm_txt_process_engr_visual_insp_datetime").val(prod_req_details[index].visual_insp_datetime);
                                $("#frm_txt_process_engr_dimension_insp_datetime").val(prod_req_details[index].dimension_insp_datetime);
                                $("#frm_txt_process_engr_actual_checking_remarks").val(prod_req_details[index].actual_checking_remarks);
                            }
                        }
                    }

                    if(machine_param_checking_details != ''){
                        let machine_param_checking_arr  = [];

                        switch(machine_param_checking_details[0].reference){
                            case 1: $('.machine_param_checking_data[name="machine_param_chckng_ref"][value="1"]').prop('checked', true); break;
                            case 2: $('.machine_param_checking_data[name="machine_param_chckng_ref"][value="2"]').prop('checked', true); break;
                            default: $('.machine_param_checking_data[name="machine_param_chckng_ref"]').prop('checked', false); break;
                        }

                        machine_param_checking_arr.push(machine_param_checking_details[0].pressure_engr_result,
                                                        machine_param_checking_details[0].pressure_qc_result,
                                                        machine_param_checking_details[0].temp_nozzle_engr_result,
                                                        machine_param_checking_details[0].temp_nozzle_qc_result,
                                                        machine_param_checking_details[0].temp_mold_engr_result,
                                                        machine_param_checking_details[0].temp_mold_qc_result,
                                                        machine_param_checking_details[0].cooling_time_engr_result,
                                                        machine_param_checking_details[0].cooling_time_qc_result,
                            );

                            let machine_param_checking_arr_index = 0;
                            while(machine_param_checking_arr_index < machine_param_checking_arr.length){
                                if(machine_param_checking_arr[machine_param_checking_arr_index] == 0){
                                    $('.machine_param_checking_data[index="6.'+machine_param_checking_arr_index+'"][value="0"]').prop('checked', true);
                                }else if(machine_param_checking_arr[machine_param_checking_arr_index] == 1){
                                    $('.machine_param_checking_data[index="6.'+machine_param_checking_arr_index+'"][value="1"]').prop('checked', true);
                                }
                                else{
                                    $('.machine_param_checking_data[index="6.'+machine_param_checking_arr_index+'"]').prop('checked', false);
                                }
                                machine_param_checking_arr_index++;
                            }

                        $("#selPressureEngrUser").val(machine_param_checking_details[0].pressure_engr_name);
                        $("#selPressureQCUser").val(machine_param_checking_details[0].pressure_qc_name);

                        $("#selTempNozzleEngrUser").val(machine_param_checking_details[0].temp_nozzle_engr_name);
                        $("#selTempNozzleQCUser").val(machine_param_checking_details[0].temp_nozzle_qc_name);

                        $("#selTempMoldEngrUser").val(machine_param_checking_details[0].temp_mold_engr_name);
                        $("#selTempMoldQCUser").val(machine_param_checking_details[0].temp_mold_qc_name);

                        $("#selCtimeEngrUser").val(machine_param_checking_details[0].cooling_time_engr_name);
                        $("#selCtimeQCUser").val(machine_param_checking_details[0].cooling_time_qc_name);

                        $("#frm_txt_pressure_std_specs").val(machine_param_checking_details[0].pressure_engr_std_specs);
                        $("#frm_txt_pressure_engr_actual").val(machine_param_checking_details[0].pressure_engr_actual);
                        $("#frm_txt_pressure_engr_date").val(machine_param_checking_details[0].pressure_engr_date);
                        $("#frm_txt_pressure_qc_actual").val(machine_param_checking_details[0].pressure_qc_actual);
                        $("#frm_txt_pressure_qc_date").val(machine_param_checking_details[0].pressure_qc_date);

                        $("#frm_txt_temp_nozzle_std_specs").val(machine_param_checking_details[0].temp_nozzle_engr_std_specs);
                        $("#frm_txt_temp_nozzle_engr_actual").val(machine_param_checking_details[0].temp_nozzle_engr_actual);
                        $("#frm_txt_temp_nozzle_engr_date").val(machine_param_checking_details[0].temp_nozzle_engr_date);
                        $("#frm_txt_temp_nozzle_qc_actual").val(machine_param_checking_details[0].temp_nozzle_qc_actual);
                        $("#frm_txt_temp_nozzle_qc_date").val(machine_param_checking_details[0].temp_nozzle_qc_date);

                        $("#frm_txt_temp_mold_std_specs").val(machine_param_checking_details[0].temp_mold_engr_std_specs);
                        $("#frm_txt_temp_mold_engr_actual").val(machine_param_checking_details[0].temp_mold_engr_actual);
                        $("#frm_txt_temp_mold_engr_date").val(machine_param_checking_details[0].temp_mold_engr_date);
                        $("#frm_txt_temp_mold_qc_actual").val(machine_param_checking_details[0].temp_mold_qc_actual);
                        $("#frm_txt_temp_mold_qc_date").val(machine_param_checking_details[0].temp_mold_qc_date);

                        $("#frm_txt_ctime_std_specs").val(machine_param_checking_details[0].cooling_time_engr_std_specs);
                        $("#frm_txt_ctime_engr_actual").val(machine_param_checking_details[0].cooling_time_engr_actual);
                        $("#frm_txt_ctime_engr_date").val(machine_param_checking_details[0].cooling_time_engr_date);
                        $("#frm_txt_ctime_qc_actual").val(machine_param_checking_details[0].cooling_time_qc_actual);
                        $("#frm_txt_ctime_qc_date").val(machine_param_checking_details[0].cooling_time_qc_date);
                    }

                    if(specification_details != ''){
                        let specification_arr  = [];

                        specification_arr.push(specification_details[0].ng_issued_ptnr,
                                                        specification_details[0].ng_coordinate_to_ts_cn_assembly,
                                                        specification_details[0].ng_discussion_w_tech_adviser,
                                                        specification_details[0].ng_go_production,
                                                        specification_details[0].ng_stop_production,
                                                        specification_details[0].ok_go_production,
                                                        specification_details[0].engr_head_go_production,
                                                        specification_details[0].engr_head_stop_production,
                            );

                            let specification_arr_index = 0;
                            while(specification_arr_index < specification_arr.length){
                                if(specification_arr[specification_arr_index] == 1){
                                    $('.specification_data[index="7.'+specification_arr_index+'"]').prop('checked', true);
                                }else{
                                    $('.specification_data[index="7.'+specification_arr_index+'"]').prop('checked', false);
                                }
                                specification_arr_index++;
                            }

                        // $("#frm_txt_ng_judged_by_id").val(specification_details[0].ng_judged_by.id);
                        // $("#frm_txt_ng_judged_by").val(specification_details[0].ng_judged_by.full_name);

                        // $("#frm_txt_ok_verified_by_id").val(specification_details[0].ok_verified_by.id);
                        // $("#frm_txt_ok_verified_by").val(specification_details[0].ok_verified_by.full_name);

                        // $("#frm_txt_signed_id").val(specification_details[0].signed.id);
                        // $("#frm_txt_signed").val(specification_details[0].signed.full_name);

                        $("#selNgJudgedBy").val(specification_details[0].ng_judged_by);
                        $("#selOkVerifiedBy").val(specification_details[0].ok_verified_by);
                        $("#selSignedBy").val(specification_details[0].signed);

                        $("#frm_txt_ng_datetime").val(specification_details[0].ng_datetime);
                        $("#frm_txt_ok_datetime").val(specification_details[0].ok_datetime);
                        $("#frm_txt_remarks").val(specification_details[0].remarks);
                        $("#frm_txt_engr_head_datetime").val(specification_details[0].engr_head_datetime);
                    }

                    if(completion_activity_details != ''){
                        let completion_arr  = [];

                        completion_arr.push(completion_activity_details[0].finished_po,
                                            completion_activity_details[0].sample_attachment,
                                            completion_activity_details[0].with_po_received,
                                            completion_activity_details[0].illustration_attachment,
                                            completion_activity_details[0].po_not_yet_finished,
                                            completion_activity_details[0].for_repair,
                                            completion_activity_details[0].mold_checking,
                                            completion_activity_details[0].mold_clean,
                                            completion_activity_details[0].with_produce_unit,
                                            completion_activity_details[0].without_produce_unit,
                            );

                            let completion_arr_index = 0;
                            while(completion_arr_index < completion_arr.length){
                                if(completion_arr[completion_arr_index] == 1){
                                    $('.completion_activity[index="8.'+completion_arr_index+'"]').prop('checked', true);
                                }else{
                                    $('.completion_activity[index="8.'+completion_arr_index+'"]').prop('checked', false);
                                }
                                completion_arr_index++;
                            }

                        $("#frm_txt_trouble_content").val(completion_activity_details[0].trouble_content);
                        $("#frm_txt_illustration").val(completion_activity_details[0].illustration);
                        $("#frm_txt_completion_remarks").val(completion_activity_details[0].remarks);

                        $("#SelPreparedBy").val(completion_activity_details[0].prepared_by);
                        $("#SelCheckedBy").val(completion_activity_details[0].checked_by);

                        $("#frm_txt_stop_prod_date").val(completion_activity_details[0].date);
                        $("#frm_txt_stop_prod_time").val(completion_activity_details[0].time);

                        $("#frm_txt_shots").val(completion_activity_details[0].shots);
                        $("#frm_txt_shots_accume").val(completion_activity_details[0].shot_accume);
                        $("#frm_txt_maint_cycle").val(completion_activity_details[0].maintenance_cycle);
                        $("#frm_txt_machine_no").val(completion_activity_details[0].maintenance_no);

                        $("#frm_txt_date_needed").val(completion_activity_details[0].date_needed);
                        $("#frm_txt_ship_sched").val(completion_activity_details[0].ship_sched);
                        $("#frm_txt_ptnr_ctrl_no").val(completion_activity_details[0].ptnr_ctrl_no);

                        $("#frm_txt_affected_lot").val(completion_activity_details[0].affected_lot);
                        $("#frm_txt_affected_lot_qty").val(completion_activity_details[0].affected_lot_qty);
                        $("#frm_txt_backtracking_lot").val(completion_activity_details[0].backtracking_lot);
                        $("#frm_txt_backtracking_lot_qty").val(completion_activity_details[0].backtracking_lot_qty);
                    }
                $('#modalProdIdentification').modal('show');
        },
        error: function(data, xhr, status){
            toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
        }
    });
}

function UpdateStatusOfDiesetRequest(_token, id, process_status){
    $.ajax({
        url: "update_status_of_dieset_request",
        method: "post",
        data: {
            '_token' : _token,
            'request_id' : id,
            'process_status' : process_status,
        },
        dataType: "json",
        success: function (response) {
            let result = response['result'];
            if (result == 'Successful') {
                dataTableDmrpqc.draw();
                toastr.success('Successful!');
                $("#modalChangeStatusRequest").modal('hide');
            }else if(result == 'Duplicate'){
                toastr.error('Request Already Submitted!');
            }else if(result == 'Session Expired') {
                toastr.error('Session Expired!, Please Log-in again');
            }else if(result == 'Error'){
                toastr.error('Error!, Please Contanct ISS Local 208');
            }else{
                toastr.error('Unknown Result');
            }
        }
    });
}

function DeleteRequest(){
    $.ajax({
        url: "delete_request",
        method: "post",
        data: $('#FrmDeleteRequest').serialize(),
        dataType: "json",
        beforeSend: function () {
            $("#deactivateIcon").addClass('fa fa-spinner fa-pulse');
            $("#btnDeleteRequest").prop('disabled', 'disabled');
        },
        success: function (response) {
            let result = response['result'];
            if (result == 1) {
                dataTableDmrpqc.draw();
                $("#modalDeleteRequest").modal('hide');
                toastr.success('Request successfully deleted!');
            }
            else {
                toastr.warning('Request already deleted!');
            }

            $("#deactivateIcon").removeClass('fa fa-spinner fa-pulse');
            $("#btnDeleteRequest").removeAttr('disabled');
            $("#deactivateIcon").addClass('fa fa-check');
        },
        error: function (data, xhr, status) {
            toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
            $("#deactivateIcon").removeClass('fa fa-spinner fa-pulse');
            $("#btnDeleteRequest").removeAttr('disabled');
            $("#deactivateIcon").addClass('fa fa-check');
        }
    });
}
