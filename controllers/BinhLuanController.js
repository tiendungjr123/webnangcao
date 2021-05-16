const passport = require('passport')
const formidable = require('formidable');
const bcrypt = require('bcrypt')
const md5 = require('md5')
const moment = require('moment')

const BaiViet = require('../models/BaiVietModel')
const TaiKhoanSinhVien = require('../models/TaiKhoanSinhVienModel')
const TaiKhoan= require('../models/TaiKhoanModel')
const BinhLuan = require('../models/BinhLuanModel')

module.exports.dangbinhluan = (req, res) => {
    var form = new formidable.IncomingForm();
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {mabaiviet, noidungbinhluan} = field;
        dataform.push(mabaiviet, noidungbinhluan)
    })

    form.on('end', function() {
        var thoigiandang = moment().format('YYYY-MM-DD HH:mm:ss')
        var mabinhluan = md5(Date.now() + dataform[0] + req.session.sinhvien.email + thoigiandang)
        BinhLuan.create({
            mabinhluan: mabinhluan,
            mabaiviet: dataform[0],
            email: req.session.sinhvien.email,
            chucvu: req.session.sinhvien.chucvu,
            noidungbinhluan: dataform[1],
            thoigiandang: thoigiandang,
        });

        if(req.session.sinhvien.chucvu == "sinhvien"){
            TaiKhoanSinhVien.findOne({"email": req.session.sinhvien.email}, (err, thongtinsinhvien) => {
                if(err){
                    //truờng hợp lỗi quay về trang đăng nhập
                    res.redirect('/dangxuattaikhoansinhvien')
                }else{
                    res.render("layout/binhluanmoi", {thongtinsinhvien, noidung: dataform[1], thoigiandang, mabinhluan});
                }
            });
        }else{
            TaiKhoan.findOne({"email": req.session.sinhvien.email}, (err, thongtinsinhvien) => {
                if(err){
                    //truờng hợp lỗi quay về trang đăng nhập
                    res.redirect('/dangxuattaikhoansinhvien')
                }else{
                    res.render("layout/binhluanmoi", {thongtinsinhvien, noidung: dataform[1], thoigiandang, mabinhluan});
                }
            });
        }
    });
}

module.exports.xoabinhluan = (req, res) => {
    var form = new formidable.IncomingForm();
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {mabinhluan} = field;
        dataform.push(mabinhluan)
    })

    form.on('end', function() {
        console.log(dataform[0])
        BinhLuan.deleteMany({ 'mabinhluan': dataform[0] }, (err) =>{
            if (err) {
                console.log(err);
            } else {
                res.send("xoabinhluanthanhcong");
            }
        });
    });
}

