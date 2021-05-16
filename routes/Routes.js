const express = require('express')
const Router = express.Router();

//kiểm tra trình duyệt đã có session tài khoản
//nếu có thì chuyển người dùng đến trang chủ, không cần đăng nhập lại
const isSessionLogin = (req, res, next) => {
    if(req.session.sinhvien){
        res.redirect('/trangchu')
    }else{
        next();
    }
}

//kiểm tra session sinhvien có tồn tại tài
//nếu có cho người dùng tiếp tục thực hiện các tác về
//nếu không(do chưa đăng nhập, gán link, lỗi) thì chuyển người dùng đến trang đăng nhập
const isLoggedIn = (req, res, next) => {
    if(req.session.sinhvien){
        next();
    }else{
        res.redirect('/dangxuattaikhoansinhvien')
    }
}

//Tài khoản controller có nhiệm vụ xử lý các thông tin về đăng nhập, tạo tài khoảng, thay đổi thông tin trong tài khoản
const TaiKhoanController = require('../controllers/TaiKhoanController')
//TrangController có nhiệm vụ show view ra màn hình
const TrangController = require('../controllers/TrangController')
const BaiVietController = require('../controllers/BaiVietController')
const BinhLuanController = require('../controllers/BinhLuanController')
const ThongBaoController = require('../controllers/ThongBaoController')

Router.get('/', isSessionLogin, TaiKhoanController.dangnhap)
Router.get('/dangxuattaikhoansinhvien', TaiKhoanController.dangxuattaikhoansinhvien)
Router.post('/thaydoithongtincanhan',isLoggedIn, TaiKhoanController.thaydoithongtin)
Router.post('/thaydoianhdaidien',isLoggedIn, TaiKhoanController.thaydoianhdaidien)
Router.post('/dangnhapkhoa', TaiKhoanController.dangnhapkhoa)
Router.post('/doimatkhau', TaiKhoanController.doimatkhau)
Router.post('/taotaikhoan', TaiKhoanController.taotaikhoan)

Router.get('/trangchu', isLoggedIn, TrangController.trangchu)
Router.get('/thongtincanhan', isLoggedIn, TrangController.thongtincanhan)
Router.get('/trangcanhan', isLoggedIn, TrangController.trangcanhan)
Router.get('/trangthongbao', isLoggedIn, TrangController.trangthongbao)
Router.get('/trangthongbao/:phongvakhoa', isLoggedIn, TrangController.trangthongbao)
Router.get('/trangthongbao', isLoggedIn, TrangController.trangthongbao)
Router.get('/trangthemthongbao', isLoggedIn, TrangController.trangthemthongbao)
Router.get('/trangdoimatkhau', isLoggedIn, TrangController.trangdoimatkhau)
Router.get('/trangtaotaikhoan', isLoggedIn, TrangController.trangtaotaikhoan)
Router.get('/trangcanhan/:email', isLoggedIn, TrangController.trangbanbe)
Router.get('/trangchitietthongbao/:idthongbao', isLoggedIn, TrangController.trangchitietthongbao)
Router.get('/thongbaomoi', isLoggedIn, TrangController.thongbaomoi)

Router.post('/sinhviendangbaiviet', isLoggedIn, BaiVietController.sinhviendangbaiviet)
Router.post('/xoabaiviet', isLoggedIn, BaiVietController.xoabaiviet)
Router.post('/chinhsuabaiviet', isLoggedIn, BaiVietController.chinhsuabaiviet)
Router.post('/loadbaiviet', isLoggedIn, BaiVietController.loadbaiviet)

Router.post('/dangbinhluan', isLoggedIn, BinhLuanController.dangbinhluan)
Router.post('/xoabinhluan', isLoggedIn, BinhLuanController.xoabinhluan)

Router.post('/themthongbao', isLoggedIn, ThongBaoController.themthongbao)
Router.post('/chinhsuathongbao', isLoggedIn, ThongBaoController.chinhsuathongbao)
Router.post('/xoathongbao', isLoggedIn, ThongBaoController.xoathongbao)


module.exports = Router