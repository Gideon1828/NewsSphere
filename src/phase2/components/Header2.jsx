import './Header2.css';
import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, Bookmark, Bell, MoreHorizontal, User, Check  } from 'lucide-react';
import Search from '../pages/Search';

const Header2 = ({ onTopicSelect }) => {
  const [activeTopic, setActiveTopic] = useState('For You');
  const [userTopics, setUserTopics] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const dropdownRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    const storedTopics = localStorage.getItem('selectedTopics');
    if (storedTopics) {
      try {
        setUserTopics(JSON.parse(storedTopics));
      } catch (err) {
        console.error('Error parsing selectedTopics:', err);
      }
    }
  }
  , []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
//Profile Section
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

   // Toggle dark mode
   const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // In a real application, you would apply dark mode to the entire site
    document.body.classList.toggle("dark-mode")
  }

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out...")
    // In a real application, you would implement actual logout logic here
  }

  // Handle navigation
  const handleNavigation = (destination) => {
    console.log(`Navigating to: ${destination}`)
    // In a real application, you would implement actual navigation here
    setIsDropdownOpen(false)
  }

  const handleTopicClick = (topic) => {
    setActiveTopic(topic);
    setShowDropdown(false);
    if (onTopicSelect) onTopicSelect(topic);
  };

  const visibleTopics = userTopics.slice(0, 2);
  const hiddenTopics = userTopics.slice(2);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const modalRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Only close if the click wasn't on the bell icon
        if (!event.target.closest(".notification-bell")) {
          setIsNotificationOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Toggle notification modal
  const toggleNotificationModal = () => {
    setIsNotificationOpen(!isNotificationOpen)
  }

  // Handle notification preference
  const handleNotificationPreference = (enabled) => {
    setNotificationsEnabled(enabled)
    setIsNotificationOpen(false)

    // In a real application, you would save this preference to the user's account
    console.log(`Notifications ${enabled ? "enabled" : "disabled"} for NewsSphere`)

    // Show a toast or some feedback to the user
    /*const message = enabled ? "Notifications enabled" : "Notifications disabled"
    alert(message)*/ // In a real app, use a toast component instead
  }


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

        <div className="header-right ">
          <div className="search-container" onClick={() => setShowSearch(true)}>
            <SearchIcon size={20} />
            <span className="search-text">SEARCH</span>
          </div>
          <button className="icon-button">
            <Bookmark size={20} />
          </button>


          <button className={`navbtn notification-bell ${!notificationsEnabled ? "disabled" : ""}`}
            onClick={toggleNotificationModal}>
            <Bell size={24} strokeWidth={2} fill="#FF7043" color="#FF7043" />
          </button>

          {/* Notification Modal */}
      {isNotificationOpen && (
        <div className="notification-overlay">
          <div className="notification-modal" ref={modalRef}>
            <h2 className="notification-title">NOTIFICATIONS</h2>

            <p className="notification-message">
              you want To turn <span style={{color:"#ff7043",fontWeight:500}}>Notification</span>{notificationsEnabled ? "OFF" : "ON"} For
              NewsSphere?
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


          <div className='profile-wrapper'>
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
