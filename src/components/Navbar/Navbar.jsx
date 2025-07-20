import React,{useContext, useState} from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import {Link, useNavigate} from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({setShowLogin}) => {
    const [Menu, setMenu] =useState("Menu");
    const {getTotalCartAmount,token,setToken,setCartItems,
           searchQuery, setSearchQuery} = useContext(StoreContext); // <--- ADDED searchQuery, setSearchQuery

    const navigate=useNavigate();
    const logout=()=>{
      localStorage.removeItem("token");
      setToken("");
      setCartItems({});
      navigate("/");
    }

    // State to control search input visibility
    const [showSearchInput, setShowSearchInput] = useState(false);

    const handleSearchIconClick = () => {
      setShowSearchInput(prev => !prev); // Toggle search input visibility
      if (showSearchInput) { // If search input is about to hide, clear query
        setSearchQuery(''); // Clear search query when hiding input
      }
    };

    const handleSearchInputChange = (e) => {
      setSearchQuery(e.target.value);
      // Optionally, navigate to home or menu section when searching
      // This ensures the FoodDisplay component is visible
      if (e.target.value) {
        navigate('/'); // Navigate to home page to show filtered results
        setMenu("Home"); // Keep Home active
      } else {
        // If search query is cleared, navigate back to home and set menu to Home
        navigate('/');
        setMenu("Home");
      }
    };

    return (
      <div className='navbar'>
        <Link to='/'><img src={assets.logo} alt="" className='logo' /></Link>
        <ul className="navbar-menu">
          <Link to='/' onClick={()=>setMenu("Home")} className={Menu==="Home"?"active":""}>Home</Link>
          <a href='#explore-menu' onClick={()=>setMenu("Menu")} className={Menu==="Menu"?"active":""}>Menu</a>
          <a href='#app-download' onClick={()=>setMenu("Mobile-app")} className={Menu==="Mobile-app"?"active":""}>Mobile-app </a>
          <a href='#footer' onClick={()=>setMenu("Contact us")} className={Menu==="Contact us"?"active":""}>Contact us</a>
        </ul>
        <div className="navbar-right">
          {/* Search Icon and Input */}
          <div className="navbar-search-container">
            <img src={assets.search_icon} alt="search" onClick={handleSearchIconClick} className="search-icon-toggle"/>
            {showSearchInput && (
              <input
                type="text"
                placeholder="Search food..."
                className="navbar-search-input"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            )}
          </div>

          <div className='navbar-search-icon'>
              <Link to='/cart'><img src={assets.basket_icon} alt="basket" /></Link>
              <div className={getTotalCartAmount()===0?"":"dot"}></div>
          </div>
          {!token?<button onClick={()=>setShowLogin(true)}>Sign in</button>
          :<div className='navbar-profile'>
            <img src={assets.profile_icon} alt=""/>
            <ul className="nav-profile-dropdown">
              <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr/>
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
            </div>}

        </div>
      </div>
    )
}

export default Navbar;
