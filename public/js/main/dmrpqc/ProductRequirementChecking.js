$(document).ready(function () {
    $('#frm_txt_engr_head_go_production').click(function(){
        $('#frm_txt_engr_head_stop_production').prop('checked', false);
    });

    $('#frm_txt_engr_head_stop_production').click(function(){
        $('#frm_txt_engr_head_go_production').prop('checked', false);
    });
});

function UpdateProdReqCheckingData(request_id, process_status, user_id, _token){
    // let _token = "{{ csrf_token() }}";
    var data = $.param({ _token, request_id, process_status, user_id}) + '&' + $('.prod_req_checking_data').serialize() + '&' + $('.machine_setup_sample_data').serialize();
    console.log(data);

    $.ajax({
        url: "update_product_req_checking_data",
        method: "post",
        data: data,
        dataType: "json",
        beforeSend: function(){
        },
        success: function(JsonObject){
            if(JsonObject['error'] == "Please Select Action Done"){
                // console.log(JsonObject['error']);
                toastr.error('Please Select Action Done');
                ActionDonePartsNoArr  = [];
                ActionDoneQuantityArr = [];
            }else if(JsonObject['result'] == 'Success'){
                $("#modalProdIdentification").modal('hide');
                $("#frm_prod_identification")[0].reset();
                frmProdIdentification.find('input').removeClass('is-invalid');
                frmProdIdentification.find('input').attr('title','');
                frmProdIdentification.find('select').removeClass('is-invalid');
                frmProdIdentification.find('select').attr('title','');
                toastr.success('New Request was succesfully saved!');
            }else if(JsonObject['result'] == 2){
                toastr.error('Saving Failed! Item Code Still Ongoing Preparation');
                ActionDonePartsNoArr  = [];
                ActionDoneQuantityArr = [];
            }
            else{
                toastr.error('Saving Failed! Please check all fields. Put N/A if not applicable. Check all radio button.');
                ActionDonePartsNoArr  = [];
                ActionDoneQuantityArr = [];
            }
            dataTableDmrpqc.draw();
        },
        error: function(data, xhr, status){
            toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
        }
    });
}

function ProdReqCheckingEdittingMode(data){
    $.ajax({
        url: "get_dmrpqc_details_id",
        method: "get",
        data: data,
        dataType: "json",
        beforeSend(){
            $("#tblProdReqProduction .prod_req_checking_data").attr('disabled', true);
            $("#tblProdReqEngr .prod_req_checking_data").attr('disabled', true);
            $("#tblProdReqQC .prod_req_checking_data").attr('disabled', true);
            $("#tblProdReqProcessEngr .prod_req_checking_data").attr('disabled', true);
            $("#tbl_machine_samples .machine_setup_sample_data").attr('disabled', true);
        },
        success: function(response){
            let prod_req_checking_data = response['product_req_checking_details'];
            console.log('p5', prod_req_checking_data);
            if(prod_req_checking_data[0].status == 0){
                $("#tblProdReqProduction .prod_req_checking_data").attr('disabled', false);
                // $("#tblProdReqProduction .prod_req_checking_data").css("color", "");
                // $("#tblProdReqProduction .prod_req_checking_data").css("opacity", "");
            }else if(prod_req_checking_data[0].status == 1){
                $("#tblProdReqEngr .prod_req_checking_data").attr('disabled', false);
                // $("#tblProdReqEngr .prod_req_checking_data").css("color", "");
                // $("#tblProdReqEngr .prod_req_checking_data").css("opacity", "");
            }else if(prod_req_checking_data[0].status == 2){
                $("#tblProdReqQC .prod_req_checking_data").attr('disabled', false);
                // $("#tblProdReqQC .prod_req_checking_data").css("color", "");
                // $("#tblProdReqQC .prod_req_checking_data").css("opacity", "");
            }else if(prod_req_checking_data[0].status == 3){
                $("#tblProdReqProcessEngr .prod_req_checking_data").attr('disabled', false);
                // $("#tblProdReqProcessEngr .prod_req_checking_data").css("color", "");
                // $("#tblProdReqProcessEngr .prod_req_checking_data").css("opacity", "");
            }

            if(prod_req_checking_data[0].status <= 3){
                $("#tbl_machine_samples .machine_setup_sample_data").attr('disabled', false);
                // $("#tbl_machine_samples .machine_setup_sample_data").css("color", "");
                // $("#tbl_machine_samples .machine_setup_sample_data").css("opacity", "");
            }

            // $("#tblProdReqProduction .prod_req_checking_data").attr('disabled', false);
            // $("#tblProdReqEngr .prod_req_checking_data").attr('disabled', false);
            // $("#tblProdReqQC .prod_req_checking_data").attr('disabled', false);
            // $("#tblProdReqProcessEngr .prod_req_checking_data").attr('disabled', false);
        }
    });
}

function ProdReqCheckingViewingMode(){
    // $("#tblProdReqProduction .prod_req_checking_data").attr('disabled', true);
    // $("#tblProdReqProduction .prod_req_checking_data").css("color", "#6C757D");
    // $("#tblProdReqProduction .prod_req_checking_data").css("opacity", ".5");

    // $("#tblProdReqEngr .prod_req_checking_data").attr('disabled', true);
    // $("#tblProdReqEngr .prod_req_checking_data").css("color", "#6C757D");
    // $("#tblProdReqEngr .prod_req_checking_data").css("opacity", ".5");

    // $("#tblProdReqQC .prod_req_checking_data").attr('disabled', true);
    // $("#tblProdReqQC .prod_req_checking_data").css("color", "#6C757D");
    // $("#tblProdReqQC .prod_req_checking_data").css("opacity", ".5");

    // $("#tblProdReqProcessEngr .prod_req_checking_data").attr('disabled', true);
    // $("#tblProdReqProcessEngr .prod_req_checking_data").css("color", "#6C757D");
    // $("#tblProdReqProcessEngr .prod_req_checking_data").css("opacity", ".5");

    // $("#tbl_machine_samples .machine_setup_sample_data").attr('disabled', true);
    // $("#tbl_machine_samples .machine_setup_sample_data").css("color", "#6C757D");
    // $("#tbl_machine_samples .machine_setup_sample_data").css("opacity", ".5");

    $("#tblProdReqProduction .prod_req_checking_data").attr('disabled', true);
    $("#tblProdReqEngr .prod_req_checking_data").attr('disabled', true);
    $("#tblProdReqQC .prod_req_checking_data").attr('disabled', true);
    $("#tblProdReqProcessEngr .prod_req_checking_data").attr('disabled', true);
    $("#tbl_machine_samples .machine_setup_sample_data").attr('disabled', true);
}
