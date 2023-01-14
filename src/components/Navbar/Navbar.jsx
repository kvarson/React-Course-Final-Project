import React from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowUp";

const Navbar = ({ email }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    localStorage.removeItem("user-info");
    navigate("/");
  };
  return (
    <nav className='navbar'>
      <div className='logo-container'>
        <p className='logo-text'>SHOPPER</p>
      </div>
      <div>
        <Link className='products-link' to='/products'>
          <p className='products-page'>Products</p>
        </Link>
      </div>
      <Link to='/shopping-cart'>
        <ShoppingCartIcon className='cart-icon' />
      </Link>
      <div className='dropdown-container'>
        <div className='dropdown'>
          <div className='logout-flex'>
            <button className='dropbtn'>
              Hello {email.slice(0, email.indexOf("@"))}!
              <KeyboardArrowDownIcon />
            </button>
          </div>
          <div className='dropdown-content'>
            <a href='#' onClick={handleClick}>
              <div className='logout-container'>
                LOG OUT
                <LogoutIcon className='logout-icon' />
              </div>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
