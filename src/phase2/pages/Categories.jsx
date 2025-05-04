import React, { useState, useEffect } from "react";
import "./Categories.css";
import { Link } from 'react-router-dom';

function Categories() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [showFoodDropdown, setShowFoodDropdown] = useState(false);

  useEffect(() => {
    // Check if user has already selected topics
    const savedTopics = localStorage.getItem("selectedTopics");

    if (savedTopics) {
      setSelectedTopics(JSON.parse(savedTopics));
    } else {
      // Show welcome modal if no topics are saved
      setShowModal(true);
    }
  }, []);

  const handleTopicSelection = (topics) => {
    setSelectedTopics(topics);
    localStorage.setItem("selectedTopics", JSON.stringify(topics));
    setShowModal(false);
  };

  // Welcome Modal Component
  const WelcomeModal = () => {
    const [localSelectedTopics, setLocalSelectedTopics] = useState(selectedTopics || []);

    const topics = [
      "#NEWS",
      "#SCIENCE",
      "#TECHNOLOGY",
      "#BUSSINESS",
      "#TRAVEL",
      "#POLITICS",
      "#FOOD",
      "#PERSONEL FINANCE",
      "#CLIMATE CHANGE",
      "#HEALTH",
      "#SPORTS",
      "#ENTERTAINMENT",
      "#LIFESTYLE",
      "#HOME GARDEN",
      "#SELF IMPROVEMENT",
      "#DIY",
      "#COMPUTER SCIENCE",
      "#BLACK HISTORY",
      "#WORLD ECONOMY",
      "#CELEBRITY NEWS",
      "#BOOKS",
      "#MUSIC",
      "#STYLE",
      "#DESIGN",
      "#RUSSIA-UKRAINE",
      "#BREAKTHROUGHS",
      "#Psychology",
      "#ENTREPRENEUERSHIP",
      "#CONSERVATIVE VIEW",
    ];

    const toggleTopic = (topic) => {
      if (localSelectedTopics.includes(topic)) {
        setLocalSelectedTopics(localSelectedTopics.filter((t) => t !== topic));
      } else {
        setLocalSelectedTopics([...localSelectedTopics, topic]);
      }
    };

    const handleContinue = () => {
      if (localSelectedTopics.length >= 3) {
        handleTopicSelection(localSelectedTopics);
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-body">
            <h2 className="modal-title">
              Welcome To <span className="orange-text">NewsSphere</span>
            </h2>
            <p className="modal-description">
              Follow what interests you to personalise news. Follow Atleast 3 Topics before Continuing
            </p>

            <div className="topics-container">
              {topics.map((topic) => (
                <button
                  key={topic}
                  className={`topic-button ${localSelectedTopics.includes(topic) ? "selected" : ""}`}
                  onClick={() => toggleTopic(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>

            <Link to="/Aftersignup"><button
              className={`continue-button ${localSelectedTopics.length >= 3 ? "active" : "disabled"}`}
              onClick={handleContinue}
              disabled={localSelectedTopics.length < 3}
            >
              Continue
            </button></Link>
          </div>
        </div>
      </div>
    );
  };

  // Header Component
  const Header = () => {
    return (
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <a href="/" className="logo-container">
              <div className="logo">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="4" fill="#FF5722" />
                  <path d="M12 12H28V16H12V12Z" fill="white" />
                  <path d="M12 18H28V22H12V18Z" fill="white" />
                  <path d="M12 24H28V28H12V24Z" fill="white" />
                </svg>
              </div>
              <span className="logo-text">For You</span>
            </a>

            <nav className="nav-menu">
              <a href="/latest" className="nav-link">
                Latest
              </a>
              <a href="/technology" className="nav-link">
                Technology
              </a>
              <a href="/travel" className="nav-link">
                Travel
              </a>
              <div className="dropdown">
                <button
                  className="nav-link dropdown-toggle"
                  onClick={() => setShowFoodDropdown(!showFoodDropdown)}
                >
                  Food
                  <svg
                    className="dropdown-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {showFoodDropdown && (
                  <div className="dropdown-menu">
                    <a href="/food/recipes" className="dropdown-item">
                      Recipes
                    </a>
                    <a href="/food/restaurants" className="dropdown-item">
                      Restaurants
                    </a>
                    <a href="/food/cooking-tips" className="dropdown-item">
                      Cooking Tips
                    </a>
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className="header-right">
            <button className="icon-button">
              <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
            <button className="icon-button">
              <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">Bookmarks</span>
            </button>
            <button className="icon-button">
              <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">Notifications</span>
            </button>
            <button className="icon-button">
              <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">Profile</span>
            </button>
          </div>
        </div>
      </header>
    );
  };

  // News Card Component
  const NewsCard = () => {
    return (
      <div className="news-card">
        <div className="news-card-content">
          <div className="news-source">
            <div className="source-avatar">
              <img src="https://via.placeholder.com/24" alt="CNBC" />
            </div>
            <span className="source-name">CNBC</span>
          </div>

          <div className="news-image">
            <img src="https://via.placeholder.com/400x200" alt="News image" />
          </div>

          <div className="news-time">7 hours ago</div>

          <h3 className="news-title">
            Pope Francis on Breathing machine afer suffering sudden respiratory episode
          </h3>

          <div className="news-author">
            <span>CNBC - By mathiew hawkins</span>
          </div>

          <p className="news-excerpt">
            United arab emirates- feb 26,2025 : a cultural exchange delegation from china, organized by the state council
            information office, we know that Echange is Important for most of the Countries so far is kudo to the team So
            this is the first phase of the Project said Me
          </p>

          <div className="news-actions">
            <button className="action-button">
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="action-button">
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="action-button">
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.59 13.51L15.42 17.49"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.41 6.51L8.59 10.49"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <Header />

      {showModal && <WelcomeModal />}

      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">For You</h1>
            <div className="page-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7H21" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 12H21" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <h2 className="page-subtitle">The Best of EveryThing</h2>

          <div className="news-grid">
            <NewsCard />
            <NewsCard />
            <NewsCard />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Categories;