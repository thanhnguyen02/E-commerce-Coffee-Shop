import React from 'react'
import './LoginPage.css'
const LoginPage = () => {
  return (
    <div className='login-signup'>
      <div class="login-signup-container">
        <h1>Dang ky</h1>
        <div class="signup-field">
          <input type="text" placeholder='Ten'/>
          <input type="text" placeholder='Email'/>
          <input type="text" placeholder='Mat khau'/>
        </div>
        <button>Dang ky</button>
        <p className='login'>Ban da co tai khoan? <span>Dang nhap</span></p>
      </div>
      
    </div>
  )
}

export default LoginPage
