import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login được thực thi", formData);
    let responseData;
    await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    }).then((response) => response.json()).then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.message || "Đăng nhập thất bại");
    }
  };

  const signup = async () => {
    console.log("Sign up được thực thi", formData);
    let responseData;
    await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className='login-signup'>
      <div className="login-signup-container">
        <h1>{state}</h1>
        <div className="signup-field">
          {state === "Sign up" ? <input name='name' value={formData.name} onChange={changeHandler} type="text" placeholder='Tên' /> : <></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="text" placeholder='Email' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Mật khẩu' />
        </div>
        <button onClick={() => { state === "Login" ? login() : signup() }}>Tiếp tục</button>
        {state === "Sign up"
          ? <p className='login'>Bạn đã có tài khoản? <span onClick={() => { setState("Login") }}>Đăng nhập</span></p>
          : <p className='login'>Đăng ký tài khoản mới <span onClick={() => { setState("Sign up") }}>Đăng ký</span></p>}
      </div>
    </div>
  );
};

export default LoginPage;
