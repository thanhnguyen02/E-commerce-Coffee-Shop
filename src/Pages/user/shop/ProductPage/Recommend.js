import React from 'react'
import './Recommend.css'
import all_img from'../../../img/all_img'
import Item from '../../Item/Item'

const Recommend = () => {
  return (
    <div className='recommend'>
      <h1>Gợi ý dành cho bạn</h1>
      <hr/>
      <div class="recommend-item">
        {all_img.slice(0, 4).map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default Recommend
