import React from 'react'
import HomePage from '../Home/HomePage'
import Coffee from './Coffee/Coffee'
import Fruit from './Fruit/Fruit'
import FandS from './FnS/FandS'
import MailRecommend from '../Home/MailRecommend'
import Category from './Category'


const Shop = () => {
  return (
    <div>
      <HomePage/>
      {/* <Coffee/>
      <Fruit/>
      <FandS/> */}

      <div className='fruit'>
        <h1>Cà phê truyền thống</h1>
        <hr />
        <Category category="coffee"/>

        <h1>Trà Hoa Quả</h1>
        <hr />
        <Category category="fruit"/>
        
        <h1>Soda n Fruit</h1>
        <hr />
        <Category category="fns"/>
      </div>
    </div>
  )
}

export default Shop
