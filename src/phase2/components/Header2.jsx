import './Header2.css';
import { useState, useEffect, useRef, useContext } from 'react';
import { Search as SearchIcon, Bookmark, Bell, MoreHorizontal, User, Check } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from "../../context/ThemeContext";
import Search from '../pages/Search';

const Header2 = ({ onTopicSelect ,topicclicked }) => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Added for redirecting from ReadLater
  const isReadLaterPage = location.pathname === '/ReadLater';
  const isAfterSignupPage = location.pathname === '/Aftersignup'; // Add this check for AfterSignup

  const [activeTopic, setActiveTopic] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  //const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
const { darkMode, setDarkMode } = useContext(ThemeContext);
const [fontSize, setFontSize] = useState('Normal');

  const modalRef = useRef(null);
  const [selectedLang, setSelectedLang] = useState('en'); // default language
  const [userTopics, setUserTopics] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Handle topics from localStorage
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // user not logged in

        const res = await fetch('https://newssphere-wxr1.onrender.com/api/user-preferences', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user preferences');

        const data = await res.json();
        setUserTopics(data.selectedCategory || []);
        setNotificationsEnabled(data.isNotificationOn || false);
      } catch (err) {
        console.error('Error fetching user preferences:', err);
      }
    };

    fetchUserPreferences();
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

  useEffect(() => {
  const savedLang = localStorage.getItem('lang');
  if (savedLang) setSelectedLang(savedLang);
}, []);

const handleLanguageChange = (e) => {
  const lang = e.target.value;
  setSelectedLang(lang);
  localStorage.setItem('lang', lang);
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
};


  // Handle notification preference
  const handleNotificationPreference = async (enabled) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    // First, make API call
    const res = await fetch('https://newssphere-wxr1.onrender.com/api/save-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isNotificationOn: enabled }),
    });

    if (!res.ok) throw new Error('Failed to save notification preference');

    // Update state ONLY after successful API call
    setNotificationsEnabled(enabled);
    setIsNotificationOpen(false); // ✅ Close modal here
    console.log(`Notifications ${enabled ? 'enabled' : 'disabled'} for NewsSphere`);
  } catch (err) {
    console.error('Error saving notification preference:', err);
  }
};


  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    //document.body.classList.toggle("dark-mode");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('selectedCategory');
    localStorage.removeItem('isNotificationOn');
    navigate('/'); // Redirect to home page after logout
    console.log("User logged out successfully");
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
    if (isReadLaterPage ){ 
      setActiveTopic(''); // Do not highlight any topic on ReadLater or AfterSignup
        }
    if (isAfterSignupPage) {
      setActiveTopic('For You');
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
useEffect(() => {
  const savedSize = localStorage.getItem('fontSize') || 'Normal';
  setFontSize(savedSize);
  document.documentElement.style.setProperty('--user-font-size', savedSize);
}, []);

  const toggleNotificationModal = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

 const handleFontSizeChange = (e) => {
  const size = e.target.value;
  setFontSize(size);
  document.documentElement.style.setProperty('--user-font-size', size);
  localStorage.setItem('fontSize', size);

  // Optional: Add class to body to handle fixed pixel sizes
  document.body.className = size; // e.g., "large", "small"
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
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
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
                {/* here i want dynamic font size changer ui*/ }
                <button className="dropdown-item">
  <select
    id="fontsize"
    value={fontSize}
    onChange={handleFontSizeChange}
    style={{ padding: "3px", borderRadius: "6px" }}
  >
    <option value="small">Small</option>
    <option value="Normal">Normal</option>
    <option value="large">Large</option>
    <option value="x-large">Very Large</option>
  </select>
  <label htmlFor="fontsize" style={{ marginRight: "8px" }}>Font size</label>
</button>

                <button className="dropdown-item" onClick={() => handleNavigation("options")}>
                  Options
                </button>
                <button className="dropdown-item" onClick={toggleDarkMode}>
                  {darkMode && <Check size={24} />}
                  <span>Dark mode</span>
                </button>
                <button  className="dropdown-item">
                  <select
    id="language"
    value={selectedLang}
    onChange={handleLanguageChange}
    style={{ padding: "3px", borderRadius: "6px" }}
  >
    <option value="en">English</option>
    <option value="hi">Hindi</option>
    <option value="es">Spanish</option>
    <option value="fr">French</option>
    <option value="de">German</option>
    <option value="zh">Chinese</option>
    <option value="ar">Arabic</option>
  </select>
                  <label htmlFor="language" style={{ marginRight: "8px" }}>language</label>
  
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
