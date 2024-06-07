const port = 5000;
const express = require("express");
const app = express();
const mysql = require('mysql');
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { error } = require("console");
const { JsonWebTokenError } = require("jsonwebtoken");



app.use(express.json());
app.use(cors());

const dbConn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    port: '3307',
    database: 'datn'
});

dbConn.connect((err) => {
    if (err) {
        console.error('Kết nối cơ sở dữ liệu thất bại:', err);
        return;
    }
    console.log('Kết nối cơ sở dữ liệu thành công');
});

app.get("/", (req, res) => {
    res.send("API đang chạy");
});

// Lưu ảnh
const storage = multer.diskStorage({
    destination: './upload/image',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

app.use('/image', express.static('upload/image'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/image/${req.file.filename}`
    });
});

// Thêm sản phẩm
app.post('/addproduct', (req, res) => {
    const { id, name, image, category, new_price, old_price } = req.body;
    
    const sql = 'INSERT INTO product (id, name, image, category, new_price, old_price) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [id, name, image, category, new_price, old_price];

    dbConn.query(sql, values, (error, results) => {
        if (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi thêm sản phẩm', error: error });
            return;
        }
        res.status(200).json({ success: 1, message: 'Thêm sản phẩm thành công' });
    });
});

// Xóa sản phẩm
app.delete('/deleteproduct', (req, res) => {
    const { id } = req.body;

    if (!id) {
        res.status(400).json({ success: 0, message: 'ID sản phẩm là bắt buộc' });
        return;
    }
    
    const sql = 'DELETE FROM product WHERE id = ?';
    
    dbConn.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi xóa sản phẩm', error: error });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ success: 0, message: 'Không tìm thấy sản phẩm' });
            return;
        }
        res.status(200).json({ success: 1, message: 'Xóa sản phẩm thành công' });
    });
});

//lay tat ca san pham
app.get('/allproduct', (req, res) => {
    const sql = 'SELECT * FROM product';
    
    dbConn.query(sql, (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy sản phẩm:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi lấy sản phẩm', error: error });
            return;
        }
        res.status(200).json({ success: 1, products: results });
    });
});


app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Kiểm tra email đã tồn tại hay chưa
    const checkEmailSql = 'SELECT * FROM user WHERE email = ?';
    dbConn.query(checkEmailSql, [email], (error, results) => {
        if (error) {
            console.error('Lỗi khi kiểm tra email:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi kiểm tra email', error: error });
            return;
        }

        if (results.length > 0) {
            res.status(400).json({ success: false, message: 'Email đã tồn tại' });
            return;
        }

        // Tạo giỏ hàng mặc định
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        // Thêm người dùng mới vào cơ sở dữ liệu
        const insertUserSql = 'INSERT INTO user (name, email, password, cartdata) VALUES (?, ?, ?, ?)';
        const values = [name, email, password, JSON.stringify(cart)];

        dbConn.query(insertUserSql, values, (error, results) => {
            if (error) {
                console.error('Lỗi khi thêm người dùng:', error);
                res.status(500).json({ success: false, message: 'Lỗi khi thêm người dùng', error: error });
                return;
            }

            const userId = results.insertId;
            const tokenData = {
                u: {
                    id: userId
                }
            };

            const token = jwt.sign(tokenData, 'secret_ecom');
            res.json({ success: true, token });
        });
    });
});


// Đăng nhập người dùng
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra email và mật khẩu
    const sql = 'SELECT * FROM user WHERE email = ?';
    dbConn.query(sql, [email], (error, results) => {
        if (error) {
            console.error('Lỗi khi tìm người dùng:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi tìm người dùng', error: error });
            return;
        }

        if (results.length === 0) {
            res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
            return;
        }

        const user = results[0];

        if (user.password !== password) {
            res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
            return;
        }

        const tokenData = {
            u: {
                id: user.id
            }
        };

        const token = jwt.sign(tokenData, 'secret_ecom');
        res.json({ success: true, token });
    });
});

app.listen(port, () => {
    console.log(`API đang chạy trên cổng ${port}`);
});
