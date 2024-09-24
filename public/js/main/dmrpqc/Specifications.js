function UpdateSpecifications(request_id, process_status, user_id, _token){
    // let _token = "{{ csrf_token() }}";
    var data = $.param({ _token, request_id, process_status, user_id}) + '&' + $('.specification_data').serialize();
    console.log(data);

    $.ajax({
        url: "update_specifications_data",
        method: "post",
        // _token: _token,
        data: data,
        dataType: "json",
        beforeSend: function(){
        },
        success: function(JsonObject){
            if(JsonObject['error'] == "Please Select Action Done"){
                // console.log(JsonObject['error']);
                toastr.error('Please Select Action Done');
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
            }else{
                toastr.error('Saving Failed! Please check all fields. Put N/A if not applicable. Check all radio button.');
            }
            dataTableDmrpqc.draw();
        },
        error: function(data, xhr, status){
            toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
        }
    });
}

function SpecificationEdittingMode(){
    $("#tblSpecificationsNGResult .specification_data").attr('disabled', false);
    $("#tblSpecificationsOKResult .specification_data").attr('disabled', false);
    $("#tblEngrHeadConformance .specification_data").attr('disabled', false);
}

function SpecificationViewingMode(){
    $("#tblSpecificationsNGResult .specification_data").attr('disabled', true);
    $("#tblSpecificationsOKResult .specification_data").attr('disabled', true);
    $("#tblEngrHeadConformance .specification_data").attr('disabled', true);
}
