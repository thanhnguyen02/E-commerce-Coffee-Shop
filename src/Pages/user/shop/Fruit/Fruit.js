import React from 'react'
import './Fruit.css'
import fruit_product from '../../../img/fruit'
import Item from '../../Item/Item'

const Fruit = () => {
  return (
    <div className='fruit'>
      <h1>Trà Hoa Quả</h1>
      <hr />
      <div className="fruit-item">
        {fruit_product.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default Fruit
