import React, { useState, useEffect } from 'react';
import HomePage from '../Home/HomePage';
import Category from './Category';
import './Shop.css';

const Shop = () => {
  const [menu, setMenu] = useState("shop");
  const [filters, setFilters] = useState({
    coffee: false,
    caffeine: false,
    tea: false,
    coconut: false,
    sugar: false,
    milk: false,
    macchiato: false
  });

  
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [value]: checked
    }));
  };

  return (
    <div className='container'>
      <div className='content'>
        {/* <HomePage /> */}
        <div className='sidebar'>
          <h3>Lọc đồ uống</h3>
          <h4>Sản phẩm chứa:</h4>
          <div className='sidebar-menu'>
            <label>
              <input type="checkbox" value="coffee" checked={filters.coffee} onChange={handleCheckboxChange} /> Coffee
            </label>
            <br />
            <label>
              <input type="checkbox" value="caffeine" checked={filters.caffeine} onChange={handleCheckboxChange} /> Caffeine
            </label>
            <br/>
            <label>
              <input type="checkbox" value="tea" checked={filters.tea} onChange={handleCheckboxChange} /> Tea
            </label>
            <br />
            <label>
              <input type="checkbox" value="coconut" checked={filters.coconut} onChange={handleCheckboxChange} />  Coconut
            </label>
            <br />
            <label>
              <input type="checkbox" value="matcha" checked={filters.matcha} onChange={handleCheckboxChange} /> Matcha
            </label>
            <br />
            <label>
              <input type="checkbox" value="milk" checked={filters.milk} onChange={handleCheckboxChange}/> Milk
            </label>
            <br />
            <label>
              <input type="checkbox" value="honey" checked={filters.honey} onChange={handleCheckboxChange}/> Honey
            </label>
            <br />
            <label>
              <input type="checkbox" value="macchiato" checked={filters.macchiato} onChange={handleCheckboxChange} /> Macchiato
            </label>
            <br />
            <label>
              <input type="checkbox" value="soda" checked={filters.soda} onChange={handleCheckboxChange} /> Soda
            </label>
            <br />
            <label>
              <input type="checkbox" value="peach" checked={filters.peach} onChange={handleCheckboxChange} /> Peach
            </label>
          </div>
        </div>
        <div className='fruit'>
          <h1>Cà phê truyền thống</h1>
          <hr />
          <Category category="coffee"filters={filters}/>
  
          <h1>Trà Hoa Quả</h1>
          <hr />
          <Category category="fruit" filters={filters}/>
  
          <h1>Soda mix Fruit</h1>
          <hr />
          <Category category="fns" filters={filters}/>
  
          <h1>Khác</h1>
          <hr />
          <Category category="other" filters={filters}/>
        </div>
      </div>
    </div>
  );
}

export default Shop;
