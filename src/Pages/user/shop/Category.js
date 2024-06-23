import React, { useContext, useEffect, useState } from 'react';
import './Category.css';
import { ShopContext } from './Context/ShopContext';
import Item from '../Item/Item';

const Category = ({ category, banner, searchQuery }) => {
  const { all_img } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let products = all_img.filter((item) => item.category === category);
    if (searchQuery) {
      products = products.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(products);
  }, [all_img, category, searchQuery]);

  return (
    <div className='outer-container'>
      <div className='category'>
        <div className='category-banner'>
          <img src={banner} alt='' />
        </div>
        <div className='shopcategory'>
          {filteredProducts.map((item, i) => (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              //old_price={item.old_price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
