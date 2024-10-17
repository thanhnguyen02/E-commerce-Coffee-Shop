import React, { useContext, useState } from 'react';
import { ShopContext } from './shop/Context/ShopContext'; 
import './UserPage.css';

const EditUser = () => {
    const { userInfo, setUserInfo } = useContext(ShopContext); 

    const [name, setName] = useState(userInfo ? userInfo.name : '');
    const [address, setAddress] = useState(userInfo ? userInfo.address : '');
    const [gender, setGender] = useState(userInfo ? userInfo.gender : '');
    const [number, setNumber] = useState(userInfo ? userInfo.number : '');

    const handleUpdate = () => {
        const token = localStorage.getItem('auth-token'); // Lấy token từ localstorage 
    
        const updatedInfo = { email: userInfo.email, name, address, gender, number };
    
        fetch('http://localhost:5000/updateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token  // Gửi token JWT trong header
            },
            body: JSON.stringify(updatedInfo),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                
                alert('Thông tin người dùng đã được cập nhật thành công!');
                window.location.href = '/user'; 
            } else {
                alert('Có lỗi xảy ra khi cập nhật thông tin người dùng.');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu cập nhật:', error);
            alert('Có lỗi xảy ra khi gửi yêu cầu cập nhật.');
        });
    };
    

    return (
        <div className="user-page">
            <div className="user-info">
                <h2>Thông tin người dùng</h2>
                <label>Email:</label>
                <input type="text" value={userInfo ? userInfo.email : ''} readOnly />
                <label>Tên:</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
                <label>Địa chỉ:</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} />
                <label>Giới tính:</label>
                <input type="text" value={gender} onChange={e => setGender(e.target.value)} />
                <label>Số điện thoại:</label>
                <input type="text" value={number} onChange={e => setNumber(e.target.value)} />
                <div>
                    <button onClick={handleUpdate}>Cập nhật</button>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
