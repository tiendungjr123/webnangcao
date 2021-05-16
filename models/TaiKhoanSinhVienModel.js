const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://doanwebnangcao:doan123456@doanwebnangcao.0runb.mongodb.net/doanwebnangcao?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
})

const TaiKhoanSinhVienSchema = new mongoose.Schema({
    email: String,
    hovaten: String,
    mssv: String,
    khoa: String,
    lop: String,
    namhoc: String,
    chucvu: String,
    anhdaidien: String
});

module.exports = mongoose.model('TaiKhoanSinhVien', TaiKhoanSinhVienSchema)