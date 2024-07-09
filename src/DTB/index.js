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
    const sql = 'SELECT * FROM product WHERE status LIKE "%on%"';
    
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
    const sql = 'SELECT * FROM product WHERE (name LIKE ? OR tag LIKE ?) AND status NOT LIKE "%hide%"';;

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
    const sql = 'SELECT * FROM post ORDER BY post_date DESC';
    
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
            console.error('Lỗi khi thêm bài viết:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi thêm bài viết', error: error });
            return;
        }
        res.status(200).json({ success: 1, message: 'Thêm bài viết thành công' });
    });
});
app.post('/mail', (req, res) => {
    const { mail } = req.body;
  
    if (!mail) {
      return res.status(400).json({ success: 0, message: 'Thiếu email' });
    }
  
    // Kiểm tra xem email đã tồn tại chưa
    const checkSql = 'SELECT * FROM mail_recommend WHERE mail = ?';
    dbConn.query(checkSql, [mail], (error, results) => {
      if (error) {
        console.error('Lỗi khi kiểm tra Mail', error);
        return res.status(500).json({ success: 0, message: 'Lỗi khi kiểm tra Mail', error: error });
      }
  
      if (results.length > 0) {
        return res.status(409).json({ success: 0, message: 'Email đã tồn tại' });
      }
  
      // Nếu email chưa tồn tại, thực hiện chèn vào cơ sở dữ liệu
      const insertSql = 'INSERT INTO mail_recommend (mail) VALUES (?)';
      dbConn.query(insertSql, [mail], (error, results) => {
        if (error) {
          console.error('Lỗi khi lưu Mail', error);
          return res.status(500).json({ success: 0, message: 'Lỗi khi lưu Mail', error: error });
        }
        res.status(200).json({ success: 1, message: 'Thêm Mail thành công' });
      });
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

app.post('/bills', fetchUser, (req, res) => {
    console.log("GetBills");
    const userEmail = req.user.email; // Lấy email từ user đã xác thực

    const selectSql = 'SELECT id_bill, id_product, total, payment_id, date, number, address, distric, status_bill FROM bills WHERE email = ?';
    dbConn.query(selectSql, [userEmail], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu:', err);
            return res.status(500).json({ success: 0, message: 'Lỗi truy vấn cơ sở dữ liệu', error: err });
        }
        if (results.length > 0) {
            try {
                // Chuyển đổi id_product từ chuỗi JSON sang đối tượng cho tất cả các hóa đơn
                results.forEach((bill) => {
                    bill.id_product = JSON.parse(bill.id_product);
                });
            } catch (parseError) {
                console.error('Lỗi phân tích chuỗi JSON:', parseError);
                return res.status(500).json({ success: 0, message: 'Lỗi phân tích chuỗi JSON', error: parseError });
            }
            res.json({ success: 1, data: results });
        } else {
            res.status(404).json({ success: 0, message: 'Không tìm thấy hóa đơn' });
        }
    });
});


app.post('/user', fetchUser, (req, res) => {
    console.log("GetUser")
    const userEmail = req.user.email; // Lấy email từ user đã xác thực

    const selectSql = 'SELECT user.email, user.name, customer.address, customer.gender, customer.number FROM user JOIN customer ON user.email = customer.email WHERE user.email = ?';
    dbConn.query(selectSql, [userEmail], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu:', err);
            return res.status(500).json({ success: 0, message: 'Lỗi truy vấn cơ sở dữ liệu', error: err });
        }
        if (results.length > 0) {
            res.json({ success: 1, data: results[0] });
        } else {
            res.status(404).json({ success: 0, message: 'Không tìm thấy người dùng' });
        }
    });
});

app.post('/updateUser', fetchUser, (req, res) => {
    const { email, name, address, gender, number } = req.body; // Nhận các thông tin cần cập nhật từ client

    const updateSql = 'UPDATE customer c ' +
                      'JOIN user u ON u.email = c.email ' +
                      'SET u.name = ?, c.address = ?, c.gender = ?, c.number = ? ' +
                      'WHERE u.email = ?';
    dbConn.query(updateSql, [name, address, gender, number, email], (err, results) => {
        if (err) {
            console.error('Lỗi cập nhật thông tin người dùng:', err);
            return res.status(500).json({ success: 0, message: 'Lỗi cập nhật thông tin người dùng', error: err });
        }
        res.json({ success: 1, message: 'Thông tin người dùng đã được cập nhật thành công' });
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



// Thêm thông tin giao hàng vào bảng bills
app.post('/addbill', (req, res) => {
    const { email, id_product, quantity, total, discount, payment_id, date, number, name, distric, address, status_pay, status_bill } = req.body;
    
    const sql = 'INSERT INTO bills (email, id_product, quantity, total, discount, payment_id, date, number, name, distric, address, status_pay, status_bill) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [email, JSON.stringify(id_product), quantity, total, discount, payment_id, date, number, name, distric, address, status_pay, status_bill];

    dbConn.query(sql, values, (error, results) => {
        if (error) {
            console.error('Lỗi khi thêm thông tin giao hàng:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi thêm thông tin giao hàng', error: error });
            return;
        }
        const id_bills = results.insertId;
        res.status(200).json({ success: 1, message: 'Thêm thông tin giao hàng thành công',id_bills });
    });
});

//const port = 5000;
app.post('/addvnpay', (req, res) => {
    const { vnp_Amount, vnp_BankCode, vnp_CardType, vnp_OrderInfo, vnp_PayDate, vnp_ResponseCode, vnp_TmnCode, vnp_TransactionNo, vnp_TransactionStatus, vnp_TxnRef, vnp_SecureHash } = req.body;
    
    const sql = 'INSERT INTO vnpay (vnp_Amount, vnp_BankCode, vnp_CardType, vnp_OrderInfo, vnp_PayDate, vnp_ResponseCode, vnp_TmnCode, vnp_TransactionNo, vnp_TransactionStatus, vnp_TxnRef, vnp_SecureHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [vnp_Amount, vnp_BankCode, vnp_CardType, vnp_OrderInfo, vnp_PayDate, vnp_ResponseCode, vnp_TmnCode, vnp_TransactionNo, vnp_TransactionStatus, vnp_TxnRef, vnp_SecureHash];

    dbConn.query(sql, values, (error, results) => {
        if (error) {
            console.error('Lỗi khi thêm thông tin VNPay:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi thêm thông tin VNPay', error: error });
            return;
        }
        const id_vnpay = results.insertId;
        res.status(200).json({ success: 1, message: 'Thêm thông tin VNPay thành công', id_vnpay });
    });
});



app.listen(port, () => {
    console.log(`API đang chạy trên cổng ${port}`);
});
