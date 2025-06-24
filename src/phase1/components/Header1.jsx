import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Header1.css'; 
import { ThemeContext } from '../../context/ThemeContext';
const Header1 = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  return (
    <div className="news-page">
      <header className="news-header">

        <div className="logo-search">
          <div className="logo">
            <img src="/logo.png" alt="NewsSphere" /> 
            <span>NewsSphere</span>
          </div>
        </div>
        <input className="search-bar" type="text" placeholder="Search" />
        
        <div className="auth-buttons">
          <button onClick={() => setDarkMode(!darkMode)} className="mode-toggle-btn">
        {darkMode ? '☀️' : '🌙'}
      </button>
          <Link to="/Signup"><button className="sign-up">Sign Up</button></Link>
          <Link to="/Login"><button className="login">Login</button></Link>
        </div>
      </header>
      </div>
  )
}
export default Header1