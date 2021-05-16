$('.xoabaiviet').click(e => {
    e.preventDefault()
    let mabaiviet = e.target.dataset.mabaiviet
    //gán data id của bài viết cho nút xác nhâp xoá bài viết
    $('#xoabaivietmodal .xacnhanxoabaiviet').attr('data-mabaiviet', mabaiviet)
})


$('#xoabaivietmodal .xacnhanxoabaiviet').click(e => {
    let mabaiviet = e.target.dataset.mabaiviet
    $('#xoabaivietmodal').modal('hide')

    var dataform = new FormData();
    dataform.append("mabaiviet", mabaiviet);
    $.ajax({
        type: 'POST',
        url: '/xoabaiviet',
        cache: false,
        contentType: false,
        processData: false,
        data: dataform,
        success: function(data) {
            if (data) {
                $(`div#${mabaiviet}`).remove()
            } else {
                alert('Xoá bài viết không thành công')
            }
        },
        error: function() {
            console.log('Xoá bình luận không thành công')
        }
    })
})