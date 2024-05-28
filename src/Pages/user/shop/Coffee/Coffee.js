import React from 'react'
import './Coffee.css'
import data_product from '../../../img/data';
import Item from '../../Item/Item'

const Coffee = () => {
  return (
    <div className='coffee'>
      <h1>Cà Phê Phin Truyền Thống</h1>
      <hr />
      <div className="coffee-item">
        {data_product.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
  );
};

export default Coffee
