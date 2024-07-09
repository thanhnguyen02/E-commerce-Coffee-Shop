import React, { useContext, useEffect } from 'react';
import { ShopContext } from './shop/Context/ShopContext';
import './UserPage.css';
import { Link } from 'react-router-dom';

const UserPage = () => {
  const { userInfo, all_img, fetchBills, bills } = useContext(ShopContext);

  useEffect(() => {
    fetchBills(); // Gọi hàm fetchBills để lấy dữ liệu hóa đơn
  }, [fetchBills]);

  const billArray = bills || []; // Đảm bảo billArray là mảng rỗng nếu bills là null hoặc undefined

  return (
    <div className="user-page">
      <div className="user-info">
        <h2>Thông tin người dùng</h2>
        <label>Email:</label>
        <input type="text" value={userInfo ? userInfo.email : ''} readOnly />
        <label>Tên:</label>
        <input type="text" value={userInfo ? userInfo.name : ''} readOnly />
        <label>Địa chỉ:</label>
        <input type="text" value={userInfo ? userInfo.address : ''} readOnly />
        <label>Giới tính:</label>
        <input type="text" value={userInfo ? userInfo.gender : ''} readOnly />
        <label>Số điện thoại:</label>
        <input type="text" value={userInfo ? userInfo.number : ''} readOnly />
        <div><Link to='/edituser'><button className="button">Chỉnh sửa</button></Link></div>
      </div>

      <div className="bills">
        <h2>Đơn hàng của bạn</h2>
        <div className="bills-column">
          <p>Mã hóa đơn</p>
          <p>Tên sản phẩm - số lượng</p>
          <p>Tổng tiền</p>
          <p>Mã thanh toán</p>
          <p>Ngày tạo</p>
          <p>Số điện thoại</p>
          <p>Địa chỉ</p>
          <p>Trạng thái</p>
        </div>
        
        {billArray.map((bill, index) => (
          <div key={index} className="bill-row">
            <p>{bill.id_bill}</p>
            <div>
              {Object.entries(bill.id_product).map(([key, quantity]) => {
                const productId = parseInt(key);
                if (quantity > 0) {
                  const productName = all_img.find(product => product.id === productId)?.name || 'Unknown';
                  return (
                    <p key={productId}>
                      {productName}: {quantity}
                    </p>
                  );
                }
                return null;
              })}
            </div>
            <p>{bill.total}</p>
            <p>{bill.payment_id}</p>
            <p>{new Date(bill.date).toLocaleDateString()}</p>
            <p>{bill.number}</p>
            <p>{bill.address} - {bill.distric}</p>
            <p>{bill.status_bill}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
