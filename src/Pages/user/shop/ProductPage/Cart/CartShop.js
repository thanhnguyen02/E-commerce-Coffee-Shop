import React, { useContext } from 'react'
import './CartItem.css'
import { ShopContext } from '../../Context/ShopContext'
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";

const CartShop = () => {
    const{getTotalCart,all_img,cartItem,addToCart ,removeToCart}=useContext(ShopContext)
  return (
    <div className='cartshop'>
      <h2>Giỏ hàng của bạn</h2>
      <div class="cart-main">
        <p>Sản phẩm</p>
        <p>Tên sản phẩm</p>
        <p>Giá tiền</p>
        <p>Số lượng</p>
        <p>Thành tiền</p>
        <p>Thao tác</p>
      </div>
      <hr/>
      {all_img.map((i)=>{
        if(cartItem[i.id]>0){
          return <div>
              <div class="cartitem-format cart-main">
                <img src={i.image} alt="" className='cart-icon'/>
                <p>{i.name}</p>
                <p>{parseFloat(i.new_price).toFixed(3)} VNĐ</p>
                <p className='quantity'>{cartItem[i.id]}</p>
                <p className='total1'>{(parseFloat(i.new_price).toFixed(3) * cartItem[i.id]).toFixed(3)} VNĐ</p>
                <div className='addandremove'>
                    <div className='icon-add' onClick={()=>{addToCart(i.id)}}><CiCirclePlus /></div>
                    <div className='icon-remove' onClick={()=>{removeToCart(i.id)}}><IoIosRemoveCircleOutline /></div>
                </div>
              </div>
              <hr/>
            </div>
        }
        return null;
      })}
      <div class="cart-below">
        <div class="total2">
          <h1>Tong hoa don</h1>
          <div>
            <div class="total-item">
              <p> Tổng tiền sản phẩm</p>
              <p>{getTotalCart().toFixed(3)} VND</p>
            </div>
            <hr />
            <div class="total-item">
              <p>Phụ thu</p>
              <p>free</p>
            </div>
            <hr/>
            <div class="total-item">
              <h3>Tong</h3>
              <h3>{getTotalCart().toFixed(3)} VND</h3>
            </div>
            <div class="cart-codediscount">
              <p>neu ban co ma giam gia, nhap tai day</p>
              <div class="boxdiscount">
              <input type="text" placeholder='ma giam gia'/>
              <button className='button-dis'>Xac nhan</button>
              </div>
          </div>
          <button className='button-total'>Thanh toan</button>
        </div>
        
          
          
        </div>
      </div>
    </div>
  )
}

export default CartShop
