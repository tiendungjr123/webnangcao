const socket = io();
$('#themthongbao').submit(e => {
    var phongvakhoa = $('#phongvakhoa').val()
    socket.emit('message', phongvakhoa);
});
socket.on('message', function(msg) {
    $('#thongbaomoi').html(`
        <div class="alert alert-success">
            ${msg} có thông báo mới. <a href="/thongbaomoi" class="alert-link"> Xem ngay</a>
        </div>
        <script>
            $(".alert-success").fadeTo(4000, 500).slideUp(500, function(){
                $(".alert-success").slideUp(500);
            });
        </script>
    `)
});