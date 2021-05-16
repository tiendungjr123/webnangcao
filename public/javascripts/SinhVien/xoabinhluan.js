$('.xoabinhluan').click(e => {
    e.preventDefault()
    let mabinhluan = e.target.dataset.mabinhluan
    
    //gán data id của bài viết cho nút xác nhâp xoá bình luận
    $('#xoabinhluanmodal .xacnhanxoabinhluan').attr('data-mabinhluan', mabinhluan)
})

$('#xoabinhluanmodal .xacnhanxoabinhluan').click(e => {
    let mabinhluan = e.target.dataset.mabinhluan
    $('#xoabinhluanmodal').modal('hide')

    var dataform = new FormData();
    dataform.append("mabinhluan", mabinhluan);
    $.ajax({
        type: 'POST',
        url: '/xoabinhluan',
        cache: false,
        contentType: false,
        processData: false,
        data: dataform,
        success: function(data) {
            if (data) {
                $(`div#${mabinhluan}`).remove()
            } else {
                alert('Xoá bài viết không thành công')
            }
        },
        error: function() {
            console.log('Xoá bình luận không thành công')
        }
    })

})