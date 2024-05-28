import React from 'react'
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const TakeID = (props) => {
    const {product}=props;
  return (
    <div className='takeid' style={{margin: '10px 10px',fontSize:'12px'}}>
      HOME <MdOutlineKeyboardArrowRight />SHOP <MdOutlineKeyboardArrowRight /> {product.category} <MdOutlineKeyboardArrowRight /> {product.name}
    </div>
  )
}

export default TakeID
