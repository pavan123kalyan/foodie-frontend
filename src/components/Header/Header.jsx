import React from 'react'
import './Header.css'

const Header = () => {

  const handleViewMenuClick = () => {
    // Scroll smoothly to the 'explore-menu' section
    document.getElementById('explore-menu').scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Order your favourite food here</h2>
            <p>Discover the future of food delivery with an app that puts your cravings first — offering the fastest delivery times, the freshest meals, and the highest quality from the best local kitchens, all in one place.</p>
            <button onClick={handleViewMenuClick}>View Menu</button> {/* <--- ADDED onClick */}
        </div>
    </div>
  )
}

export default Header;
