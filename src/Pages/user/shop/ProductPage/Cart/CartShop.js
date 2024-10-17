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
        distric: '',
        specificAddress: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [discountCode, setDiscountCode] = useState('');
    const [discountPercent, setDiscountPercent] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);

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

    const validateForm = () => {
        let formErrors = {};
        if (!shippingInfo.name) formErrors.name = 'Tên người nhận không được bỏ trống';
        if (!shippingInfo.email) formErrors.email = 'Email không được bỏ trống';
        if (!shippingInfo.distric) formErrors.distric = 'Quận không được bỏ trống';
        if (!shippingInfo.specificAddress) formErrors.specificAddress = 'Địa chỉ cụ thể không được bỏ trống';
        if (!shippingInfo.phone) formErrors.phone = 'Số điện thoại không được bỏ trống';
        return formErrors;
    };

    const handlePaymentClick = () => {
        const amount = (getTotalCart() + 30 - discountAmount) * 1000;
        window.location.href = `http://localhost:8888/order/create_payment_url?amount=${amount}`;
    };

    const handleCashOnDelivery = async () => {
        const totalQuantity = all_img.reduce((acc, item) => acc + (cartItem[item.id] || 0), 0);
        const totalPrice = all_img.reduce((acc, item) => acc + (cartItem[item.id] || 0) * parseFloat(item.new_price), 0);
        const discount = discountAmount;
        //const date = new Date().toISOString().slice(0, 10);

        const billData = {
            email: shippingInfo.email,
            id_product: cartItem,
            quantity: totalQuantity,
            total: totalPrice,
            discount: discount,
            discountCode: discountCode,
            payment_id: null,
            date: new Date(),
            number: shippingInfo.phone,
            name: shippingInfo.name,
            distric: shippingInfo.distric,
            address: shippingInfo.specificAddress,
            status_pay: 'Thanh toán khi nhận hàng',
            status_bill: 'Đang xử lý'
        };

        try {
            const response = await fetch('http://localhost:5000/addbill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(billData)
            });
            const data = await response.json();
            if (data.success) {
                console.log('Thêm thông tin giao hàng thành công', data);
                alert('Đơn hàng của bạn đã được đặt thành công');
            } else {
                console.log('Lỗi khi thêm thông tin giao hàng', data);
                alert('Có lỗi xảy ra khi đặt hàng, vui lòng thử lại');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error);
            alert('Có lỗi xảy ra khi đặt hàng, vui lòng thử lại');
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length === 0) {
            localStorage.setItem('shippingName', shippingInfo.name);
            localStorage.setItem('shippingEmail', shippingInfo.email);
            localStorage.setItem('shippingCity', shippingInfo.city);
            localStorage.setItem('shippingdistric', shippingInfo.distric);
            localStorage.setItem('shippingSpecificAddress', shippingInfo.specificAddress);
            localStorage.setItem('shippingPhone', shippingInfo.phone);

            console.log('Shipping Info:', shippingInfo);

            if (e.nativeEvent.submitter.classList.contains('button-cod')) {
                handleCashOnDelivery();
            } else if (e.nativeEvent.submitter.classList.contains('button-vnpay')) {
                handlePaymentClick();
            }
        } else {
            setErrors(formErrors);
            console.log('Form validation errors:', formErrors);
        }
    };

    const handleDiscountCode = async () => {
        try {
            const response = await fetch('http://localhost:5000/checkdiscount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: discountCode })
            });
            const data = await response.json();
            if (data.success) {
                setDiscountPercent(data.percent);
                const totalCartAmount = getTotalCart();
                setDiscountAmount(totalCartAmount * data.percent);
                alert('Mã giảm giá hợp lệ');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra mã giảm giá:', error);
            alert('Có lỗi xảy ra khi kiểm tra mã giảm giá, vui lòng thử lại');
        }
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
                                <input
                                    type="text"
                                    placeholder='Mã giảm giá'
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                />
                                <button className='button-dis' onClick={handleDiscountCode}>Xác nhận</button>
                                <h3 style={{"margin-top":"50px"}}>Giảm giá: -{parseFloat(discountAmount ).toFixed(3)} VNĐ</h3>
                                
                            </div>
                            <hr />
                        </div>
                        <div className="total-item1">
                            
                            <h3>Tổng</h3>
                            <h3>{((getTotalCart() + 30 - discountAmount)).toFixed(3)} VND</h3>
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
                    {errors.name && <p className="error-message">{errors.name}</p>}
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        required readOnly
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                    <input
                        type="text"
                        name="city"
                        placeholder="Hà Nội"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        required readOnly
                    />
                    {errors.city && <p className="error-message">{errors.city}</p>}
                    <input
                        type="text"
                        name="distric"
                        placeholder="Quận"
                        value={shippingInfo.distric}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.distric && <p className="error-message">{errors.distric}</p>}
                    <input
                        type="text"
                        name="specificAddress"
                        placeholder="Địa chỉ cụ thể"
                        value={shippingInfo.specificAddress}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.specificAddress && <p className="error-message">{errors.specificAddress}</p>}
                    <input
                        type="text"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.phone && <p className="error-message">{errors.phone}</p>}
                    <button type="submit" className="button-total button-cod">Thanh toán khi nhận hàng</button>
                    <button type="submit" className="button-total button-vnpay">Thanh toán VNPAY</button>
                </form>
            </div>
        </div>
    );
}

export default CartShop;
