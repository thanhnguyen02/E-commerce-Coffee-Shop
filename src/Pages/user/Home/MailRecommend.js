import React from 'react'
import './MailRecommend.css'

const MailRecommend = () => {
  return (
    <div className='mail'>
      <h1>Nhận thông tin từ chúng tôi</h1>
      <p>Nhận những gợi ý, sản phẩm mới và các thông tin mới nhất của chúng tôi</p>
      <div>
        <input type="email" placeholder='Email của bạn'/>
        <button>Xác nhận</button>
      </div>
    </div>
  )
}

export default MailRecommend
