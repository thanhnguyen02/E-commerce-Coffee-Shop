import React, { useState } from 'react'
import './HomePage.css'
import banner from '../../img/banner.jpg'

const HomePage = () => {
  return (
    <div className='homepage'>
        <div className="home-left">
            {/* <h2 >WHAT'S NEW TODAY</h2> */}
            <div>
                <div className="home-button">
                    {/* <div>Must Try</div> */}
                    <div className='banner'>
                        <a href="/post">
                            <img src={banner} alt=""/>
                            {/* <img src={banner2} alt=""/> */}
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div className="home-right">

        </div>
    </div>

  )
}

export default HomePage
