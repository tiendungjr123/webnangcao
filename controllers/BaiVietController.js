const passport = require('passport')
const formidable = require('formidable');
const bcrypt = require('bcrypt')
const md5 = require('md5')
const moment = require('moment')

const BaiViet = require('../models/BaiVietModel')
const TaiKhoanSinhVien = require('../models/TaiKhoanSinhVienModel')
const BinhLuan = require('../models/BinhLuanModel')
const TaiKhoan = require('../models/TaiKhoanModel')


module.exports.sinhviendangbaiviet = (req, res) => {
    var form = new formidable.IncomingForm();
    var dataform = [];
    var tenanh = [];
    form.parse(req, function(err, field, files) {
        const {noidung, idVideoYoutube} = field;
        dataform.push(noidung, idVideoYoutube)
        
        
    })

    
    // Luu hinh anh 
    form.on('fileBegin', function(name, file) {
        var now = Date.now();
        tentmp = md5(now + file.name) + ".jpg"
        file.path = 'public/anhbaiviet/' + tentmp;
        tenanh.push(tentmp);
    });
    form.on('end', function() {
        var thoigiandang = moment().format('YYYY-MM-DD HH:mm:ss')
        var mabaiviet = md5(Date.now() + dataform[0] + req.session.sinhvien.email + thoigiandang)
        BaiViet.create({
            mabaiviet: mabaiviet,
            email: req.session.sinhvien.email,
            noidung: dataform[0],
            idVideoYoutube: dataform[1],
            thoigiandang: thoigiandang,
            hinhanh: tenanh
        });

        TaiKhoanSinhVien.findOne({"email": req.session.sinhvien.email}, (err, thongtinsinhvien) => {
            if(err){
                //truờng hợp lỗi quay về trang đăng nhập
                res.redirect('/dangxuattaikhoansinhvien')
            }else{
                res.render("layout/baivietmoi", {thongtinsinhvien: thongtinsinhvien, noidung: dataform[0], thoigiandang: thoigiandang, hinhanh: tenanh, idVideoYoutube: dataform[1], mabaiviet});
            }
        });
    });
}

module.exports.xoabaiviet = (req, res) => {
    var form = new formidable.IncomingForm();
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {mabaiviet} = field;
        dataform.push(mabaiviet)
    })

    form.on('end', function() {
        console.log(dataform[0])
        BaiViet.deleteMany({ 'mabaiviet': dataform[0] }, (err) => {
            if (err) {
                console.log(err);
            } else {
                BinhLuan.deleteMany({ 'mabaiviet': dataform[0] }, (err) =>{
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("xoabaivietthanhcong");
                    }
                });
            }
        });
    });
}

module.exports.chinhsuabaiviet = (req, res) => {
    var form = new formidable.IncomingForm();
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {mabaiviet, noidungbaiviet, idVideoYoutube} = field;
        dataform.push(mabaiviet, noidungbaiviet, idVideoYoutube)
    })
    form.on('end', function() {
        TaiKhoanSinhVien.findOne({"email": req.session.sinhvien.email}, (err, thongtinsinhvien) => {
            if(err){
                //truờng hợp lỗi quay về trang đăng nhập
                res.redirect('/dangxuattaikhoansinhvien')
            }else{
                BaiViet.findOne({mabaiviet: dataform[0]}, (err, baiviet) => {
                    BaiViet.updateOne({mabaiviet:  dataform[0]}, { $set: { noidung: dataform[1], idVideoYoutube: dataform[2]}}, (err) => {
                        Promise.all([TaiKhoanSinhVien.find(), TaiKhoan.find(), BaiViet.find().sort({thoigiandang: -1}), BinhLuan.find().sort({thoigiandang: 1})])
                        .then(data => {
                            const [tatcasinhvien, tatcataikhoan, tatcabaiviet, tatcabinhluan] = data
                            res.render("layout/baivietmoi", {thongtinsinhvien: thongtinsinhvien,tatcataikhoan,tatcasinhvien,tatcabinhluan, noidung: dataform[1], thoigiandang: baiviet.thoigiandang, hinhanh: baiviet.hinhanh, idVideoYoutube: dataform[2], mabaiviet: dataform[0]});
                        })
                        .catch(err => {
                            res.render('dangnhap', {errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại"})
                        })
                    })
                })
            }
        });
    });
    
}

module.exports.loadbaiviet = (req, res) => {
    var form = new formidable.IncomingForm();
    var dataform = [];
    form.parse(req, function(err, field, files) {
        const {solanloadbaiviet, trang} = field;
        dataform.push(solanloadbaiviet, trang)
    })
    form.on('end', function() {
        //lấy email sinhvien  đang đăng nhập bằng sesstion
        let email = req.session.sinhvien.email
        let chucvu = req.session.sinhvien.chucvu
        if(dataform[1] == "trangchu"){
            if(chucvu == "sinhvien")
                TaiKhoanSinhVien.findOne({"email": email}, (err, thongtinsinhvien) => {
                    if(err){
                        comsole.log("lỗi")
                    }else{
                        Promise.all([TaiKhoanSinhVien.find(), TaiKhoan.find(), BaiViet.find().sort({thoigiandang: -1}).skip(Number(dataform[0]*10)).limit(10), BinhLuan.find().sort({thoigiandang: 1})])
                            .then(data => {
                                const [tatcasinhvien, tatcataikhoan, tatcabaiviet, tatcabinhluan, thongbao] = data
                                res.render('layout/baiviet', {thongtinsinhvien, tatcataikhoan, tatcasinhvien, tatcabaiviet, tatcabinhluan})
                            })
                            .catch(err => {
                                res.render('dangnhap', {errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại"})
                            })
                    }
                })
            else{
                TaiKhoan.findOne({"email": email}, (err, thongtinsinhvien) => {
                    if(err){
                        comsole.log("lỗi")
                    }else{
                        Promise.all([TaiKhoanSinhVien.find(), TaiKhoan.find(), BaiViet.find().sort({thoigiandang: -1}).skip(Number(dataform[0]*10)).limit(10), BinhLuan.find().sort({thoigiandang: 1})])
                            .then(data => {
                                const [tatcasinhvien, tatcataikhoan, tatcabaiviet, tatcabinhluan] = data
                                res.render('layout/baiviet', {thongtinsinhvien, tatcataikhoan, tatcasinhvien, tatcabaiviet, tatcabinhluan})
                            })
                            .catch(err => {
                                res.render('dangnhap', {errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại"})
                            })
                    }
                })
            }
        }else{
            if(chucvu == "sinhvien")
                TaiKhoanSinhVien.findOne({"email": email}, (err, thongtinsinhvien) => {
                    if(err){
                        comsole.log("lỗi")
                    }else{
                        Promise.all([TaiKhoanSinhVien.find(), TaiKhoan.find(), BaiViet.find({email:dataform[1]}).sort({thoigiandang: -1}).skip(Number(dataform[0]*10)).limit(10), BinhLuan.find().sort({thoigiandang: 1})])
                            .then(data => {
                                const [tatcasinhvien, tatcataikhoan, tatcabaiviet, tatcabinhluan, thongbao] = data
                                res.render('layout/baiviet', {thongtinsinhvien, tatcataikhoan, tatcasinhvien, tatcabaiviet, tatcabinhluan})
                            })
                            .catch(err => {
                                res.render('dangnhap', {errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại"})
                            })
                    }
                })
            else{
                TaiKhoan.findOne({"email": email}, (err, thongtinsinhvien) => {
                    if(err){
                        comsole.log("lỗi")
                    }else{
                        Promise.all([TaiKhoanSinhVien.find(), TaiKhoan.find(), BaiViet.find({email:dataform[1]}).sort({thoigiandang: -1}).skip(Number(dataform[0]*10)).limit(10), BinhLuan.find().sort({thoigiandang: 1})])
                            .then(data => {
                                const [tatcasinhvien, tatcataikhoan, tatcabaiviet, tatcabinhluan] = data
                                res.render('layout/baiviet', {thongtinsinhvien, tatcataikhoan, tatcasinhvien, tatcabaiviet, tatcabinhluan})
                            })
                            .catch(err => {
                                res.render('dangnhap', {errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại"})
                            })
                    }
                })
            }
        }
    });
}