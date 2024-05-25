import React from 'react'
import './Item.css'

const Item = (props) => {
  return (
    <div className='item'>
      <img src={props.image} alt=""/>
      <p>{props.name}</p>
      <div className="item-price">
        <div className='item-new-price'>
            {props.new_price}.000 VNĐ
        </div>
        <div className="item-old-price">
            {props.old_price}.000 VNĐ
        </div>
      </div>
    </div>
  )
}

export default Item
