//kiểm tra link youtube (đoạn này e coppy trên mạng)
//trả về null nếu không phải là link youtube
//trả về link và id nếu là link youtube
const youtube_regex = /^.*((m\.)?youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|\&vi?=)([^#\&\?]*).*/

$("#dangtin").submit(function(e){
    //chống load trang
    e.preventDefault();
    //thấy thông tin từ trên form
    var noidung = $("#noidung_dangtin").val();
    var hinhanh = $('#hinhanh_dangtin')[0].files;
    var idVideoYoutube = "";
    //chứa dữ liệu gửi lên server bằng ajax
    var dataform = new FormData();

    //Những thông báo lỗi trong quá trình đăng tin sẽ lưu trong biến loidangtin
    var loidangtin = "";
    
    if(hinhanh.length == 0 && noidung == ""){
        //Lỗi không có cả nội dung và hình ảnh khi đăng tin
        //cập  nhật trạng thái mới
        loidangtin = "Vui lòng nhập nôi dung hoặc hình ảnh để cập nhật trạng thái mới của bạn"
    }else{
    //Nếu bài đăng có nội dung thì kiểm tra trong nội dung có link youtube không
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
    ///
    if(hinhanh.length > 0){
        for(let i = 0; i<hinhanh.length; i++){
            var name = document.getElementById("hinhanh_dangtin").files[i].name;
            var ext = name.split('.').pop().toLowerCase();
            if(jQuery.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1){
                loidangtin = "Ảnh không đúng định dạng!";
            }else{
                dataform.append("hinhanh[]", document.getElementById("hinhanh_dangtin").files[i]);
            }
        }
    }
    }

    //
    if(loidangtin == ""){
    dataform.append("noidung", noidung);
    dataform.append("idVideoYoutube", idVideoYoutube)
    $.ajax({
            type: 'POST',
            url: '/sinhviendangbaiviet',
            cache: false,
            contentType: false,
            processData: false,
            data: dataform,
            success: function(data) {
                $("#noidung_dangtin").val("");
                $('#hinhanh_dangtin').val("");
                $('#hientintuc').prepend(data)
            },
            error: function() {
                alert("Đăng tin không thành công");
            }

        })
    }else{
        alert(loidangtin)
    }
})