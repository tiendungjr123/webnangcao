const passport = require('passport')
const TaiKhoanSinhVien = require('../models/TaiKhoanSinhVienModel')
const TaiKhoan = require('../models/TaiKhoanModel')
const BaiViet = require('../models/BaiVietModel')
const BinhLuan = require('../models/BinhLuanModel')
const PhongVaKhoa = require('../models/PhongVaKhoaModel')
const ThongBao = require('../models/ThongBaoModel')


module.exports.trangchu = (req, res) => {
    //lấy email sinhvien  đang đăng nhập bằng sesstion
    let email = req.session.sinhvien.email
    let chucvu = req.session.sinhvien.chucvu
        //tìm thông tin sinh viên trong db
    if (chucvu == "sinhvien")
        TaiKhoanSinhVien.findOne({ "email": email }, (err, thongtinsinhvien) => {
            if (err) {
                comsole.log("lỗi")
            } else {
                Promise.all([TaiKhoanSinhVien.find(), TaiKhoan.find(), BaiViet.find().sort({ thoigiandang: -1 }).limit(10), BinhLuan.find().sort({ thoigiandang: 1 }), ThongBao.find().sort({ thoigian: -1 }).limit(2)])
                    .then(data => {
                        const [tatcasinhvien, tatcataikhoan, tatcabaiviet, tatcabinhluan, thongbao] = data
                        res.render('trangchu', { thongtinsinhvien, tatcataikhoan, tatcasinhvien, tatcabaiviet, tatcabinhluan, thongbao })
                    })
                    .catch(err => {
                        res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                    })
            }
        })
    else {
        TaiKhoan.findOne({ "email": email }, (err, thongtinsinhvien) => {
            if (err) {
                comsole.log("lỗi")
            } else {
                Promise.all([TaiKhoanSinhVien.find(), TaiKhoan.find(), BaiViet.find().sort({ thoigiandang: -1 }).limit(10), BinhLuan.find().sort({ thoigiandang: 1 })])
                    .then(data => {
                        const [tatcasinhvien, tatcataikhoan, tatcabaiviet, tatcabinhluan] = data
                        res.render('trangchu', { thongtinsinhvien, tatcataikhoan, tatcasinhvien, tatcabaiviet, tatcabinhluan })
                    })
                    .catch(err => {
                        res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                    })
            }
        })
    }

}

module.exports.thongtincanhan = (req, res) => {
    //lấy email sinhvien  đang đăng nhập bằng sesstion
    let email = req.session.sinhvien.email
        //tìm thông tin sinh viên trong db
    TaiKhoanSinhVien.findOne({ "email": email }, (err, thongtinsinhvien) => {
        if (err) {
            comsole.log("lỗi")
        } else {
            Promise.all([TaiKhoanSinhVien.find(), BaiViet.find().sort({ thoigiandang: -1 }), BinhLuan.find().sort({ thoigiandang: 1 })])
                .then(data => {
                    const [tatcasinhvien, tatcabaiviet, tatcabinhluan] = data
                    res.render('thongtincanhan', { thongtinsinhvien })
                })
                .catch(err => {
                    res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                })
        }
    })
}

module.exports.trangcanhan = (req, res) => {
    //lấy email sinhvien  đang đăng nhập bằng sesstion
    let email = req.session.sinhvien.email;
    let chucvu = req.session.sinhvien.chucvu;
    if (chucvu != "sinhvien") {
        res.redirect("/trangchu")
    } else {
        TaiKhoanSinhVien.findOne({ "email": email }, (err, thongtinsinhvien) => {
            if (err) {
                comsole.log("lỗi")
            } else {
                Promise.all([TaiKhoanSinhVien.find(), TaiKhoan.find(), BaiViet.find({ email }).sort({ thoigiandang: -1 }).limit(10), BinhLuan.find().sort({ thoigiandang: 1 })])
                    .then(data => {
                        const [tatcasinhvien, tatcataikhoan, tatcabaiviet, tatcabinhluan] = data
                        res.render('trangcanhan', { thongtinsinhvien, tatcataikhoan, tatcasinhvien, tatcabaiviet, tatcabinhluan, trang: email })
                    })
                    .catch(err => {
                        res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                    })
            }
        })
    }
}

module.exports.trangthongbao = (req, res) => {
    //lấy email sinhvien  đang đăng nhập bằng sesstion
    let email = req.session.sinhvien.email;
    let chucvu = req.session.sinhvien.chucvu;
    if (req.query.phongvakhoa && req.query.trang) {
        var trang = req.query.trang;
        if (req.query.phongvakhoa == "Tất cả thông báo") {
            if (chucvu == "sinhvien") {
                TaiKhoanSinhVien.findOne({ "email": email }, (err, thongtinsinhvien) => {
                    if (err) {
                        comsole.log("lỗi")
                    } else {
                        Promise.all([PhongVaKhoa.find(), ThongBao.find().sort({ thoigian: -1 }).skip(Number((trang - 1) * 10)).limit(10), ThongBao.find().countDocuments()])
                            .then(data => {
                                var [phongvakhoa, tatcathongbao, soluongtrang] = data
                                soluongtrang = Math.ceil(soluongtrang / 10);
                                res.render('trangthongbao', { thongtinsinhvien, phongvakhoa, tatcathongbao, phongvakhoadangxem: "Tất cả thông báo", soluongtrang, trangdangxem: trang })
                            })
                            .catch(err => {
                                res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                            })
                    }
                })
            } else {
                TaiKhoan.findOne({ "email": email }, (err, thongtinsinhvien) => {
                    if (err) {
                        comsole.log("lỗi")
                    } else {
                        Promise.all([PhongVaKhoa.find(), ThongBao.find().sort({ thoigian: -1 }).skip(Number((trang - 1) * 10)).limit(10), ThongBao.find().countDocuments()])
                            .then(data => {
                                var [phongvakhoa, tatcathongbao, soluongtrang] = data
                                soluongtrang = Math.ceil(soluongtrang / 10);
                                res.render('trangthongbao', { thongtinsinhvien, phongvakhoa, tatcathongbao, phongvakhoadangxem: "Tất cả thông báo", soluongtrang, trangdangxem: trang })
                            })
                            .catch(err => {
                                res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                            })
                    }
                })
            }
        } else {
            if (chucvu == "sinhvien") {
                TaiKhoanSinhVien.findOne({ "email": email }, (err, thongtinsinhvien) => {
                    if (err) {
                        comsole.log("lỗi")
                    } else {
                        Promise.all([PhongVaKhoa.find(), ThongBao.find({ "phongvakhoa": req.query.phongvakhoa }).sort({ thoigian: -1 }).skip(Number((trang - 1) * 10)).limit(10), ThongBao.find({ "phongvakhoa": req.query.phongvakhoa }).countDocuments()])
                            .then(data => {
                                var [phongvakhoa, tatcathongbao, soluongtrang] = data
                                soluongtrang = Math.ceil(soluongtrang / 10);
                                res.render('trangthongbao', { thongtinsinhvien, phongvakhoa, tatcathongbao, phongvakhoadangxem: req.query.phongvakhoa, soluongtrang, trangdangxem: trang })
                            })
                            .catch(err => {
                                res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                            })
                    }
                })
            } else {
                TaiKhoan.findOne({ "email": email }, (err, thongtinsinhvien) => {
                    if (err) {
                        comsole.log("lỗi")
                    } else {
                        Promise.all([PhongVaKhoa.find(), ThongBao.find({ "phongvakhoa": req.query.phongvakhoa }).sort({ thoigian: -1 }).skip(Number((trang - 1) * 10)).limit(10), ThongBao.find({ "phongvakhoa": req.query.phongvakhoa }).countDocuments()])
                            .then(data => {
                                var [phongvakhoa, tatcathongbao, soluongtrang] = data
                                soluongtrang = Math.ceil(soluongtrang / 10);
                                res.render('trangthongbao', { thongtinsinhvien, phongvakhoa, tatcathongbao, phongvakhoadangxem: req.query.phongvakhoa, soluongtrang, trangdangxem: trang })
                            })
                            .catch(err => {
                                res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                            })
                    }
                })
            }
        }
    } else {
        res.redirect("/trangthongbao?phongvakhoa=Tất+cả+thông+báo&trang=1");

    }
}

module.exports.trangthemthongbao = (req, res) => {
    //lấy email sinhvien  đang đăng nhập bằng sesstion
    let email = req.session.sinhvien.email;
    let chucvu = req.session.sinhvien.chucvu;
    if (chucvu == "sinhvien") {
        res.redirect("/trangchu")
    } else {
        TaiKhoan.findOne({ "email": email }, (err, thongtinsinhvien) => {
            if (err) {
                comsole.log("lỗi")
            } else {
                Promise.all([PhongVaKhoa.find()])
                    .then(data => {
                        const [phongvakhoa] = data
                        res.render('trangthemthongbao', { thongtinsinhvien, phongvakhoa })
                    })
                    .catch(err => {
                        res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                    })
            }
        })
    }
}

module.exports.trangdoimatkhau = (req, res) => {
    //lấy email sinhvien  đang đăng nhập bằng sesstion
    let email = req.session.sinhvien.email;
    let chucvu = req.session.sinhvien.chucvu;
    if (chucvu == "sinhvien") {
        res.redirect("/trangchu")
    } else {
        TaiKhoan.findOne({ "email": email }, (err, thongtinsinhvien) => {
            if (err) {
                comsole.log("lỗi")
            } else {
                Promise.all([TaiKhoanSinhVien.find(), TaiKhoan.find(), BaiViet.find({ email }).sort({ thoigiandang: -1 }), BinhLuan.find().sort({ thoigiandang: 1 })])
                    .then(data => {
                        const [tatcasinhvien, tatcataikhoan, tatcabaiviet, tatcabinhluan] = data
                        res.render('trangdoimatkhau', { thongtinsinhvien, tatcataikhoan, tatcasinhvien, tatcabaiviet, tatcabinhluan })
                    })
                    .catch(err => {
                        res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                    })
            }
        })
    }
}

module.exports.trangtaotaikhoan = (req, res) => {
    let email = req.session.sinhvien.email;
    let chucvu = req.session.sinhvien.chucvu;
    if (chucvu == "sinhvien") {
        res.redirect("/trangchu")
    } else {
        TaiKhoan.findOne({ "email": email }, (err, thongtinsinhvien) => {
            if (err) {
                comsole.log("lỗi")
            } else {
                Promise.all([PhongVaKhoa.find()])
                    .then(data => {
                        const [phongvakhoa] = data
                        res.render('trangtaotaikhoan', { thongtinsinhvien, phongvakhoa })
                    })
                    .catch(err => {
                        res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                    })
            }
        })
    }
}

module.exports.trangbanbe = (req, res) => {
    var emailtrang = req.params.email;
    //lấy email sinhvien  đang đăng nhập bằng sesstion
    let email = req.session.sinhvien.email;
    let chucvu = req.session.sinhvien.chucvu;
    if (chucvu == "sinhvien") {
        TaiKhoanSinhVien.findOne({ "email": email }, (err, thongtinsinhvien) => {
            if (err) {
                comsole.log("lỗi")
            } else {
                Promise.all([TaiKhoanSinhVien.find(), TaiKhoan.find(), BaiViet.find({ "email": emailtrang }).sort({ thoigiandang: -1 }).limit(10), BinhLuan.find().sort({ thoigiandang: 1 })])
                    .then(data => {
                        const [tatcasinhvien, tatcataikhoan, tatcabaiviet, tatcabinhluan] = data
                        res.render('trangcanhan', { thongtinsinhvien, tatcataikhoan, tatcasinhvien, tatcabaiviet, tatcabinhluan, trang: emailtrang })
                    })
                    .catch(err => {
                        res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                    })
            }
        })
    } else {
        TaiKhoan.findOne({ "email": email }, (err, thongtinsinhvien) => {
            if (err) {
                comsole.log("lỗi")
            } else {
                Promise.all([TaiKhoanSinhVien.find(), TaiKhoan.find(), BaiViet.find({ "email": emailtrang }).sort({ thoigiandang: -1 }).limit(10), BinhLuan.find().sort({ thoigiandang: 1 })])
                    .then(data => {
                        const [tatcasinhvien, tatcataikhoan, tatcabaiviet, tatcabinhluan] = data
                        res.render('trangcanhan', { thongtinsinhvien, tatcataikhoan, tatcasinhvien, tatcabaiviet, tatcabinhluan, trang: emailtrang })
                    })
                    .catch(err => {
                        res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                    })
            }
        })
    }
}

module.exports.trangchitietthongbao = (req, res) => {
    var idthongbao = req.params.idthongbao;
    //lấy email sinhvien  đang đăng nhập bằng sesstion
    let email = req.session.sinhvien.email
    let chucvu = req.session.sinhvien.chucvu
        //tìm thông tin sinh viên trong db
    if (chucvu == "sinhvien")
        TaiKhoanSinhVien.findOne({ "email": email }, (err, thongtinsinhvien) => {
            if (err) {
                comsole.log("lỗi")
            } else {
                Promise.all([ThongBao.findOne({ "_id": idthongbao })])
                    .then(data => {
                        const [thongbao] = data
                        res.render('trangchitietthongbao', { thongtinsinhvien, thongbao })
                    })
                    .catch(err => {
                        res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                    })
            }
        })
    else {
        TaiKhoan.findOne({ "email": email }, (err, thongtinsinhvien) => {
            if (err) {
                comsole.log("lỗi")
            } else {
                Promise.all([ThongBao.findOne({ "_id": idthongbao })])
                    .then(data => {
                        const [thongbao] = data
                        res.render('trangchitietthongbao', { thongtinsinhvien, thongbao })
                    })
                    .catch(err => {
                        res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                    })
            }
        })
    }
}

module.exports.thongbaomoi = (req, res) => {
    var idthongbao = req.params.idthongbao;
    //lấy email sinhvien  đang đăng nhập bằng sesstion
    let email = req.session.sinhvien.email
    let chucvu = req.session.sinhvien.chucvu
        //tìm thông tin sinh viên trong db
    if (chucvu == "sinhvien")
        TaiKhoanSinhVien.findOne({ "email": email }, (err, thongtinsinhvien) => {
            if (err) {
                comsole.log("lỗi")
            } else {
                Promise.all([ThongBao.findOne().sort({ thoigian: -1 }).limit(1)])
                    .then(data => {
                        const [thongbao] = data
                        res.render('trangchitietthongbao', { thongtinsinhvien, thongbao })
                    })
                    .catch(err => {
                        res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                    })
            }
        })
    else {
        TaiKhoan.findOne({ "email": email }, (err, thongtinsinhvien) => {
            if (err) {
                comsole.log("lỗi")
            } else {
                Promise.all([ThongBao.findOne().sort({ thoigian: -1 }).limit(1)])
                    .then(data => {
                        const [thongbao] = data
                        res.render('trangchitietthongbao', { thongtinsinhvien, thongbao })
                    })
                    .catch(err => {
                        res.render('dangnhap', { errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại" })
                    })
            }
        })
    }

}