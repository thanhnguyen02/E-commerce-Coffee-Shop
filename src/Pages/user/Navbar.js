import React, { useState } from 'react';
import './Navbar.css';
import logo from '../img/logo.jpg';
import { FaShoppingCart } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Navbar = () =>{
        const [menu, setMenu]= useState("shop");

    return(
        <div className='navbar'>
            <div className="navbar-logo">
                <img src={logo} alt="" />
                <p>AVENKATI</p>
            </div>
            <ul className="navbar-menu">
                <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration:'none'}} to='/'>SHOP</Link>{menu==="shop"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("post")}}><Link style={{textDecoration:'none'}} to='/post'>POST</Link>{menu==="post"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("coffee")}}><Link style={{textDecoration:'none'}} to='/coffee'>COFFEE</Link>{menu==="coffee"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("fruit")}}><Link style={{textDecoration:'none'}} to='/fruit'>FRUIT</Link>{menu==="fruit"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("fns")}}><Link style={{textDecoration:'none'}} to='/fns'>SPRITE FRUIT</Link>{menu==="fns"?<hr/>:<></>}</li>
            </ul>
            <div className="navbar-login">
                <Link to='/login'><button>Login</button></Link>
                <Link to='/cart'><FaShoppingCart className='icon-shopping'/></Link>
                <div className="cart-count">0</div>
            </div>
        </div>
    )
}
export default Navbar