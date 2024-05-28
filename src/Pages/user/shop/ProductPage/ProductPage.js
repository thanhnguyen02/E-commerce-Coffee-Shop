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
            <div class="old-price">{product.old_price} VNĐ</div>
            <div class="new-price">{product.new_price} VNĐ</div>
          </div>
          <div class="product-mota">
          Từ 100% hạt cà phê Robusta thượng hạng nơi Thánh địa cà phê Buôn Ma Thuột trù phú, bằng cả sự đam mê và khát khao mang đến một hương vị cà phê đặc sắc, 
          Cà Phê Phin Mê chính là thành quả mà các nghệ nhân Katinat đặt cả tâm huyết để hoàn thành.
          Hương vị đậm đà của Cà Phê Phin Mê được nghệ nhân pha chế Katinat đánh thức mạnh mẽ khi được rang xay với công thức đặc biệt, dậy mùi thơm nhẹ, 
          cùng độ béo thích hợp kết hợp phương pháp pha Phin truyền thống, biến hương vị Cà Phê Phin nguyên bản trở nên ngon hơn, “mê mẩn” hơn, phù hợp với tất cả mọi người.
          </div>
          <div class="product-size">
            <h1>Chọn Size</h1>
            <div class="size">
              <div>S</div>
              <div>M</div>
              <div>L</div>
            </div>
          </div>
          <button onClick={()=>{addToCart(product.id)}}>Thêm vào giỏ hàng</button>
          <p className='add-category'><span>Tags: </span><span>coffee, ice</span></p>
      </div>
    </div>
  )
}

export default ProductPage
