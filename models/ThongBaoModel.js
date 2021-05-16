const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://doanwebnangcao:doan123456@doanwebnangcao.0runb.mongodb.net/doanwebnangcao?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
})

const ThongBaoSchema = new mongoose.Schema({
    phongvakhoa: String,
    chucvu: String, //khoa hoặc phòng
    tieude: String,
    noidung: String,
    thoigian: String,
});

module.exports = mongoose.model('ThongBao', ThongBaoSchema)