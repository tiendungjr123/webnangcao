$('.chinhsuathongbao').click(e => {
    e.preventDefault()
    let idthongbao = e.target.dataset.idthongbao
    let tieude = e.target.dataset.tieude
    let noidung = e.target.dataset.noidung

    
    $('#chinhsuathongbao .tieude').val(tieude)
    $('#chinhsuathongbao .noidung').val(noidung)
    $('#chinhsuathongbao .idthongbao').val(idthongbao)
})

$('.xacnhanchinhsuathongbao').click(e => {
    var idthongbao = $("#idthongbao").val();
    var tieude = $("#tieude").val();
    var noidung = $("#noidung").val();

    var dataform = new FormData();
        dataform.append("idthongbao", idthongbao);
        dataform.append("tieude", tieude);
        dataform.append("noidung", noidung);
        $.ajax({
            type: 'POST',
            url: '/chinhsuathongbao',
            cache: false,
            contentType: false,
            processData: false,
            data: dataform,
            success: function(data) {
                if (data) {
                    alert('Chỉnh sửa thông báo thành công')
                    $('#chinhsuathongbao').modal('hide')
                } else {
                    alert('Chỉnh sửa thông báo không thành công')
                }
            },
            error: function() {
                console.log('Chỉnh sửa thông báo không thành công')
            }
        })
})
