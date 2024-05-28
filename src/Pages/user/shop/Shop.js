import React from 'react'
import HomePage from '../Home/HomePage'
import Coffee from './Coffee/Coffee'
import Fruit from './Fruit/Fruit'
import FandS from './FnS/FandS'
import MailRecommend from '../Home/MailRecommend'


const Shop = () => {
  return (
    <div>
      <HomePage/>
      <Coffee/>
      <Fruit/>
      <FandS/>
      {/* <MailRecommend/> */}
    </div>
  )
}

export default Shop
