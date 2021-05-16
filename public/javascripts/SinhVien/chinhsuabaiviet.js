
$('.chinhsuabaiviet').click(e => {
    e.preventDefault()
    let mabaiviet = e.target.dataset.mabaiviet
    let noidungbaiviet = e.target.dataset.noidungbaiviet
    
    $('#chinhsuabaivietmodal .noidungbaiviet').val(noidungbaiviet)
    //gán data id của bài viết cho nút xác nhâp xoá bài viết
    $('#chinhsuabaivietmodal .xacnhanchinhsuabaiviet').attr('data-mabaiviet', mabaiviet)
    $('#chinhsuabaivietmodal .xacnhanchinhsuabaiviet').attr('data-noidungbaiviet', noidungbaiviet)
})
$('#chinhsuabaivietmodal .xacnhanchinhsuabaiviet').click(e => {
    let mabaiviet = e.target.dataset.mabaiviet
    let noidungbaiviet = e.target.dataset.noidungbaiviet
    $('#chinhsuabaivietmodal').modal('hide')
   
    let noidung = $('#chinhsuabaivietmodal .noidungbaiviet').val()
    
    if(noidungbaiviet == noidung){
        alert("Vui lòng thay đổi nội dung bài viết trước khi xác nhận")
    }else{
        const youtube_regex = /^.*((m\.)?youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|\&vi?=)([^#\&\?]*).*/
        let idVideoYoutube = "";
        if(noidung != ""){
            var noidungtungdong = noidung.split("\n");
            noidungtungdong.forEach(element_dong => {
                //tách nôi dung thành từng chuỗi cách nhau bởi khoảng trắng
                var noidung_tmp = element_dong.split(" ");
                //chạy vòng lặp để kiểm tra chuỗi có phải là link youtube không
                noidung_tmp.forEach(element => {
                    //link youtube thường ko ngắn hơn 15 kí tự, nên chỉ ktra những chuỗi có từ 15 kí tự trở lên
                    if(element.length > 15){
                        var linkyoutube = element.match(youtube_regex);
                        if(linkyoutube != null){
    
                            //nếu đúng thì linkyoutube trả về mãng 4 phần tử
                            // 0 là full link
                            // 1 ...
                            // 2 ...
                            // 3 là id video có trong link 
                            //ở đây mình chỉ cần dùng id
                            idVideoYoutube = linkyoutube[3];
                        }
                    }
                });
            })
        }
        var dataform = new FormData();
        dataform.append("mabaiviet", mabaiviet);
        dataform.append("noidungbaiviet", noidung);
        dataform.append("idVideoYoutube", idVideoYoutube);
        $.ajax({
            type: 'POST',
            url: '/chinhsuabaiviet',
            cache: false,
            contentType: false,
            processData: false,
            data: dataform,
            success: function(data) {
                if (data) {
                    $(`div#${mabaiviet}`).html(data);
                } else {
                    alert('Chỉnh sửa bài viết không thành công')
                }
            },
            error: function() {
                console.log('Chỉnh sửa bài viết không thành công')
            }
        })
    }
    
})