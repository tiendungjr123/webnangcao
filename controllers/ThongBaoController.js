const moment = require('moment')
const formidable = require('formidable');

const ThongBao = require('../models/ThongBaoModel')
const PhongVaKhoa = require('../models/PhongVaKhoaModel')
const TaiKhoan= require('../models/TaiKhoanModel')



module.exports.themthongbao = (req, res) => {
    let email = req.session.sinhvien.email;
    var tieude = req.body.tieude;
    var noidung = req.body.noidung;
    var phongvakhoa = req.body.phongvakhoa;

    PhongVaKhoa.findOne({"ten": phongvakhoa}, (err, thongtin) => {
        if(err || !thongtin){
            TaiKhoan.findOne({"email": email}, (err, thongtinsinhvien) => {
                if(err){
                    comsole.log("lỗi")
                }else{
                    Promise.all([PhongVaKhoa.find()])
                        .then(data => {
                            const [phongvakhoa] = data
                            res.render('trangthemthongbao', {thongtinsinhvien, phongvakhoa, errorTTB: "Lỗi! không thể thêm thông báo"})
                        })
                        .catch(err => {
                            res.render('dangnhap', {errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại"})
                        })
                }
            })
        }else{
            ThongBao.create({
                phongvakhoa: phongvakhoa,
                chucvu: thongtin.chucvu,
                tieude: tieude,
                noidung: noidung,
                thoigian: moment().format('YYYY-MM-DD HH:mm:ss')
            });
            TaiKhoan.findOne({"email": email}, (err, thongtinsinhvien) => {
                if(err){
                    comsole.log("lỗi")
                }else{
                    Promise.all([PhongVaKhoa.find()])
                        .then(data => {
                            const [phongvakhoa] = data
                            res.render('trangthemthongbao', {thongtinsinhvien, phongvakhoa, successTTB: "Thêm thông báo thành công"})
                        })
                        .catch(err => {
                            res.render('dangnhap', {errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại"})
                        })
                }
            })
        }
    })
}

module.exports.chinhsuathongbao = (req, res) => {
    var form = new formidable.IncomingForm();
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idthongbao, tieude, noidung} = field;
        dataform.push(idthongbao, tieude, noidung)
    })
    form.on('end', function() {
        ThongBao.updateOne({_id:  dataform[0]}, { $set: { tieude: "[Đã chỉnh sửa] "+dataform[1], noidung: dataform[2], thoigian:moment().format('YYYY-MM-DD HH:mm:ss')}}, (err) => {
            res.send("ok");
        })
    })
}

module.exports.xoathongbao = (req, res) => {
    var form = new formidable.IncomingForm();
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {idthongbao} = field;
        dataform.push(idthongbao)
    })
    form.on('end', function() {
        ThongBao.deleteMany({ '_id': dataform[0] }, (err) => {
            if(err){
                res.send("khongthanhcong")
            }else{
                res.send("thanhcong");
            }
        })
    })
}
