import './Header2.css'
import { Search, Bookmark, Bell, User, ChevronDown, Share, Loader } from 'lucide-react';

const Header2 = () => {
  return (
    <div>
      <header className="header">
        <div className="header-left">
          <div className="logo">
          
            <img src="/logo.png" alt="NewsSphere Logo" className="login-logo" />
          
          </div>
          <nav className="nav-links">
            <a href="#" className="nav-link active">For You</a>
            <a href="#" className="nav-link">Latest</a>
            <a href="#" className="nav-link">Technology</a>
            <a href="#" className="nav-link">Travel</a>
            <a href="#" className="nav-link dropdown">
              Food
              <ChevronDown size={16} />
            </a>
          </nav>
        </div>
        <div className="header-right">
          <div className="search-container">
            <Search size={20} />
            <span className="search-text">SEARCH</span>
          </div>
          <button className="icon-button">
            <Bookmark size={20} />
          </button>
          <button className="icon-button">
            <Bell size={20} />
          </button>
          <button className="icon-button user-icon">
            <User size={20} />
          </button>
        </div>
      </header>
    </div>
  )
}
export default Header2