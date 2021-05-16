const passport = require('passport')
const formidable = require('formidable');
const md5 = require('md5');

const TaiKhoanSinhVien = require('../models/TaiKhoanSinhVienModel')
const TaiKhoan= require('../models/TaiKhoanModel')
const PhongVaKhoa = require('../models/PhongVaKhoaModel')




module.exports.dangnhap = (req, res) => {
    //view đăng nhập 
    res.render('dangnhap')
}

module.exports.dangxuattaikhoansinhvien = (req, res) => {
    //xoá session 
    req.session.destroy()
    req.logout();
    //view đăng nhập 
    res.redirect('/')
}

module.exports.thaydoianhdaidien = (req, res) => {
    //lấy email sinhvien  đang đăng nhập bằng sesstion
    let email = req.session.sinhvien.email

    var form = new formidable.IncomingForm();
    var dataform = [];
    tenanh = "";
    form.parse(req, function(err, field, files) {
        const {hovaten, lop} = field;
        dataform.push(hovaten, lop)
    })

    form.on('fileBegin', function(name, file) {
        var now = Date.now();
        tentmp = md5(now + file.name) + ".jpg"
        file.path = 'public/anhdaidien/' + tentmp;
        console.log(tentmp)
        tenanh = tentmp;
    });

    form.on('end', function() {
        TaiKhoanSinhVien.updateOne({email}, { $set: { hovaten: dataform[0], lop: dataform[1]}, anhdaidien: tenanh}, (err) => {
            res.send("thanhcong");
        })
    });
}

module.exports.thaydoithongtin = (req, res) => {
    //lấy email sinhvien  đang đăng nhập bằng sesstion
    let email = req.session.sinhvien.email

    var form = new formidable.IncomingForm();
    var dataform = [];
    var tenanh = [];
    form.parse(req, function(err, field, files) {
        const {hovaten, lop} = field;
        dataform.push(hovaten, lop)
    })

    form.on('end', function() {
        TaiKhoanSinhVien.updateOne({email}, { $set: { hovaten: dataform[0], lop: dataform[1]}}, (err) => {
            res.send("thanhcong");
        })
    });
}

module.exports.dangnhapkhoa = (req, res) => {
    var taikhoan = req.body.taikhoan;
    var matkhau = req.body.matkhau;

    TaiKhoan.findOne({"taikhoan": taikhoan, "matkhau": md5(matkhau)}, (err, thongtintaikhoan) => {
        if(!thongtintaikhoan || err){
            res.render('dangnhap', {errorTK: "Tài khoản hoặc mật khẩu không đúng"})
        }else{
            req.session.sinhvien = {
                email: thongtintaikhoan.email,
                chucvu: thongtintaikhoan.chucvu
            }
            res.redirect('/trangchu')
        }
    });
    
}

module.exports.doimatkhau = (req, res) => {
    var matkhauhientai = req.body.matkhauhientai;
    var matkhaumoi = req.body.matkhaumoi;
    var xacnhanmatkhau = req.body.xacnhanmatkhau;

    let email = req.session.sinhvien.email

    TaiKhoan.findOne({"email": email}, (err, thongtintaikhoan) => {
        if(!thongtintaikhoan || err){
            res.render('dangnhap', {errorTK: "Tài khoản hoặc mật khẩu không đúng"})
        }else{
            if(thongtintaikhoan.matkhau == md5(matkhauhientai)){
                if(matkhaumoi.length < 6 ){
                    res.render('trangdoimatkhau', {thongtinsinhvien: thongtintaikhoan, errorDMK: "Mật khẩu phải có ít nhất 6 kí tự"})
                }else{
                    if(matkhaumoi != xacnhanmatkhau){
                        res.render('trangdoimatkhau', {thongtinsinhvien: thongtintaikhoan, errorDMK: "Xác nhận mật khẩu không đúng"})
                    }else{
                        TaiKhoan.updateOne({email:  email}, { $set: { matkhau: md5(matkhaumoi)}}, (err) => {
                            res.render('trangdoimatkhau', {thongtinsinhvien: thongtintaikhoan, successDMK: "Đổi mật khẩu thành công"})
                        })
                    }
                }  
                
            }else{
                res.render('trangdoimatkhau', {thongtinsinhvien: thongtintaikhoan, errorDMK: "Mật khẩu không đúng"})
            }
        }
    });
}

module.exports.taotaikhoan = (req, res) => {
    var email_session = req.session.sinhvien.email;
    var taikhoan = req.body.taikhoan;
    var email = req.body.email;
    var matkhau = req.body.matkhau;
    var nhaplaimatkhau = req.body.nhaplaimatkhau;
    var phongvakhoa = req.body.phongvakhoa;
    var errorTTK = ""
    
    if(taikhoan == "" || email == ""){
        errorTTK = "Tài khoản và email không được để trống";
    }else{
        if(matkhau.length < 6){
            errorTTK = "Mật khẩu phải có ít nhất 6 kí tự";
        }else{
            if(matkhau != nhaplaimatkhau){
                errorTTK = "Xác nhận mật khẩu không đúng";
            }else{
                TaiKhoan.findOne({"taikhoan": taikhoan}, (err, thongtintaikhoan) => {
                    if(err){
                        errorTTK = "Lỗi! không thể tạo tài khoản";
                    }else if(thongtintaikhoan != null){
                        errorTTK = "Tài khoản này đã tồn tại";
                    }else{
                        TaiKhoan.findOne({"email": email}, (err, thongtintaikhoan2) => {
                            if(err){
                                errorTTK = "Lỗi! không thể tạo tài khoản"
                            }else if(thongtintaikhoan2 != null){
                                errorTTK = "Email này đã tồn tại";
                            }else{
                                PhongVaKhoa.findOne({"ten": phongvakhoa}, (err, thongtin) => {
                                    if(!thongtin || err){
                                        errorTTK = "Lỗi! không thể tạo tài khoản";
                                    }
                                })
                            }
                        });
                    }
                });
            }
        }
    }
   
    if(errorTTK != ""){
        TaiKhoan.findOne({"email": email_session}, (err, thongtinsinhvien) => {
            if(err){
                comsole.log("lỗi")
            }else{
                Promise.all([PhongVaKhoa.find()])
                    .then(data => {
                        const [phongvakhoa] = data
                        res.render('trangtaotaikhoan', {thongtinsinhvien, phongvakhoa, errorTTK})
                    })
                    .catch(err => {
                        res.render('dangnhap', {errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại"})
                    })
            }
        })
    }else{
        PhongVaKhoa.findOne({"ten": phongvakhoa}, (err, thongtin) => {
            if(thongtin){
                TaiKhoan.create({
                    taikhoan: taikhoan,
                    email: email,
                    matkhau: md5(matkhau),
                    hovaten: phongvakhoa,
                    khoa: phongvakhoa,
                    chucvu: thongtin.chucvu,
                    anhdaidien: "avatasinhvien.jpg",
                });
                TaiKhoan.findOne({"email": email_session}, (err, thongtinsinhvien) => {
                    if(err){
                        comsole.log("lỗi")
                    }else{
                        Promise.all([PhongVaKhoa.find()])
                            .then(data => {
                                const [phongvakhoa] = data
                                res.render('trangtaotaikhoan', {thongtinsinhvien, phongvakhoa, successTTK: "Tạo tài khoản thành công"})
                            })
                            .catch(err => {
                                res.render('dangnhap', {errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại"})
                            })
                    }
                })
            }
        })
        
    }

}

