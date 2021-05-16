var loading= false;
$(window).scroll(function() {
   
    if (!loading && ($(window).scrollTop() >  $(document).height() - $(window).height() - 50)) {
        loading= true;
        var solanloadbaiviet = $('#solanloadbaiviet').val();
        var trang = $('#trang').val();
        var dataform = new FormData();
        dataform.append("solanloadbaiviet", solanloadbaiviet);
        dataform.append("trang", trang);
        $.ajax({
                type: 'POST',
                url: '/loadbaiviet',
                cache: false,
                contentType: false,
                processData: false,
                data: dataform,
                success: function(data) {
                    if(data.length > 150){ 
                        $('#solanloadbaiviet').val(Number(solanloadbaiviet) + 1);
                        $('#hientintuc').append(data)
                        loading = false;
                    }else{
                        $('#hientintuc').append("Không còn dữ liệu bài viết")
                    }
                },
                error: function() {
                    alert("Tải bài viết mới không thành công");
                }

            })
        
    }
});