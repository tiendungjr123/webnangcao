$("#dangbinhluan<%= baiviet.mabaiviet %>").submit(function(e){
    //chống load trang
    e.preventDefault();
    var mabaiviet = $("#<%= baiviet.mabaiviet %>").val();
    var noidungbinhluan = $("#noidungbinhluan<%= baiviet.mabaiviet %>").val();
    if(noidungbinhluan == ""){
        alert("Vui lòng nhâp nội dung bình luận");
    }else{
        var dataform = new FormData();
        dataform.append("mabaiviet", mabaiviet);
        dataform.append("noidungbinhluan", noidungbinhluan)
        $.ajax({
                type: 'POST',
                url: '/dangbinhluan',
                cache: false,
                contentType: false,
                processData: false,
                data: dataform,
                success: function(data) {
                    $('#hienbinhluan<%= baiviet.mabaiviet%>').append(data)
                },
                error: function() {
                    alert("Đăng bình luận không thành công");
                }

            })
        $("#noidungbinhluan<%= baiviet.mabaiviet %>").val("");
    }
});
