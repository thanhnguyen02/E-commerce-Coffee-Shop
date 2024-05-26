import React from 'react'
import './FandS.css'
import Item from '../../Item/Item'
import fns_product from '../../../img/FnS'

const FandS = () => {
  return (
    <div className='fns'>
      <h1>Trà Hoa Quả</h1>
      <hr />
      <div className="fns-item">
        {fns_product.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default FandS
