import React, { useContext, useState } from 'react';
import './Navbar.css';
import logo from '../img/logo.jpg';
import { FaShoppingCart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { ShopContext } from './shop/Context/ShopContext';
import SearchBar from './shop/Search/SearchBar'; 
import { IoIosSearch } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const { getQuantityCart } = useContext(ShopContext);

    return (
        <div className='navbar'>
            <div className="navbar-logo">
                <Link to='/'><img src={logo} alt="" /></Link>
                <p>AVENKATI</p>
            </div>
            <ul className="navbar-menu">
                
                <li onClick={() => { setMenu("shop") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='/'>SHOP</Link>{menu === "shop" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("post") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='/post' >POST</Link>{menu === "post" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("coffee") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='/coffee'>COFFEE</Link>{menu === "coffee" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("fruit") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='/fruit'>FRUIT</Link>{menu === "fruit" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("fns") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='/fns'>SPRITE FRUIT</Link>{menu === "fns" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("other") }}><Link style={{ textDecoration: 'none', color: 'black' }} to='/other'>OTHER</Link>{menu === "other" ? <hr /> : <></>}</li>
            </ul>
            <div className="navbar-search">
                <SearchBar />
            </div>
            <div className="navbar-login">
                {localStorage.getItem('auth-token')
                    ? (
                    <>
                        <a href="/user" style={{ fontSize: '40px', textDecoration: 'none', color: 'inherit', 'margin-top': '8px' }}><FaUserCircle /></a>

                        <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }}>Logout</button>
                        
                    </>
                )
                    : <Link to='/login'><button>Login</button></Link>
                }
                <Link to='/cart'><FaShoppingCart className='icon-shopping' /></Link>
                <div className="cart-count">{getQuantityCart()}</div>
            </div>
        </div>
    );
}

export default Navbar;
