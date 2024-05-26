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
        <li>Gioi thieu</li>
        <li>Thong tin</li>
        <li>Cua hang</li>
        <li>Lien he</li>
        <li>Co hoi nghe nghiep</li>
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
        <p style={{fontSize:'15px'}}>Copyright by Luca</p>
      </div>
    </div>
  )
}

export default Footer
