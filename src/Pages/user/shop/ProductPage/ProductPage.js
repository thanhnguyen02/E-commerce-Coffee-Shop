import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductPage.css';
import { FaStar } from "react-icons/fa";
import { ShopContext } from '../Context/ShopContext';

const ProductPage = ({ product }) => {
  const { addToCart, isLoggedIn, userInfo } = useContext(ShopContext);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [email, setEmail] = useState(userInfo.email || '');
  const [averageRating, setAverageRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (product && product.id) {
      fetch(`http://localhost:5000/getrating/${product.id}`)
        .then(response => response.json())
        .then(data => {
          if (data.success === 1) {
            setAverageRating(data.averageRating);
          } else {
            console.error('Lỗi khi lấy rating sản phẩm:', data.message);
          }
        })
        .catch(error => console.error('Lỗi khi lấy rating sản phẩm:', error));

      fetch(`http://localhost:5000/review/${product.id}`)
        .then(response => response.json())
        .then(data => {
          if (data.success === 1) {
            setReviews(data.reviews);
          } else {
            console.error('Lỗi khi lấy đánh giá sản phẩm:', data.message);
          }
        })
        .catch(error => console.error('Lỗi khi lấy đánh giá sản phẩm:', error));
    }
  }, [product]);

  if (!product) {
    return null; 
  }

  const handleReviewButtonClick = () => {
    if (!isLoggedIn()) {
      navigate('/login');
    } else {
      setShowReviewForm(true);
      setEmail(userInfo.email || ''); // Cap nhật email khi form đánh giá render
    }
  };

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      navigate('/login');
    } else {
      addToCart(product.id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const review = {
      product_id: product.id,
      user_email: formData.get('email'),
      rating: formData.get('rating'),
      comment: formData.get('review'),
      review_date: new Date().toISOString(),
    };

    try {
      const res = await fetch('http://localhost:5000/addreview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });

      const data = await res.json();
      if (data.success) {
        alert('Gửi đánh giá thành công.');
        setShowReviewForm(false);
        fetchReviews(); // upd lại danh sách đánh giá
      } else {
        alert('Gửi đánh giá thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      alert('Đã xảy ra lỗi khi gửi đánh giá.');
    }
  }

  const fetchReviews = () => {
    fetch(`http://localhost:5000/review/${product.id}`)
      .then(response => response.json())
      .then(data => {
        if (data.success === 1) {
          setReviews(data.reviews);
        } else {
          console.error('Lỗi khi lấy đánh giá sản phẩm:', data.message);
        }
      })
      .catch(error => console.error('Lỗi khi lấy đánh giá sản phẩm:', error));
  };

 
  return (
    <div className='productpage'>
      <div className="productpage-left">
        <div className="productpage-img">
          <img src={product.image} alt=""/>
        </div>
      </div>
      <div className="productpage-right">
        <h1>{product.name}</h1>
        <div className="productpage-star">
          {averageRating ? `${averageRating.toFixed(1)} / 5` : 'Chưa có đánh giá'} <FaStar />
        </div>
        
        <div className="product-mota">{product.describe_detail}</div>
        <div className="productpage-price">
          <div className="new-price">{parseFloat(product.new_price).toFixed(3)} VNĐ</div>
        </div>
        <button onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
        <button style={{ marginLeft: '30px', padding: '10px 45px' }} onClick={handleReviewButtonClick}>Đánh giá</button>
        <p className='add-category'><span>tag: </span>{product.tag}</p>

        {showReviewForm && (
          <div className="review-form">
            <h2>Đánh giá sản phẩm</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Email của bạn: 
                <input type="text" name="email" value={email} readOnly className='mail-re' required />
              </label>
              <label>
                Đánh giá của bạn: 
                <textarea name="review" required></textarea>
              </label>
              <label>
                Xếp hạng: 
                <select name="rating" required style={{marginLeft: '10px'}} className='option'>
                  <option value="5">5 điểm</option>
                  <option value="4">4 điểm</option>
                  <option value="3">3 điểm</option>
                  <option value="2">2 điểm</option>
                  <option value="1">1 điểm</option>
                </select>
              </label>
              <button type="submit">Gửi đánh giá</button>
            </form>
          </div>
        )}

       
        <div className="review-table">
          <h2>Đánh giá sản phẩm</h2>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Đánh giá</th>
                <th>Xếp hạng</th>
                <th>Ngày đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr key={index}>
                  <td>{review.name}</td>
                  <td>{review.comment}</td>
                  <td>{review.rating} <FaStar /></td>
                  <td>{new Date(review.review_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
