$('.xoathongbao').click(e => {
    e.preventDefault()
    let idthongbao = e.target.dataset.idthongbao
    let tieude = e.target.dataset.tieude
    $('#xoathongbao .xacnhanxoathongbao').attr('data-idthongbao', idthongbao)

})

$('.xacnhanxoathongbao').click(e => {
    e.preventDefault()
    let idthongbao = e.target.dataset.idthongbao;

    var dataform = new FormData();
        dataform.append("idthongbao", idthongbao);
        $.ajax({
            type: 'POST',
            url: '/xoathongbao',
            cache: false,
            contentType: false,
            processData: false,
            data: dataform,
            success: function(data) {
                if (data == "thanhcong") {
                    $('#xoathongbao').modal('hide')
                    $(`div#thongbao${idthongbao}`).remove();
                } else {
                    alert('Xoá thông báo không thành công')
                    $('#xoathongbao').modal('hide')
                }
            },
            error: function() {
                console.log('Xoá thông báo không thành công')
            }
        })
})