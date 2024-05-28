import React from 'react';
import { useContext } from 'react';
import './Category.css'
import { ShopContext } from './Context/ShopContext';
import Item from '../Item/Item';

const Category = (props) => {
  const {all_img}=useContext(ShopContext)
  return (
    <div className='outer-container'>
      <div className='category'>
        <div className='category-banner'>
          <img src={props.banner} alt=""/>
        </div>
        <div class="shopcategory">
          {all_img.map((item,i)=>{
            if(props.category ===item.category){
              return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            }
            else{
              return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default Category;