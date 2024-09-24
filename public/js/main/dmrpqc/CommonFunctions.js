function ProcessStatusDivControls(process_status = null){
    frmProdIdentification.find('.Part2, .Part3, .Part4, .Part5, .Part6, .Part7, .Part8').prop('hidden', true); //hide
    frmProdIdentification.find('#collapseTwo, #collapseThree, #collapseFour, #collapseFive, #collapseSix, #collapseSeven, #collapseEight').removeClass('show'); //collapse div

    if(process_status == 2){
        frmProdIdentification.find('.Part2, .Part3').prop('hidden', false); //show
        frmProdIdentification.find('#collapseTwo, #collapseThree').addClass('show'); //show div
    }else if(process_status == 4){
        frmProdIdentification.find('.Part2, .Part3, .Part4').prop('hidden', false); //show
        frmProdIdentification.find('#collapseFour').addClass('show'); //show div
    }else if(process_status == 5){
        frmProdIdentification.find('.Part2, .Part3, .Part4, .Part5').prop('hidden', false); //show
        frmProdIdentification.find('#collapseFive').addClass('show'); //show div
    }else if(process_status == 6){
        frmProdIdentification.find('.Part2, .Part3, .Part4, .Part5, .Part6').prop('hidden', false); //show
        frmProdIdentification.find('#collapseSix').addClass('show'); //show div
    }else if(process_status == 7){
        frmProdIdentification.find('.Part2, .Part3, .Part4, .Part5, .Part6, .Part7').prop('hidden', false); //show
        frmProdIdentification.find('#collapseSeven').addClass('show'); //show div
    }else if(process_status == 8){
        frmProdIdentification.find('.Part2, .Part3, .Part4, .Part5, .Part6, .Part7, .Part8').prop('hidden', false); //show
        frmProdIdentification.find('#collapseEight').addClass('show'); //show div
    }else if(process_status == 9){
        frmProdIdentification.find('.Part1, .Part2, .Part3, .Part4, .Part5, .Part6, .Part7, .Part8').prop('hidden', false); //show
        frmProdIdentification.find('#collapseOne').addClass('show'); //show div
    }
}
