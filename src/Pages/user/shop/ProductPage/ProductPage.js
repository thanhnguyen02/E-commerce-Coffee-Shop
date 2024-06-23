import React, { useContext } from 'react'
import './ProductPage.css'
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { ShopContext } from '../Context/ShopContext';

const ProductPage = (props) => { 
  const {product}=props;
  const {addToCart} = useContext(ShopContext);
  return (
    <div className='productpage'>
      <div class="productpage-left">
        <div class="productpage-img">
          <img src={product.image} alt=""/>
        </div>
      </div>
      <div class="productpage-right">
          <h1>{product.name}</h1>
          <div class="productpage-star">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaRegStar />
          </div>
          <div class="productpage-price">
            {/* <div class="old-price">{parseFloat(product.old_price).toFixed(3)} VNĐ</div> */}
            <div class="new-price">{parseFloat(product.new_price).toFixed(3)} VNĐ</div>
          </div>
          <div class="product-mota">{product.describe_detail}</div>
          {/* <div class="product-size">
            <h1>Chọn Size</h1>
            <div class="size">
              <div>S</div>
              <div>M</div>
              <div>L</div>
            </div>
          </div> */}
          <button onClick={()=>{addToCart(product.id)}}>Thêm vào giỏ hàng</button>
          <p className='add-category'><span>tag: </span>{product.tag}</p>
      </div>
    </div>
  )
}

export default ProductPage
