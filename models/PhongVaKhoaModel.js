const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://doanwebnangcao:doan123456@doanwebnangcao.0runb.mongodb.net/doanwebnangcao?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
})

const PhongVaKhoaSchema = new mongoose.Schema({
    chucvu: { 
        type: String
    },
    ten: { 
        type: String,
        unique: true
    }
});

module.exports = mongoose.model('PhongVaKhoa', PhongVaKhoaSchema)
