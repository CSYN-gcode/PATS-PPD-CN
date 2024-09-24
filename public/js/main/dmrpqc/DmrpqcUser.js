$(document).ready(function () {

    // PART 2 USER SELECTION
    GetSupervisorEngrUser(4, $("#selFabricatedBy")); //Internally Fabricated Parts(X) Fabricated By
    GetSupervisorEngrUser(4, $("#selValidatedBy")); //Internally Fabricated Parts(X) Validated By

    // PART 4 USER SELECTION
    GetProductionUsers(1, $("#selProductionUser")); //Machine Set-up 1st Adjustment (In-Charge)
    GetTechnicianUser(3, $("#selTechnicianUser")); //Machine Set-up 2md Adjustment (In-Charge)
    GetSupervisorEngrUser(4, $("#selSupervisorEngrUser")); //Machine Set-up 3rd Adjustment (In-Charge)

    // PART 5 USER SELECTION
    GetProductionUsers(1, $("#selProductionVisualUser")); // Production Visual Inspection
    GetProductionUsers(1, $("#selProductionDimentionUser")); // Production Dimension Inspection
    GetTechnicianUser(3, $("#selTechnicianVisualUser")); // Technician Visual Inspection
    GetTechnicianUser(3, $("#selTechnicianDimensionUser")); // Technician Dimension Inspection
    GetQcInspectorUser(5, $("#selQcVisualUser")); // QC Visual Inspection
    GetQcInspectorUser(5, $("#selQcDimensionUser")); // QC Dimension Inspection
    GetSupervisorEngrUser(4, $("#selEngrVisualUser")); // Process Engr Visual Inspection
    GetSupervisorEngrUser(4, $("#selEngrDimensionUser")); // Process Engr Dimension Inspection

    GetProductionUsers(1, $("#selMachineSetupSamplesPIC")); //For Machine Setup Sample (PIC)
    GetQcInspectorUser(5, $("#selMachineSetupSamplesQc")); //For Machine Setup Sample (QC)
    GetSupervisorEngrUser(4, $("#selMachineSetupSamplesEngr")); //For Machine Setup Sample (ENGR)

    GetSupervisorEngrUser(4, $("#selPressureEngrUser"));
    GetQcInspectorUser(5, $("#selPressureQCUser"));
    GetSupervisorEngrUser(4, $("#selTempNozzleEngrUser"));
    GetQcInspectorUser(5, $("#selTempNozzleQCUser"));
    GetSupervisorEngrUser(4, $("#selTempMoldEngrUser"));
    GetQcInspectorUser(5, $("#selTempMoldQCUser"));
    GetSupervisorEngrUser(4, $("#selCtimeEngrUser"));
    GetQcInspectorUser(5, $("#selCtimeQCUser"));

    // SAMPLE SELECTION ONLY *FOR REVISION
    GetProductionUsers(1, $("#selNgJudgedBy")); //For Specification (NG Judged By)
    GetQcInspectorUser(5, $("#selOkVerifiedBy")); //For Specification (OK Verified By)
    GetSupervisorEngrUser(4, $("#selSignedBy")); //For Specification (Signed By)

    // PART 8 USER SELECTION
    GetProductionUsers(1, $("#SelPreparedBy")); //For Specification (Prepared By)
    GetProductionUsers(1, $("#SelCheckedBy")); //For Specification (Checked By)
});

//============================== ADD USER ==============================
// function AddUser(){
// 	$.ajax({
//         url: "add_user",
//         method: "post",
//         data: $('#addUserForm').serialize(),
//         dataType: "json",
//         beforeSend: function () {
//             $("#btnAddUserIcon").addClass('fa fa-spinner fa-pulse');
//             $("#btnAddUser").prop('disabled', 'disabled');
//         },
//         success: function (response) {
//             if (response['validation'] == 'hasError') {
//                 if (response['error']['name'] === undefined) {
//                     $("#idname").removeClass('is-invalid');
//                     $("#idname").attr('title', '');
//                 }
//                 else {
//                     $("#idname").addClass('is-invalid');
//                     $("#idname").attr('title', response['error']['name']);
//                 }
//                 if (response['error']['userLevel'] === undefined) {
//                     $("#selUserLevelId").removeClass('is-invalid');
//                     $("#selUserLevelId").attr('title', '');
//                 }
//                 else {
//                     $("#selUserLevelId").addClass('is-invalid');
//                     $("#selUserLevelId").attr('title', response['error']['userLevel']);
//                 }
//                 toastr.error('Saving user failed!');
//             }
//             else if (response['result'] == 1) {
//                 $("#modalAddUser").modal('hide');
//                 dataTableusersTable.draw(); // reload the tables after insertion
//                 toastr.success('User added!');
//             }
//             else if (response['result'] == 0) {
//                 toastr.error('User already exists!');
//             }

//             $("#btnAddUserIcon").removeClass('fa fa-spinner fa-pulse');
//             $("#btnAddUser").removeAttr('disabled');
//             $("#btnAddUserIcon").addClass('fa fa-check');
//         },
//         error: function (data, xhr, status) {
//             toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
//             $("#btnAddUserIcon").removeClass('fa fa-spinner fa-pulse');
//             $("#btnAddUser").removeAttr('disabled');
//             $("#btnAddUserIcon").addClass('fa fa-check');
//         }
//     });
// }

//============================== DEACTIVATE USER ==============================
// function DeactivateUser() {
//     $.ajax({
//         url: "deactivate_user",
//         method: "post",
//         data: $('#deactivateUserForm').serialize(),
//         dataType: "json",
//         beforeSend: function () {
//             $("#deactivateIcon").addClass('fa fa-spinner fa-pulse');
//             $("#btnDeactivateUser").prop('disabled', 'disabled');
//         },
//         success: function (response) {
//             let result = response['result'];
//             if (result == 1) {
//                 dataTableusersTable.draw();
//                 $("#modalDeactivateUser").modal('hide');
//                 // $("#deactivateUserForm")[0].reset();
//                 toastr.success('User successfully deactivated!');
//             }
//             else {
//                 toastr.warning('User already deactivated!');
//             }

//             $("#deactivateIcon").removeClass('fa fa-spinner fa-pulse');
//             $("#btnDeactivateUser").removeAttr('disabled');
//             $("#deactivateIcon").addClass('fa fa-check');
//         },
//         error: function (data, xhr, status) {
//             toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
//             $("#deactivateIcon").removeClass('fa fa-spinner fa-pulse');
//             $("#btnDeactivateUser").removeAttr('disabled');
//             $("#deactivateIcon").addClass('fa fa-check');
//         }
//     });
// }

//============================== ACTIVATE USER ==============================
// function ActivateUser() {
//     $.ajax({
//         url: "activate_user",
//         method: "post",
//         data: $('#activateUserForm').serialize(),
//         dataType: "json",
//         beforeSend: function () {
//             $("#activateIcon").addClass('fa fa-spinner fa-pulse');
//             $("#btnActivateUser").prop('disabled', 'disabled');
//         },
//         success: function (response) {
//             let result = response['result'];
//             if (result == 1) {
//                 $("#modalActivateUser").modal('hide');
//                 // $("#activateUserForm")[0].reset();
//                 toastr.success('User successfully activated!');
//                 dataTableusersTable.draw();
//             }
//             else {
//                 toastr.warning('User already deactivated!');
//             }

//             $("#activateIcon").removeClass('fa fa-spinner fa-pulse');
//             $("#btnActivateUser").removeAttr('disabled');
//             $("#activateIcon").addClass('fa fa-check');
//         },
//         error: function (data, xhr, status) {
//             toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
//             $("#activateIcon").removeClass('fa fa-spinner fa-pulse');
//             $("#btnActivateUser").removeAttr('disabled');
//             $("#activateIcon").addClass('fa fa-check');
//         }
//     });
// }

//============================== GET USER ID ==============================
function GetUserId(userId) {
    $.ajax({
        url: "get_id_edit_user",
        method: "get",
        data: {
            user_id: userId
        },
        dataType: "json",
        beforeSend: function () {
            //GET DEFAULT SELECTED SECTION
            // $("#editUserForm select[id='selSection']").val('0');

            //GET DEFAULT SELECTED POSITION
            // $("#editUserForm select[id='selPosition']").val('0');
        },
        success: function (JsonObject) {
            // let userData = response['user_data'];
            if (JsonObject['user_data'].length > 0) {
                //GET RAPIDX ID
                $("#selEditUserAccessUserId").val(JsonObject['user_data'][0].rapidx_id);

                //GET SECTION
                var sec_array = ['BOD','IAS','FIN','HRD','ESS','LOG','FAC','ISS','QAD','EMS','TS','CN','YF','PPS','PPS-TS','PPS-CN'];
                for(var index = 0; index < sec_array.length; index++){
                    if(JsonObject['user_data'][0].section == (index + 1)){
                        // $("#txtEditUserSectionId").val(sec_array[index]);
                        // $("#selSection").val((index + 1));
                        $("#editUserForm select[id='selSection']").val((index + 1));

                    }
                }

                //GET POSITION
                var pos_array = ['POS 1','POS 2','POS 3','POS 4','POS 5'];
                for(var index = 0; index < pos_array.length; index++){
                    if(JsonObject['user_data'][0].position == (index + 1)){
                        // $("#txtEditUserPositionId").val(pos_array[index]);
                        $("#editUserForm select[id='selPosition']").val((index + 1));
                    }
                }

                // $("#selPosition").val(JsonObject['user_data'][0].position);
                //GET USERLEVEL ID
                $("#selEditUserLevelId").val(JsonObject['user_data'][0].user_level_id);
            }
            else {
                toastr.warning('No Record Found!');
            }
        },
        error: function (data, xhr, status) {
            toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
        }
    });
}

//============================== EDIT USER ==============================
// function EditUser(){
//     $.ajax({
//         url: "edit_user",
//         method: "post",
//         data: $('#editUserForm').serialize(),
//         dataType: "json",
//         beforeSend: function(){
//             $("#iBtnEditUserIcon").addClass('fa fa-spinner fa-pulse');
//             $("#btnEditUser").prop('disabled', 'disabled');
//         },
//         success: function(response){
//             if(response['validation'] == 'hasError'){
//                 toastr.error('Updating User Failed!');
//                 if(response['error']['name'] === undefined){
//                     $("#idname").removeClass('is-invalid');
//                     $("#idname").attr('title', '');
//                 }else{
//                     $("#idname").addClass('is-invalid');
//                     $("#idname").attr('title', response['error']['name']);
//                 }
//                 if(response['error']['userLevel'] === undefined){
//                     $("#selUserLevelId").removeClass('is-invalid');
//                     $("#selUserLevelId").attr('title', '');
//                 }else{
//                     $("#selUserLevelId").addClass('is-invalid');
//                     $("#selUserLevelId").attr('title', response['error']['userLevel']);
//                 }
//             }else{
//                 if(response['result'] == 1){
//                     $("#modalEditUser").modal('hide');
//                     $("#selEditUserLevel").select2('val', '0');

//                     dataTableusersTable.draw();
//                     toastr.success('User was succesfully updated!');
//                 }else if (response['result'] == 0) {
//                     toastr.error('User already exists!');
//                 }else{
//                     toastr.warning(response['tryCatchError'] + "<br>" +
//                     'Try Catch Error');
//                 }
//             }
//             $("#iBtnEditUserIcon").removeClass('fa fa-spinner fa-pulse');
//             $("#btnEditUser").removeAttr('disabled');
//             $("#iBtnEditUserIcon").addClass('fa fa-check');
//         },
//         error: function(data, xhr, status){
//             toastr.error('An error occured!\n' + 'Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
//             $("#iBtnEditUserIcon").removeClass('fa fa-spinner fa-pulse');
//             $("#btnEditUser").removeAttr('disabled');
//             $("#iBtnEditUserIcon").addClass('fa fa-check');
//         }
//     });
// }

//============================== GET USER BY POSITION ==============================
function GetProductionUsers(position, cboElement){
    GetUserByPosition(position, cboElement);
}

function GetTechnicianUser(position, cboElement){
    GetUserByPosition(position, cboElement);
}

function GetQcInspectorUser(position, cboElement){
    GetUserByPosition(position, cboElement);
}

function GetSupervisorEngrUser(position, cboElement){
    GetUserByPosition(position, cboElement);
}

function GetUserByPosition(position, cboElement){
    if(position == 1){
        let result = '<option value="" disabled selected>--Select Production--</option>';
    }else if(position == 3){
        let result = '<option value="" disabled selected>--Select Technician--</option>';
    }else if(position == 4){
        let result = '<option value="" disabled selected>--Select Supervisor/Engr.--</option>';
    }else if(position == 5){
        let result = '<option value="" disabled selected>--Select QC Inspector--</option>';
    }else{
        let result = '<option value="" disabled selected>--Select ISS--</option>';
    }

    $.ajax({
        url: 'get_users_by_position',
        method: 'get',
        data: {
            'position': position
        },
        dataType: 'json',
        beforeSend: function() {
                result = '<option value="0" disabled selected>--Loading--</option>';
                cboElement.html(result);
        },
        success: function(JsonObject) {
            if (JsonObject['users'].length > 0) {
                if(JsonObject['users'][0].position == 1){
                result = '<option value="" disabled selected>--Select Production--</option>';
                }else if(JsonObject['users'][0].position == 3){
                result = '<option value="" disabled selected>--Select Technician--</option>';
                }else if(JsonObject['users'][0].position == 4){
                result = '<option value="" disabled selected>--Select Supervisor/Engr.--</option>';
                }else if(JsonObject['users'][0].position == 5){
                result = '<option value="" disabled selected>--Select QC Inspector--</option>';
                }else{
                result = '<option value="" disabled selected>--Select ISS--</option>';
                }

                result += '<option value="N/A"> N/A </option>';
                // result = '<option value="" selected>-- N/A --</option>';
                for (let index = 0; index < JsonObject['users'].length; index++) {
                    result += '<option value="' + JsonObject['users'][index].id + '">' + JsonObject['users'][index].firstname+' '+JsonObject['users'][index].lastname + '</option>';
                }
            } else {
                result = '<option value="0" selected disabled> -- No record found -- </option>';
            }
            cboElement.html(result);
            // selUserPositionElement.select2();
        },
        error: function(data, xhr, status) {
            result = '<option value="0" selected disabled> -- Reload Again -- </option>';
            cboElement.html(result);
            console.log('Data: ' + data + "\n" + "XHR: " + xhr + "\n" + "Status: " + status);
        }
    });
}
