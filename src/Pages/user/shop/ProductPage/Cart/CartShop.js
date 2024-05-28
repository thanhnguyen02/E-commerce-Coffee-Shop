import React, { useContext } from 'react'
import './CartItem.css'
import { ShopContext } from '../../Context/ShopContext'
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";

const CartShop = () => {
    const{getTotalCart,all_img,cartItem,addToCart ,removeToCart}=useContext(ShopContext)
  return (
    <div className='cartshop'>
      <div class="cart-main">
        <p>San pham</p>
        <p>Ten san pham</p>
        <p>Gia tien</p>
        <p>So luong</p>
        <p>Tong tien</p>
        <p>Xoa</p>
      </div>
      <hr/>
      {all_img.map((i)=>{
        if(cartItem[i.id]>0){
          return <div>
              <div class="cartitem-format cart-main">
                <img src={i.image} alt="" className='cart-icon'/>
                <p>{i.name}</p>
                <p>{i.new_price} VNĐ</p>
                <p className='quantity'>{cartItem[i.id]}</p>
                <p className='total1'>{i.new_price*cartItem[i.id]} VNĐ</p>
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
              <p>Subtatal</p>
              <p>{getTotalCart()} VND</p>
            </div>
            <hr />
            <div class="total-item">
              <p>shipping free</p>
              <p>free</p>
            </div>
            <hr/>
            <div class="total-item">
              <h3>Tong</h3>
              <h3>{getTotalCart()} VND</h3>
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
