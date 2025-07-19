import React from 'react'
import './Footer.css'
import {assets} from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className='footer-content'>
            <div className='footer-content-left'>
            {/* <img src={assets.logo} alt=""/> */}
            <h1>Foodie.</h1>
            <p>Food provides essential nutrients for overall health and well-being. It fuels the body with energy needed for daily activities and supports growth, repair, and immune function. A balanced diet also helps prevent chronic diseases and promotes long-term vitality.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
            </div>
            <div className='footer-content-center'>
                <h2>Company</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div className='footer-content-right'> 
            <h2>Get in touch</h2>
            <ul>
                <li>+91 9676783447</li>
                <li>contact@foodie.com</li>
            </ul>
            </div>
        </div>
        <hr/>
        <p className='footer-copyright'>Copyright © 2025 Foodie.com -All Rights Reserved.</p>
    </div>
  )
}

export default Footer
