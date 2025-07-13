"use client"

import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Header1.css"
import { ThemeContext } from "../../context/ThemeContext"

const Header1 = () => {
 const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ This fixes the error
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleSearch = (e) => {
  if (e.key === "Enter") {
    const cleanedQuery = searchQuery
      .trim()                    // remove leading/trailing spaces
      .replace(/\s+/g, " ");     // replace multiple spaces with single space

    if (cleanedQuery) {
      navigate(`/search/${encodeURIComponent(cleanedQuery)}`);
      setSearchQuery("");
      closeMobileMenu();
    }
  }
};

  return (
    <div className="news-page">
      <header className="news-header">
        <div className="logo-search">
          <div className="logo">
            <img src="/logo.png" alt="NewsSphere" />
            <span>NewsSphere</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <input
  className="search-bar"
  type="text"
  placeholder="Search"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={handleSearch}
/>
          <div className="auth-buttons">
            <button onClick={() => setDarkMode(!darkMode)} className="mode-toggle-btn">
              {darkMode ? "☀️" : "🌙"}
            </button>
            <Link to="/Signup">
              <button className="sign-up">Sign Up</button>
            </Link>
            <Link to="/Login">
              <button className="login">Login</button>
            </Link>
          </div>
        </div>

        {/* Mobile Burger Menu Button */}
        <button
          className={`burger-menu ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu-overlay ${isMobileMenuOpen ? "active" : ""}`} onClick={closeMobileMenu}></div>

        {/* Mobile Navigation Menu */}
        <nav className={`mobile-nav ${isMobileMenuOpen ? "active" : ""}`}>
          <div className="mobile-nav-content">
            <input
  className="search-bar mobile-search"
  type="text"
  placeholder="Search"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={handleSearch}
/>

            <div className="mobile-auth-buttons">
              <button onClick={() => setDarkMode(!darkMode)} className="mode-toggle-btn mobile-mode-toggle">
                {darkMode ? "☀️" : "🌙"}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>

              <Link to="/Signup" onClick={closeMobileMenu}>
                <button className="sign-up mobile-btn">Sign Up</button>
              </Link>

              <Link to="/Login" onClick={closeMobileMenu}>
                <button className="login mobile-btn">Login</button>
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default Header1
