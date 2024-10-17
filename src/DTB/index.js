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
    const { id, name, image, category, describe_detail,new_price,  cost,quantity, tag, status} = req.body;
    
    const sql = 'INSERT INTO product (id, name, image, category,describe_detail, new_price, cost,quantity,tag,status) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?,?)';
    const values = [id, name, image, category,describe_detail, new_price, cost,quantity, tag,status];

    dbConn.query(sql, values, (error, results) => {
        if (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi thêm sản phẩm', error: error });
            return;
        }
        res.status(200).json({ success: 1, message: 'Thêm sản phẩm thành công' });
    });
});
app.post('/addreview', (req, res) => {
    const { review_id, product_id , user_email , rating , comment,review_date} = req.body;
    
    const sql = 'INSERT INTO review (review_id, product_id , user_email , rating , comment,review_date) VALUES (?, ?, ?,?, ?, ?)';
    const values = [review_id, product_id , user_email , rating , comment,review_date];

    dbConn.query(sql, values, (error, results) => {
        if (error) {
            console.error('Lỗi khi thêm đánh giá:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi thêm đánh giá', error: error });
            return;
        }
        res.status(200).json({ success: 1, message: 'Thêm đánh giá thành công' });
    });
});
app.get('/review/:id', (req, res) => {
    const productId = req.params.id;

    const sql = 'SELECT user.name, review.rating, review.comment, review.review_date FROM user JOIN review ON user.email = review.user_email WHERE product_id = ?';
    
    dbConn.query(sql, [productId], (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy thông tin đánh giá:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi lấy thông tin đánh giá', error: error });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ success: 0, message: 'Không tìm thấy đánh giá nào cho sản phẩm với id đã cho' });
            return;
        }
        res.status(200).json({ success: 1, reviews: results });
    });
});

// Endpoint lấy rating của sp theo id
app.get('/getrating/:id', (req, res) => {
    const productId = req.params.id;
    const sql = "SELECT AVG(rating) AS averageRating FROM review WHERE product_id = ?";

    dbConn.query(sql, [productId], (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy rating sản phẩm:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi lấy rating sản phẩm', error: error });
            return;
        }
        if (results.length === 0 || results[0].averageRating === null) {
            res.status(404).json({ success: 0, message: 'Không tìm thấy rating cho sản phẩm' });
        } else {
            res.status(200).json({ success: 1, averageRating: results[0].averageRating });
        }
    });
});

// Sửa sp
app.put('/editproduct/:id', (req, res) => {
    const id = req.params.id;
    const { name, image, category, new_price, describe_detail, cost, quantity, tag, status } = req.body;

    const sql = 'UPDATE product SET name = ?, image = ?, describe_detail = ?, category = ?, new_price = ?, cost = ?, quantity = ?, tag = ?, status = ? WHERE id = ?';
    const values = [name, image, describe_detail, category, new_price, cost, quantity, tag, status, id];

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



// Xóa sp
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

// Endpoint lấy thông tin sản phẩm theo id
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

    // Truyền tham số hai lần để khớp với hai đk LIKE
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
    const sql = 'SELECT * FROM post WHERE status LIKE "%on%" ORDER BY post_date DESC';
    
    dbConn.query(sql, (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy bài viết:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi lấy bài viết', error: error });
            return;
        }
        res.status(200).json({ success: 1, post: results });
    });
});

app.get('/allpostadmin', (req, res) => {
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

app.get('/post/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'SELECT * FROM post WHERE post_id = ?';
    dbConn.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy thông tin bài viết:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi lấy thông tin bài viết', error: error });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ success: 0, message: 'Không tìm thấy bài viết với id đã cho' });
            return;
        }
        const product = results[0];
        res.status(200).json({ success: 1, product: product });
    });
});

app.post('/addpost', (req, res) => {
    const { post_id, title, content, image, tag, status} = req.body;
    
    const sql = 'INSERT INTO post (post_id, title, content, image,tag, status) VALUES (?, ?, ?, ?, ?,?)';
    const values = [post_id, title, content, image, tag,status];

    dbConn.query(sql, values, (error, results) => {
        if (error) {
            console.error('Lỗi khi thêm bài viết:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi thêm bài viết', error: error });
            return;
        }
        res.status(200).json({ success: 1, message: 'Thêm bài viết thành công' });
    });
});
app.post('/adddiscount', (req, res) => {
    const { code, percent, quantity} = req.body;
    
    const sql = 'INSERT INTO discount (code, percent, quantity) VALUES (?, ?, ?)';
    const values = [code, percent, quantity];

    dbConn.query(sql, values, (error, results) => {
        if (error) {
            console.error('Lỗi khi thêm mã giảm giá:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi thêm mã giảm giá', error: error });
            return;
        }
        res.status(200).json({ success: 1, message: 'Thêm mã giảm giá thành công' });
    });
});
// Sửa bài viết
app.put('/editpost/:id', (req, res) => {
    const id = req.params.id;
    const { title, content, image, tag, status } = req.body;

    const sql = 'UPDATE post SET title = ?, content = ?, image = ?, tag = ?, status = ? WHERE post_id = ?';
    const values = [title, content, image, tag, status, id];

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


app.post('/mail', (req, res) => {
    const { mail } = req.body;
  
    if (!mail) {
      return res.status(400).json({ success: 0, message: 'Thiếu email' });
    }
  
    // Ktra xem email đã tồn tại chưa
    const checkSql = 'SELECT * FROM mail_recommend WHERE mail = ?';
    dbConn.query(checkSql, [mail], (error, results) => {
      if (error) {
        console.error('Lỗi khi kiểm tra Mail', error);
        return res.status(500).json({ success: 0, message: 'Lỗi khi kiểm tra Mail', error: error });
      }
  
      if (results.length > 0) {
        return res.status(409).json({ success: 0, message: 'Email đã tồn tại' });
      }
  
      // Nếu email chưa tt,chèn vào cơ sở dữ liệu
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
  
// Middleware xác thực người dùng
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
    // Lấy email của ngdung từ req.user
    const userEmail = req.user.email;

    
    const selectSql = 'SELECT cartData FROM user WHERE email = ?';
    dbConn.query(selectSql, [userEmail], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: 0, message: 'Database query error', error: err });
        }
        if (results.length > 0) {
            // Nếu có kq, lấy dữ liệu giỏ hàng từ kq truy vấn
            let cartData = JSON.parse(results[0].cartData);
            res.status(200).json(cartData);
        } else {
            // Neu không tìm thấy ngdung
            res.status(404).json({ success: 0, message: 'User not found' });
        }
    });
});

app.get('/allbills', (req, res) => {
    const sql = 'SELECT * FROM bills ORDER BY date DESC';
    
    dbConn.query(sql, (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy đơn hàng:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi lấy đơn hàng', error: error });
            return;
        }
        res.status(200).json({ success: 1, post: results });
    });
});

app.get('/alldiscount', (req, res) => {
    const sql = 'SELECT * FROM discount';
    
    dbConn.query(sql, (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy danh sách mã giảm giá:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi lấy danh sách mã giảm giá', error: error });
            return;
        }
        res.status(200).json({ success: 1, post: results });
    });
});

app.get('/alluser', (req, res) => {
    const sql = 'SELECT user.name, user.email, user.password, customer.address, customer.gender, customer.number, user.role_id FROM user JOIN customer ON user.email = customer.email';
    
    dbConn.query(sql, (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy danh sách người dùng:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi lấy danh sách người dùng', error: error });
            return;
        }
        res.status(200).json({ success: 1, post: results });
    });
});

app.put('/updatebill/:billId', (req, res) => {
    const billId = req.params.billId;
    const { status_bill } = req.body;
  
    if (!status_bill) {
      return res.status(400).json({ success: 0, message: 'Status_bill is required' });
    }
  
    const updateQuery = 'UPDATE bills SET status_bill = ? WHERE id_bill = ?';
  
    dbConn.query(updateQuery, [status_bill, billId], (err, result) => {
      if (err) {
        console.error('Lỗi khi cập nhật đơn hàng:', err);
        return res.status(500).json({ success: 0, message: 'Lỗi khi cập nhật đơn hàng' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: 0, message: 'Đơn hàng không tồn tại' });
      }
  
      res.json({ success: 1, message: 'Cập nhật đơn hàng thành công' });
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
                // Chuyển đổi id_product từ chuỗi JSON sang đtượng cho all hóa đơn
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

app.post('/checkdiscount', (req, res) => {
    const { code } = req.body;

    const query = 'SELECT * FROM discount WHERE code = ?';
    dbConn.query(query, [code], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database query error' });
        }

        if (results.length > 0) {
            const discount = results[0];
            if (discount.quantity > 0) {
                // mgg hợp lệ và còn sl
                res.json({ success: true, percent: discount.percent });
            } else {
                // mgg hợp lệ nhưng đã hết số lượng
                res.json({ success: false, message: 'Mã giảm giá đã hết' });
            }
        } else {
            // mgg không hợp lệ
            res.json({ success: false, message: 'Mã giảm giá không hợp lệ' });
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


    const selectSql = 'SELECT cartData FROM user WHERE email = ?';
    dbConn.query(selectSql, [userEmail], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: 0, message: 'Database query error', error: err });
        }
        if (results.length > 0) {
            let cartData = JSON.parse(results[0].cartData);

            if (!cartData[itemId]) {
                return res.status(400).json({ success: 0, message: 'Sản phẩm không tồn tại trong giỏ hàng' });
            }

            if (cartData[itemId] > 1) {
                cartData[itemId] -= 1;
            } else {
                delete cartData[itemId]; 
            }

       
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
    const { name, email, password,role_id } = req.body;

    
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

        // Tạo ghang mặc định
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        
        const insertUserSql = 'INSERT INTO user (name, email, password, cartdata,role_id) VALUES (?, ?, ?, ?,?)';
        const values = [name, email, password, JSON.stringify(cart),'1'];

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

        const insertUserSql2 = 'INSERT INTO customer ( email) VALUES (?)';
        const values2 = [email];

        dbConn.query(insertUserSql2, values2, (error, results) => {
            if (error) {
                console.error('Lỗi khi thêm khách hàng:', error);
                res.status(500).json({ success: false, message: 'Lỗi khi thêm khách hàng', error: error });
                return;
            }
        });
    });
});

// Đăng nhập người dùng
app.post('/login', (req, res) => {
    const { email, password } = req.body;


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

// Đăng nhập người dùng
app.post('/loginadmin', (req, res) => {
    const { email, password } = req.body;

   
    const sql = 'SELECT * FROM user WHERE email = ? AND role_id = 2';
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
    const { email, id_product, quantity, total, discount, payment_id, date, number, name, distric, address, status_pay, status_bill, discountCode } = req.body;
    
    const sql = 'INSERT INTO bills (email, id_product, quantity, total, discount, payment_id, date, number, name, distric, address, status_pay, status_bill) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [email, JSON.stringify(id_product), quantity, total, discount, payment_id, date, number, name, distric, address, status_pay, status_bill];

    dbConn.query(sql, values, (error, results) => {
        if (error) {
            console.error('Lỗi khi thêm thông tin giao hàng:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi thêm thông tin giao hàng', error: error });
            return;
        }

        
        if (discountCode) {
            const updateDiscountQuery = 'UPDATE discount SET quantity = quantity - 1 WHERE code = ?';
            dbConn.query(updateDiscountQuery, [discountCode], (updateError, updateResults) => {
                if (updateError) {
                    console.error('Lỗi khi cập nhật số lượng mã giảm giá:', updateError);
                    res.status(500).json({ success: 0, message: 'Lỗi khi cập nhật số lượng mã giảm giá', error: updateError });
                    return;
                }
                console.log('Cập nhật số lượng mã giảm giá thành công');
            });
        }

        const id_bills = results.insertId;
        res.status(200).json({ success: 1, message: 'Thêm thông tin giao hàng thành công', id_bills });
    });
});



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

app.get('/api/statistics', (req, res) => {
    const totalOrdersQuery = 'SELECT COUNT(*) AS totalOrders FROM bills';
    const totalUsersQuery = 'SELECT COUNT(*) AS totalUsers FROM user';
    const totalRevenueQuery = 'SELECT SUM(total) AS totalRevenue FROM bills where status_bill LIKE "%đã hoàn thành%"';
    const salesDataQuery = `
        SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(total) AS sales 
        FROM bills 
        GROUP BY month
    `;
    const orderDataQuery = `
        SELECT DATE_FORMAT(date, '%Y-%m') AS month, COUNT(*) AS orders 
        FROM bills 
        GROUP BY month
    `;

    dbConn.query(totalOrdersQuery, (err, totalOrdersResult) => {
        if (err) throw err;

        dbConn.query(totalUsersQuery, (err, totalUsersResult) => {
            if (err) throw err;

            dbConn.query(totalRevenueQuery, (err, totalRevenueResult) => {
                if (err) throw err;

                dbConn.query(salesDataQuery, (err, salesDataResult) => {
                    if (err) throw err;

                    dbConn.query(orderDataQuery, (err, orderDataResult) => {
                        if (err) throw err;
                        
                        res.json({
                            totalOrders: totalOrdersResult[0].totalOrders,
                            totalUsers: totalUsersResult[0].totalUsers,
                            totalRevenue: totalRevenueResult[0].totalRevenue,
                            salesData: salesDataResult,
                            orderData: orderDataResult
                        });
                    });
                });
            });
        });
    });
});


app.get('/api/statisticsdate', (req, res) => {
    const { startDate, endDate } = req.query;

    const sql = 'SELECT COUNT(*) AS totalOrders, SUM(quantity) AS totalUsers, SUM(total) AS totalRevenue, MONTH(date) AS month, SUM(total) AS sales, COUNT(id_bill) AS orders FROM bills WHERE date BETWEEN ? AND ? AND status_bill LIKE "%đã hoàn thành%" GROUP BY month';

    dbConn.query(sql, [startDate, endDate], (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            res.status(500).json({ success: 0, message: 'Lỗi khi lấy dữ liệu', error: error });
            return;
        }

        const totalOrders = results.length;
        const totalUsers = results.reduce((sum, row) => sum + row.totalUsers, 0);
        const totalRevenue = results.reduce((sum, row) => sum + row.sales, 0);
        

        res.status(200).json({ totalOrders, totalUsers, totalRevenue });
    });
});


app.listen(port, () => {
    console.log(`API đang chạy trên cổng ${port}`);
});
