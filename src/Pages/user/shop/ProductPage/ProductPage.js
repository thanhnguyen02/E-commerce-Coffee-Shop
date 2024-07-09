import React, { useContext } from 'react';
import './ProductPage.css';
import { FaStar, FaRegStar } from "react-icons/fa";
import { ShopContext } from '../Context/ShopContext';

const ProductPage = ({ product }) => {
  const { addToCart } = useContext(ShopContext);

  if (!product) {
    return null; 
  }

  return (
    <div className='productpage'>
      <div className="productpage-left">
        <div className="productpage-img">
          <img src={product.image} alt=""/>
        </div>
      </div>
      <div className="productpage-right">
        <h1>{product.name}</h1>
        <div className="productpage-star">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaRegStar />
        </div>
        <div className="productpage-price">
          <div className="new-price">{parseFloat(product.new_price).toFixed(3)} VNĐ</div>
        </div>
        <div className="product-mota">{product.describe_detail}</div>
        <button onClick={() => { addToCart(product.id) }}>Thêm vào giỏ hàng</button>
        <p className='add-category'><span>tag: </span>{product.tag}</p>
      </div>
    </div>
  );
}

export default ProductPage;
