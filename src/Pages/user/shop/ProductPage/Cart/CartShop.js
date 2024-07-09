import React, { useContext, useState, useEffect } from 'react';
import './CartItem.css';
import { ShopContext } from '../../Context/ShopContext';
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";

const CartShop = () => {
    const { getTotalCart, all_img, cartItem, addToCart, removeToCart } = useContext(ShopContext);
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        email: '',
        city: '',
        district: '',
        specificAddress: '',
        phone: ''
    });

    useEffect(() => {
        const userEmail = localStorage.getItem('user-email');
        if (userEmail) {
            setShippingInfo((prevInfo) => ({
                ...prevInfo,
                email: userEmail
            }));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo({
            ...shippingInfo,
            [name]: value
        });
    };

    const handlePaymentClick = () => {
        const amount = (getTotalCart()+30) * 1000;
        window.location.href = `http://localhost:8888/order/create_payment_url?amount=${amount}`;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Tính toán tổng số lượng sản phẩm và tổng giá trị
        let totalQuantity = 0;
        let totalPrice = 0;
        all_img.forEach((item) => {
            if (cartItem[item.id] > 0) {
                totalQuantity += cartItem[item.id];
                totalPrice += cartItem[item.id] * parseFloat(item.new_price);
            }
        });

        // Ví dụ giảm giá (có thể thay đổi theo logic của bạn)
        const discount = 0; // hoặc lấy giá trị từ input mã giảm giá

        // Lưu các giá trị này vào localStorage
        localStorage.setItem('productId', JSON.stringify(cartItem)); // Lưu toàn bộ giỏ hàng
        localStorage.setItem('quantity', totalQuantity);
        localStorage.setItem('total', totalPrice);
        localStorage.setItem('discount', discount);

        // Lưu thông tin giao hàng vào localStorage
        localStorage.setItem('shippingName', shippingInfo.name);
        localStorage.setItem('shippingEmail', shippingInfo.email);
        localStorage.setItem('shippingCity', shippingInfo.city);
        localStorage.setItem('shippingDistrict', shippingInfo.district);
        localStorage.setItem('shippingSpecificAddress', shippingInfo.specificAddress);
        localStorage.setItem('shippingPhone', shippingInfo.phone);

        console.log('Shipping Info:', shippingInfo);

        // Chuyển hướng đến trang thanh toán
        handlePaymentClick();
    };

    return (
        <div className='cartshop'>
            <h2>Giỏ hàng của bạn</h2>
            <div className="cart-main">
                <p>Sản phẩm</p>
                <p>Tên sản phẩm</p>
                <p>Giá tiền</p>
                <p>Số lượng</p>
                <p>Thành tiền</p>
                <p>Thao tác</p>
            </div>
            <hr />
            {all_img.map((i) => {
                if (cartItem[i.id] > 0) {
                    return (
                        <div key={i.id}>
                            <div className="cartitem-format cart-main">
                                <img src={i.image} alt="" className='cart-icon' />
                                <p>{i.name}</p>
                                <p>{parseFloat(i.new_price).toFixed(3)} VNĐ</p>
                                <p className='quantity'>{cartItem[i.id]}</p>
                                <p className='total1'>{(parseFloat(i.new_price).toFixed(3) * cartItem[i.id]).toFixed(3)} VNĐ</p>
                                <div className='addandremove'>
                                    <div className='icon-add' onClick={() => { addToCart(i.id) }}><CiCirclePlus /></div>
                                    <div className='icon-remove' onClick={() => { removeToCart(i.id) }}><IoIosRemoveCircleOutline /></div>
                                </div>
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            <div className="cart-below">
                    <div className="total2">
                        <h3>Tổng hóa đơn</h3>
                        <div>
                            <div className="total-item">
                                <p> Tổng tiền sản phẩm</p>
                                <p>{getTotalCart().toFixed(3)} VND</p>
                            </div>
                            <hr />
                            <div className="total-item">
                                <p>Phụ thu</p>
                                <p>30.000 VND</p>
                            </div>
                            <hr />
                            <div className="cart-codediscount">
                                <p>Nếu bạn có mã giảm giá, nhập tại đây</p>
                                <div className="boxdiscount">
                                    <input type="text" placeholder='Mã giảm giá' />
                                    <button className='button-dis'>Xác nhận</button>
                                </div>
                            </div>
                            <hr/>
                            <div className="total-item">
                                <h3>Tổng</h3>
                                <h3>{getTotalCart()+30}.000 VND</h3>
                            </div>
                            
                        </div>
                        </div>
                    <form className="shipping-form" onSubmit={handleFormSubmit}>
                        <h3>Thông tin giao hàng</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Tên người nhận"
                            value={shippingInfo.name}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={shippingInfo.email}
                            onChange={handleInputChange}
                            required readOnly
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="Hà Nội"
                            value={shippingInfo.city}
                            onChange={handleInputChange}
                            required readOnly
                        />
                        <input
                            type="text"
                            name="district"
                            placeholder="Quận"
                            value={shippingInfo.district}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="specificAddress"
                            placeholder="Địa chỉ cụ thể"
                            value={shippingInfo.specificAddress}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Số điện thoại"
                            value={shippingInfo.phone}
                            onChange={handleInputChange}
                            required
                        />
                            <button type="submit" className="button-total">Thanh toán</button>
                        </form>
                    </div>
                </div>
    
    )
}

export default CartShop;
