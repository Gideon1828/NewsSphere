import './Header2.css';
import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, Bookmark, Bell, MoreHorizontal, User, Check } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

import Search from '../pages/Search';

const Header2 = ({ onTopicSelect }) => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Added for redirecting from ReadLater
  const isReadLaterPage = location.pathname === '/ReadLater';
  const isAfterSignupPage = location.pathname === '/Aftersignup'; // Add this check for AfterSignup

  const [activeTopic, setActiveTopic] = useState('');
  const [userTopics, setUserTopics] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const modalRef = useRef(null);

  // Handle topics from localStorage
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

  // Close search if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close profile dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
  };

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out...");
  };

  // Handle navigation
  const handleNavigation = (destination) => {
    console.log(`Navigating to: ${destination}`);
    setIsDropdownOpen(false);
  };

  const handleTopicClick = (topic) => {
    setActiveTopic(topic);
    setShowDropdown(false);
    
    if (isReadLaterPage) {
      navigate('/Aftersignup', { state: { topic } }); // ✅ Pass topic via state
    } else if (onTopicSelect) {
      onTopicSelect(topic);
    }
  };

  // Only highlight topics if the user is not on ReadLater or AfterSignup
  useEffect(() => {
    if (isReadLaterPage || isAfterSignupPage) {
      setActiveTopic(''); // Do not highlight any topic on ReadLater or AfterSignup
    }
  }, [isReadLaterPage, isAfterSignupPage]);

  const visibleTopics = userTopics.slice(0, 2);
  const hiddenTopics = userTopics.slice(2);

  // Handle notification modal and preference
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (!event.target.closest(".notification-bell")) {
          setIsNotificationOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotificationModal = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleNotificationPreference = (enabled) => {
    setNotificationsEnabled(enabled);
    setIsNotificationOpen(false);
    console.log(`Notifications ${enabled ? "enabled" : "disabled"} for NewsSphere`);
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
          <Link to="/ReadLater">
            <button className={`icon-button ${isReadLaterPage ? 'active-bookmark' : ''}`}>
              <Bookmark size={20} />
            </button>
          </Link>

          <button
            className={`navbtn notification-bell ${!notificationsEnabled ? 'disabled' : ''}`}
            onClick={toggleNotificationModal}
          >
            <Bell size={24} strokeWidth={2} fill="#FF7043" color="#FF7043" />
          </button>

          {/* Notification Modal */}
          {isNotificationOpen && (
            <div className="notification-overlay">
              <div className="notification-modal" ref={modalRef}>
                <h2 className="notification-title">NOTIFICATIONS</h2>
                <p className="notification-message">
                  You want to turn <span style={{ color: "#ff7043", fontWeight: 500 }}>Notification</span>
                  {notificationsEnabled ? " OFF" : " ON"} for NewsSphere?
                </p>
                <div className="notification-actions">
                  <button
                    className="action-button yes-button"
                    onClick={() => handleNotificationPreference(!notificationsEnabled)}
                  >
                    Yes
                  </button>
                  <button className="action-button no-button" onClick={() => setIsNotificationOpen(false)}>
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="profile-wrapper">
            <button className="nav-item profile-icon" onClick={() => setIsDropdownOpen(!isDropdownOpen)} ref={profileRef}>
              <User size={24} strokeWidth={2} />
            </button>

            {/* Profile Section */}
            {isDropdownOpen && (
              <div className="dropdown-menu" ref={dropdownRef}>
                <button className="dropdown-item" onClick={() => handleNavigation("profile")}>
                  Profile
                </button>
                <button className="dropdown-item" onClick={() => handleNavigation("options")}>
                  Options
                </button>
                <button className="dropdown-item" onClick={toggleDarkMode}>
                  {isDarkMode && <Check size={24} />}
                  <span>Dark mode</span>
                </button>
                <button className="dropdown-item" onClick={() => handleNavigation("privacy")}>
                  Privacy policy
                </button>
                <button className="dropdown-item" onClick={() => handleNavigation("help")}>
                  Help
                </button>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
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
