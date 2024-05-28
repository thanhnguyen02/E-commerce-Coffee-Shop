import React from 'react'
import './Footer.css'
import logo from '../../img/logo.jpg';
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
const Footer = () => {
  return (
    <div className='footer'>
      <div class="footer-logo">
        <img src={logo} alt=""/>
        <p>AVENKATI</p>
      </div>
      <ul className='footer-link'>
        <li>Giới thiệu</li>
        <li>Thông tin</li>
        <li>Cửa hàng</li>
        <li>Liên hệ</li>
        <li>Cơ hội nghề nghiệp</li>
      </ul>
      <div class="footer-icon">
        <div class="icon-container">
            <FaFacebookSquare />
        </div>
        <div class="icon-container">
            <FaInstagramSquare />
        </div>
        <div class="icon-container">
            <FaTwitterSquare />
        </div>
      </div>
      <div class="footer-copyright">
        <hr/>
        <p className='cpbl'>Copyright by Luca</p>
      </div>
    </div>
  )
}

export default Footer
