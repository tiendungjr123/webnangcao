const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://doanwebnangcao:doan123456@doanwebnangcao.0runb.mongodb.net/doanwebnangcao?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
})

const MoSoKhoa = new mongoose.Schema({
    maso: { 
        type: String,
        unique: true
    },
    tenkhoa: { 
        type: String,
        unique: true
    }
});

module.exports = mongoose.model('MasoKhoa', MoSoKhoa)