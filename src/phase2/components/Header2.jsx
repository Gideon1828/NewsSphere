import './Header2.css';
import { useState, useEffect } from 'react';
import { Search, Bookmark, Bell, User, MoreHorizontal } from 'lucide-react';

const Header2 = ({ onTopicSelect }) => {
  const [activeTopic, setActiveTopic] = useState('For You');
  const [userTopics, setUserTopics] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

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

  const handleTopicClick = (topic) => {
    setActiveTopic(topic);
    setShowDropdown(false); // close dropdown if open
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

            {/* Visible Topics */}
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

            {/* Three-dot dropdown */}
            {hiddenTopics.length > 0 && (
              <div className="dropdown-wrapper">
                <button
                  className="icon-button"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
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
