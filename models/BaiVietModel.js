const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://doanwebnangcao:doan123456@doanwebnangcao.0runb.mongodb.net/doanwebnangcao?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
})

const BaiVietSchema = new mongoose.Schema({
    mabaiviet: String,
    email: String,
    noidung: String,
    idVideoYoutube: String,
    thoigiandang: String,
    hinhanh: [],
});

module.exports = mongoose.model('BaiViet', BaiVietSchema)