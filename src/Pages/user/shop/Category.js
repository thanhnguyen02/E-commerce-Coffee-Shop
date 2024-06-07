import React, { useContext } from 'react';
import './Category.css';
import { ShopContext } from './Context/ShopContext';
import Item from '../Item/Item';

const Category = (props) => {
  const { all_img } = useContext(ShopContext);

  // Lọc các sản phẩm theo danh mục
  const filteredProducts = all_img.filter((item) => item.category === props.category);

  return (
    <div className='outer-container'>
      <div className='category'>
        <div className='category-banner'>
          <img src={props.banner} alt='' />
        </div>
        <div className='shopcategory'>
          {filteredProducts.map((item, i) => (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
