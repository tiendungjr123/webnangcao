const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
var path = require('path');
const MasoKhoa = require('./models/MaSoKhoaModel');
const TaiKhoanSinhVien = require('./models/TaiKhoanSinhVienModel');

const app = express()
var http = require('http').createServer(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

//Cài đặt view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


//cài đặt session
app.use(session({ 
    secret: 'anything',
    resave: true,
    saveUninitialized: true}));

//Cài đặt liên quan đến đăng nhập bằng google
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});
passport.use(new GoogleStrategy({
        clientID: '354432041188-musnetja537fl644oet2uumv4o5lp48b.apps.googleusercontent.com',
        clientSecret: 'TMCa1TUSvd8aNq8JRwl2-etn',
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

//Lỗi khi đăng nhập bằng auth google
app.get('/failed', async (req, res) => { res.status(404).send('erreur authentification') })


//Ngoại trừ các route liên quan đến gg thì tất cả các route đều được xử lý tại ./routes/Routes.js
const Routest = require('./routes/Routes.js');
const masokhoa = require('./config/masokhoa.js');
app.use('/', Routest)

//route đăng nhập bằng google
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    }));

/*  
 Đăng nhập từ gg thành công kiểm tra thông tin đã có trong date base chưa
 - Nếu chưab(lần đầu đăng nhập) thì thêm tên, email của người dùng vào datebase và tạo sesstion 
 - Nếu đã có thông tin đăng nhập thì tạo sesstion
 */
app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/failed' }),
    function(req, res) {
        res.set('Content-Type', 'text/html')
        var email = req.user.email //lấy email
        var mssv = email.split('@')[0] //lấy phần trước @
        var duoiemail = email.split('@')[1] //lấy phần sau @

        //kiểm tra đuôi mail có phải student.tdtu.edu.vn không
        //Nếu phải thì tiếp tục đăng nhập
        //Không thì chuyển người dùng về trang đăng nhập và thông báo cho người dùng
        if(duoiemail === "student.tdtu.edu.vn"){

            //lấy kí tự đầu tiên trong dãy mssv
            var masokhoa = mssv.charAt(0);
            //lấy nằm sinh viên nhập học
            var namhoc = 20 + mssv.charAt(1) + mssv.charAt(2);
            //tên của bạn trong email
            var hovaten  = req.user.displayName

            //kiểm tra thông tin ngừoi dùng này có trong hệ thống chưa
            //có thì chỉ cần tạo sesstion và chuyển người dùng sang trang chủ
            //không thì cập nhật thông tin người dùng vào datebase, tạo sesstion và chuyển người dùng sang trang chủ
            TaiKhoanSinhVien.findOne({"email": email})
                .then(acc => {
                    //nếu không tìm được sinh viên nào thì acc = null
                    if(acc){
                        req.session.sinhvien = {
                            email: acc.email,
                            chucvu: "sinhvien"
                        }
                        res.redirect('/trangchu')
                    }else{
                        //Từ bảng MaSoKhoa (database) tìm masokhoa từ đó lấy ra tên khoa
                        MasoKhoa.findOne({ "maso": masokhoa }, (err, data) => {
                            if (err) {
                                res.render('dangnhap', {errorGG: "Lỗi hệ thống, vui lòng đăng nhập lại"})
                            } else {
                                //data chứa dữ liệu được trả về từ database (ở đây là thông tin của 1 khoa gồm id, maso, tenkhoa)
                                var tenkhoa = data.tenkhoa

                                TaiKhoanSinhVien.create({
                                    email: email,
                                    hovaten: hovaten,
                                    mssv: mssv,
                                    khoa: tenkhoa,
                                    lop: "",
                                    namhoc: namhoc,
                                    chucvu: "sinhvien",
                                    anhdaidien: 'avatasinhvien.jpg'
                                });
                                req.session.sinhvien = {
                                    email: email,
                                    chucvu: "sinhvien"
                                }
                                res.redirect('/trangchu')
                            }
                        })
                    }
                })
        }else{
            res.render('dangnhap', {errorGG: "Bạn phải dùng email sinh viên Đại học Tôn Đức Thắng để đăng nhập vào hệ thống"})
        }
        

    });

app.get('/ok', (req, res) => {
    console.log(req.session.sinhvien);
    res.end(req.session.sinhvien.email)
})

//Xử lý - thông báo về những liên kết không được hỗ trợ trong hệ thống
app.use((req, res) => {
    res.set('Content-Type', 'text/html')
    res.end('Liên kết này không được hỗ trợ')
})

io.on('connection', (socket) => {
    socket.on('message', function(msg) {
        io.emit('message', msg);
      });
  });

//kết nối với cở sở dữ liệu (mongo atlas)
mongoose.connect('mongodb+srv://doanwebnangcao:doan123456@doanwebnangcao.0runb.mongodb.net/doanwebnangcao?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
})
.then(() => {
    //chỉ khởi chạy server khi đã kết được với database
    const PORT = process.env.PORT || 3000;
    http.listen(PORT, () => {
        console.log('App listening on port: http://localhost:' + PORT)
    })
})
.catch(e => console.log('Không thể kết nối với cở sở dữ liệu ' ))


