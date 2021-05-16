const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://doanwebnangcao:doan123456@doanwebnangcao.0runb.mongodb.net/doanwebnangcao?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
})

const BinhLuanSchema = new mongoose.Schema({
    mabinhluan: String,
    mabaiviet: String,
    email: String,
    chucvu: String, //chức vụ của người bình luận
    noidungbinhluan: String,
    thoigiandang: String,
});

module.exports = mongoose.model('BinhLuan', BinhLuanSchema)