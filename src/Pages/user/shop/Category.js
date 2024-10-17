import React, { useContext, useEffect, useState } from 'react';
import './Category.css';
import { ShopContext } from './Context/ShopContext';
import Item from '../Item/Item';

const Category = ({ category, banner, filters,searchQuery }) => {
  const { all_img } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let products = all_img.filter((item) => item.category === category);
    
  
    if (filters) {
      if (filters.coffee) {
        products = products.filter(item => item.tag.includes("coffee"));
      }
      if (filters.caffeine) {
        products = products.filter(item => item.tag.includes("caffeine"));
      }
      if (filters.honey) {
        products = products.filter(item => item.tag.includes("honey"));
      }
      if (filters.soda) {
        products = products.filter(item => item.tag.includes("soda"));
      }
      if (filters.peach) {
        products = products.filter(item => item.tag.includes("peach"));
      }
      if (filters.tea) {
        products = products.filter(item => item.tag.includes("tea"));
      }
      if (filters.coconut) {
        products = products.filter(item => item.tag.includes("coconut"));
      }
      if (filters.matcha) {
        products = products.filter(item => item.tag.includes("matcha"));
      }
      if (filters.milk) {
        products = products.filter(item => item.tag.includes("milk"));
      }
      if (filters.macchiato) {
        products = products.filter(item => item.tag.includes("macchiato"));
      }
    }

    setFilteredProducts(products);
  }, [all_img, category, filters,searchQuery]);

  return (
    <div className='outer-container'>
      <div className='category'>
        {banner && (
          <div className='category-banner'>
            <img src={banner} alt='' />
          </div>
        )}
        <div className='shopcategory'>
          {filteredProducts.map((item, i) => (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
