const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://doanwebnangcao:doan123456@doanwebnangcao.0runb.mongodb.net/doanwebnangcao?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
})

const TaiKhoanSchema = new mongoose.Schema({
    taikhoan: String,
    email: String,
    matkhau: String,
    hovaten: String,
    khoa: String,
    chucvu: String,
    anhdaidien: String
});

module.exports = mongoose.model('TaiKhoan', TaiKhoanSchema)

/*const TaiKhoanMoi = mongoose.model('TaiKhoan', TaiKhoanSchema)
TaiKhoanMoi.create({
    taikhoan: 'admin',
    email: 'admin@gmail.com',
    matkhau: 'e10adc3949ba59abbe56e057f20f883e',
    hovaten: 'Quản lý hệ thống',
    khoa: '',
    chucvu: 'admin',
    anhdaidien: 'avatasinhvien.jpg'
});*/