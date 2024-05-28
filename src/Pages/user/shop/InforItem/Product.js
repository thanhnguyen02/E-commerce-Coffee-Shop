import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import TakeID from '../../Home/TakeIdProduct/TakeID';
import ProductPage from '../ProductPage/ProductPage';
import Recommend from '../ProductPage/Recommend';

const Product = () => {
  const {all_img}=useContext(ShopContext);
  const {productId} =useParams();
  const product = all_img.find((e)=>e.id === Number(productId));
  return (
    <div>
      <TakeID product={product}/>
      <ProductPage product={product}/>
      <Recommend/>
    </div>
  )
}

export default Product
