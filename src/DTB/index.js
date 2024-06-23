const port = 5000;
const express = require("express");
const app = express();
const mysql = require('mysql');
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");

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
    const { id, name, image, category, describe_detail,new_price,  cost,quantity, tag} = req.body;
    
    const sql = 'INSERT INTO product (id, name, image, category,describe_detail, new_price, cost,quantity,tag) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?)';
    const values = [id, name, image, category,describe_detail, new_price, cost,quantity, tag];

    dbConn.query(sql, values, (error, results) => {
        if (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi thêm sản phẩm', error: error });
            return;
        }
        res.status(200).json({ success: 1, message: 'Thêm sản phẩm thành công' });
    });
});

// Sửa sản phẩm
app.put('/editproduct/:id', (req, res) => {
    const id = req.params.id;
    const { name, image, category, new_price,describe_detail, cost,quantity, tag } = req.body;

    const sql = 'UPDATE product SET name = ?, image = ?,describe_detail=?, category = ?, new_price = ?, cost = ?,quantity=?,tag=? WHERE id = ?';
    const values = [name, image, category,describe_detail, new_price, cost,quantity,tag, id];

    dbConn.query(sql, values, (error, results) => {
        if (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi cập nhật sản phẩm', error: error });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ success: 0, message: 'Không tìm thấy sản phẩm với id đã cho' });
            return;
        }
        res.status(200).json({ success: 1, message: 'Cập nhật sản phẩm thành công' });
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

// Endpoint GET để lấy thông tin sản phẩm theo id
app.get('/product/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'SELECT * FROM product WHERE id = ?';
    dbConn.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy thông tin sản phẩm:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi lấy thông tin sản phẩm', error: error });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ success: 0, message: 'Không tìm thấy sản phẩm với id đã cho' });
            return;
        }
        const product = results[0];
        res.status(200).json({ success: 1, product: product });
    });
});

// Lấy tất cả sản phẩm
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

app.post('/searchproduct', (req, res) => {
    const productName = req.body.name;
    const sql = 'SELECT * FROM product WHERE name LIKE ? OR tag LIKE ?';

    // Sử dụng wildcard để tìm kiếm theo tên sản phẩm
    const queryParam = `%${productName}%`;

    // Truyền tham số hai lần để khớp với hai điều kiện LIKE
    dbConn.query(sql, [queryParam, queryParam], (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy sản phẩm:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi lấy sản phẩm', error: error });
            return;
        }
        res.status(200).json({ success: 1, products: results });
    });
});



app.get('/allpost', (req, res) => {
    const sql = 'SELECT * FROM post';
    
    dbConn.query(sql, (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy bài viết:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi lấy bài viết', error: error });
            return;
        }
        res.status(200).json({ success: 1, post: results });
    });
});

app.post('/addpost', (req, res) => {
    const { post_id, title, content, image, tag} = req.body;
    
    const sql = 'INSERT INTO post (post_id, title, content, image,tag) VALUES (?, ?, ?, ?, ?)';
    const values = [post_id, title, content, image, tag];

    dbConn.query(sql, values, (error, results) => {
        if (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi thêm sản phẩm', error: error });
            return;
        }
        res.status(200).json({ success: 1, message: 'Thêm sản phẩm thành công' });
    });
});

// Middleware để xác thực người dùng
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "token error" });
    } else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            return res.status(401).send({ errors: "token error" });
        }
    }
};
//endpoint lay du lieu gio hang cua ng dung
app.post('/getcart', fetchUser, (req, res) => {
    console.log("GetCart");

    // Lấy email của người dùng từ req.user
    const userEmail = req.user.email;

    // Truy vấn để lấy dữ liệu giỏ hàng của người dùng
    const selectSql = 'SELECT cartData FROM user WHERE email = ?';
    dbConn.query(selectSql, [userEmail], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: 0, message: 'Database query error', error: err });
        }
        if (results.length > 0) {
            // Nếu có kết quả, lấy dữ liệu giỏ hàng từ kết quả truy vấn
            let cartData = JSON.parse(results[0].cartData);
            res.status(200).json(cartData);
        } else {
            // Nếu không tìm thấy người dùng
            res.status(404).json({ success: 0, message: 'User not found' });
        }
    });
});


// Endpoint thêm sản phẩm vào giỏ hàng
app.post('/addtocart', fetchUser, (req, res) => {
    if (!req.user || !req.user.email) {
        return res.status(400).json({ success: 0, message: 'User data is missing or invalid' });
    }

    const userEmail = req.user.email;
    const itemId = req.body.itemId;

    // Truy vấn để lấy dữ liệu giỏ hàng của người dùng
    const selectSql = 'SELECT cartData FROM user WHERE email = ?';
    dbConn.query(selectSql, [userEmail], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: 0, message: 'Database query error', error: err });
        }
        if (results.length > 0) {
            let cartData = JSON.parse(results[0].cartData);

            // Cập nhật số lượng sản phẩm trong giỏ hàng
            if (cartData[itemId]) {
                cartData[itemId] += 1;
            } else {
                cartData[itemId] = 1;
            }

            // Cập nhật giỏ hàng trong cơ sở dữ liệu
            const updateSql = 'UPDATE user SET cartData = ? WHERE email = ?';
            dbConn.query(updateSql, [JSON.stringify(cartData), userEmail], (err, results) => {
                if (err) {
                    console.error('Database update error:', err);
                    return res.status(500).json({ success: 0, message: 'Database update error', error: err });
                }
                res.status(200).json({ success: 1, message: 'Thêm sản phẩm vào giỏ hàng thành công' });
            });
        } else {
            res.status(404).json({ success: 0, message: 'User not found' });
        }
    });
});


// Endpoint xóa sản phẩm khỏi giỏ hàng
app.post('/removefromcart', fetchUser, (req, res) => {
    if (!req.user || !req.user.email) {
        return res.status(400).json({ success: 0, message: 'User data is missing or invalid' });
    }

    const userEmail = req.user.email;
    const itemId = req.body.itemId;

    // Truy vấn để lấy dữ liệu giỏ hàng của người dùng
    const selectSql = 'SELECT cartData FROM user WHERE email = ?';
    dbConn.query(selectSql, [userEmail], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: 0, message: 'Database query error', error: err });
        }
        if (results.length > 0) {
            let cartData = JSON.parse(results[0].cartData);

            // Kiểm tra xem sản phẩm có tồn tại trong giỏ hàng không
            if (!cartData[itemId]) {
                return res.status(400).json({ success: 0, message: 'Sản phẩm không tồn tại trong giỏ hàng' });
            }

            // Giảm số lượng sản phẩm trong giỏ hàng
            if (cartData[itemId] > 1) {
                cartData[itemId] -= 1;
            } else {
                delete cartData[itemId]; // Nếu số lượng là 1 thì xóa khỏi giỏ hàng
            }

            // Cập nhật giỏ hàng trong cơ sở dữ liệu
            const updateSql = 'UPDATE user SET cartData = ? WHERE email = ?';
            dbConn.query(updateSql, [JSON.stringify(cartData), userEmail], (err, results) => {
                if (err) {
                    console.error('Database update error:', err);
                    return res.status(500).json({ success: 0, message: 'Database update error', error: err });
                }
                res.status(200).json({ success: 1, message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
            });
        } else {
            res.status(404).json({ success: 0, message: 'User not found' });
        }
    });
});


// Đăng ký người dùng
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

            const tokenData = { user: { email: email } };

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

        const tokenData = { user: { email: email } };

        const token = jwt.sign(tokenData, 'secret_ecom');
        res.json({ success: true, token });
    });
});

app.listen(port, () => {
    console.log(`API đang chạy trên cổng ${port}`);
});
