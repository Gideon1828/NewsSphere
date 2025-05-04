import './Header2.css';
import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, Bookmark, Bell, User, MoreHorizontal } from 'lucide-react';
import Search from '../pages/Search';

const Header2 = ({ onTopicSelect }) => {
  const [activeTopic, setActiveTopic] = useState('For You');
  const [userTopics, setUserTopics] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const storedTopics = localStorage.getItem('selectedTopics');
    if (storedTopics) {
      try {
        setUserTopics(JSON.parse(storedTopics));
      } catch (err) {
        console.error('Error parsing selectedTopics:', err);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTopicClick = (topic) => {
    setActiveTopic(topic);
    setShowDropdown(false);
    if (onTopicSelect) onTopicSelect(topic);
  };

  const visibleTopics = userTopics.slice(0, 2);
  const hiddenTopics = userTopics.slice(2);

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
            {visibleTopics.map((topic) => (
              <a
                key={topic}
                href="#"
                className={`nav-link ${activeTopic === topic ? 'active' : ''}`}
                onClick={() => handleTopicClick(topic)}
              >
                {topic.replace(/^#/, '')}
              </a>
            ))}
            {hiddenTopics.length > 0 && (
              <div className="dropdown-wrapper">
                <button className="icon-button" onClick={() => setShowDropdown(!showDropdown)}>
                  <MoreHorizontal size={20} />
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    {hiddenTopics.map((topic) => (
                      <div
                        key={topic}
                        className={`dropdown-item ${activeTopic === topic ? 'active' : ''}`}
                        onClick={() => handleTopicClick(topic)}
                      >
                        {topic.replace(/^#/, '')}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        <div className="header-right">
          <div className="search-container" onClick={() => setShowSearch(true)}>
            <SearchIcon size={20} />
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

      {showSearch && (
        <div className="search-overlay" ref={searchRef}>
          <Search onClose={() => setShowSearch(false)} onSelectTopic={handleTopicClick} />
        </div>
      )}
    </div>
  );
};

export default Header2;
