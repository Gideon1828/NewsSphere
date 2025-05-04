import './Header2.css';
import { useState } from 'react'; // Import useState hook
import { Search, Bookmark, Bell, User, ChevronDown } from 'lucide-react';

const Header2 = ({ onTopicSelect }) => {
  const [activeTopic, setActiveTopic] = useState('For You'); // Track the active topic

  const handleTopicClick = (topic) => {
    setActiveTopic(topic);  // Set the active topic when a topic is clicked
    onTopicSelect(topic);    // Pass the topic to the parent
  };

  return (
    <div>
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <img src="/logo.png" alt="NewsSphere Logo" className="login-logo" />
          </div>
          <nav className="nav-links">
            <a
              href="#"
              className={`nav-link ${activeTopic === 'For You' ? 'active' : ''}`}
              onClick={() => handleTopicClick('For You')}
            >
              For You
            </a>
            <a
              href="#"
              className={`nav-link ${activeTopic === 'Latest' ? 'active' : ''}`}
              onClick={() => handleTopicClick('Latest')}
            >
              Latest
            </a>
            <a
              href="#"
              className={`nav-link ${activeTopic === 'Technology' ? 'active' : ''}`}
              onClick={() => handleTopicClick('Technology')}
            >
              Technology
            </a>
            <a
              href="#"
              className={`nav-link ${activeTopic === 'Travel' ? 'active' : ''}`}
              onClick={() => handleTopicClick('Travel')}
            >
              Travel
            </a>
            <a
              href="#"
              className={`nav-link ${activeTopic === 'Food' ? 'active' : ''} dropdown`}
              onClick={() => handleTopicClick('Food')}
            >
              Food <ChevronDown size={16} />
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
  );
};

export default Header2;
