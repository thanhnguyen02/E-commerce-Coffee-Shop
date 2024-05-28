import React from 'react'
import './Item.css'
import {Link} from 'react-router-dom'

const Item = (props) => {
  return (
    <div className='item'>
      <Link to={`/product/${props.id}`}><img onClick={window.scrollTo(0,0)} src={props.image} alt=""/></Link>
      <p>{props.name}</p>
      <div className="item-price">
        <div className='item-new-price'>
            {props.new_price} VNĐ
        </div>
        <div className="item-old-price">
            {props.old_price} VNĐ
        </div>
      </div>
    </div>
  )
}

export default Item
