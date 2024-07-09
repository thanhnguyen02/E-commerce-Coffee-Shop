import React, { useState } from 'react';
import './Footer.css';
import logo from '../../img/logo.jpg';
import { FaFacebookSquare, FaInstagramSquare, FaTwitterSquare } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail: email }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Thêm Mail thành công');
        setEmail('');
      } else {
        if (data.message === 'Email đã tồn tại') {
          alert('Email đã tồn tại');
        } else {
          alert('Lỗi khi thêm Mail: ' + data.message);
        }
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu', error);
      alert('Lỗi khi gửi yêu cầu');
    }
  };

  return (
    <div className='footer'>
      <div className="footer-content">
        <div className="footer-section footer-about">
          <div className="footer-logo">
            <img src={logo} alt="Logo"/>
            <p>AVENKATI</p>
          </div>
          <ul className='footer-link'>
            <h3 style={{ marginLeft: '130px' }}>Về chúng tôi</h3>
            <li>Cửa hàng</li>
            <li>Về Chúng tôi</li>
            <li>Hệ thống cửa hàng</li>
          </ul>
        </div>
        <div className="footer-section footer-links">
          <div className="footer-icon">
            <a href="https://facebook.com"><li><FaFacebookSquare /><p>facebook.com/abc</p></li></a>
            <a href="https://instagram.com"><li><FaInstagramSquare /><p>instagram.com/abc</p></li></a>
            <a href="https://twitter.com"><li><FaTwitterSquare /><p>twitter.com/abc</p></li></a>
          </div>
          <p className='footer-contact'>EMAIL HỖ TRỢ KHÁCH HÀNG: abc@gmail.com</p>
          <p className='footer-contact'>HOTLINE HỖ TRỢ KHÁCH HÀNG: 123456789</p>
        </div>
        <div className="footer-section footer-newsletter">
          <h3>Nhận thông tin từ chúng tôi</h3>
          <p style={{ width: '350px' }}>Xin vui lòng để lại địa chỉ email, chúng tôi sẽ cập nhật những tin tức mới nhất</p>
          <form className='newsletter-form' onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder='Nhập email của bạn...'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Gửi</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <hr />
        <p>©Thanks for choosing</p>
      </div>
    </div>
  );
}

export default Footer;
