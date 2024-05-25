import React from 'react'
import './HomePage.css'
import banner from '../../img/banner.jpg'
import banner2 from '../../img/banner2.jpg'

const HomePage = () => {
  return (
    <div className='homepage'>
        <div className="home-left">
            <h2 >WHAT'S NEW TODAY</h2>
            <div>
                {/* <p>collection</p>
                <p>for everyone</p> */}
            </div>
            <div>
                <div className="home-button">
                    {/* <div>Must Try</div> */}
                    <div className='banner'>
                        <img src={banner} alt=""/>
                        {/* <img src={banner2} alt=""/> */}
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
