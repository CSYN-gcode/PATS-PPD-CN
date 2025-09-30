$(document).ready(function (){
    $('#frm_txt_po_no').keypress(function(e){
        //po_modify- drawing
        if(e.keyCode == 13){
            var po_number = $(this).val();
            let factory_category = $('#factorySelect').val();
            if(po_number == "" || po_number == null ){
                toastr.warning('PO not found!'); //po_modify - clickbutton
            }else{
                $('#frm_txt_item_code').val('');
                $('#frm_txt_device_name').val('');
                $('#frm_txt_po_number').val('');
                $('#frm_txt_die_no').val('');
                $('#frm_txt_drawing_no').val('');
                $('#frm_txt_rev_no').val('');

                $("#frm_txt_prev_shots").val('');
                $("#frm_txt_prev_shot_accum").val('');
                $("#frm_txt_prev_maint_cycle").val('');
                $("#frm_txt_prev_machine_no").val('');

                $(this).val('');
                $(this).focus();

                GetPPSDBDataByItemCode(po_number, factory_category);
            }
        }
    });
});

function GetPPSDBDataByItemCode(po_number, factory_category){
    $.ajax({
        url: "get_pps_db_data_by_item_code",
        method: "get",
        data: {
            po_number : po_number,
            factory_category: factory_category
        },
        // data: $('#ReceiveStratPOMaterialIssuanceForm').serialize(),
        dataType: "json",
        success: function(response){
            if (response['result'] == '1') {
                toastr.error('Error, Wrong PO Number');
            }else if(response['result'] == '2'){
                toastr.warning('Device Name is not found in DMCMSV2, please add device first.');
            }else{
                // let pps_details = response['pps_db_details'];
                let pps_db_data = response['pps_db_details'][0];
                let device_details = response['device_details'];
                let shots_details = response['shots_details'];
                let shots_accum = response['shots_accum'][0];

                $("#frm_txt_device_name").val(pps_db_data.part_name);
                $("#frm_txt_po_no").val(pps_db_data.po_number);
                $("#frm_txt_item_code").val(pps_db_data.part_code);
                $("#frm_txt_die_no").val(pps_db_data.die_no);
                $("#frm_txt_drawing_no").val(pps_db_data.drawing_no);
                $("#frm_txt_rev_no").val(pps_db_data.drawing_rev);

                $("#frm_txt_prev_shots").val(shots_details.s_count);
                $("#frm_txt_prev_shot_accum").val(shots_details.ttl_accum_shots);
                $("#frm_txt_prev_maint_cycle").val(device_details.dc_maintenance_cycle);
                $("#frm_txt_prev_machine_no").val(shots_details.s_machine);
            }
        }
    });
}

function ProductIdentificatioViewingMode(){
    //Part 1 Disable Buttons
    $("#frm_txt_po_no").attr('disabled', true);
    $("#frm_request_type").attr('disabled', true);
    $("#frm_prod_identification")[0].reset();
}
