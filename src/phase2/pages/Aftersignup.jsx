import React, { useState, useEffect } from 'react';
import './Aftersignup.css';
import { Bookmark, ChevronDown, Share, Loader } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header2 from '../components/Header2';

const Aftersignup = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("Anand");
  const [selectedTopic, setSelectedTopic] = useState("For You");
  const [articlesToShow, setArticlesToShow] = useState(3); // Initially show 3 articles

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.topic) {
      setSelectedTopic(location.state.topic);
    }
  }, [location.state]);
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  // Load user data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('user');
    if (storedData) {
      const user = JSON.parse(storedData);
      setUserName(user.fullName || 'User'); // fallback if fullName is not set
    }

    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Sample news data
  const newsArticles = Array(9).fill({
    source: "CNBC",
    timeAgo: "7 hours ago",
    title: "Pope Francis on Breathing machine after suffering sudden respiratory episode",
    author: "matthew hawkins",
    date: "feb 26,2025",
    content: "United arab emirates- feb 26,2025 : a cultural exchange delegation from china, organized by the state council information office, we know that Estonage is Important for most of the Countries so far is kudo to the team So this is the first phase of the Project said Me"
  });

  const handleBookmark = (e, index) => {
    e.preventDefault();
    console.log(`Bookmarked article ${index}`);
    // Add bookmark functionality here
  };

  const handleShare = (e, index) => {
    e.preventDefault();
    console.log(`Shared article ${index}`);
    // Add share functionality here
  };

  const handleExpand = (e, index) => {
    e.preventDefault();
    console.log(`Expanded article ${index}`);
    // Add expand functionality here
  };

  // Handle 'Read More' button
  const handleReadMore = () => {
    setArticlesToShow((prev) => prev + 3); // Always load 3 more articles
  };

  return (
    <div className="news-container">
      {/* Header */}
      <Header2 onTopicSelect={handleTopicSelect} />

      {/* Welcome message */}
      <div className="welcome-message">
        Welcome {userName}!
      </div>

      {/* For You section */}
      <div className="for-you-section">
        <h1 className="for-you-title">
          {selectedTopic}
          <span className="for-you-icon"></span>
        </h1>
        <p className="for-you-subtitle">The Best of Everything you Follow</p>
      </div>

      {/* News grid */}
      <div className="news-grid">
        {newsArticles.slice(0, articlesToShow).map((article, index) => (
          <div className="news-card" key={index}>
            <div className="news-source">
              <div className="source-logo cnbc"></div>
              <span className="source-name">{article.source}</span>
            </div>
            <div className="news-image">
              <img src="/placeholder.svg?height=200&width=300" alt="News thumbnail" />
            </div>
            <div className="news-time">{article.timeAgo}</div>
            <h2 className="news-title">{article.title}</h2>
            <div className="news-author">
              <span className="source-name">{article.source}</span> - By {article.author}
            </div>
            <p className="news-content">{article.content}</p>
            <div className="news-actions">
              <button className="action-button" onClick={(e) => handleExpand(e, index)}>
                <ChevronDown size={16} />
              </button>
              <button className="action-button" onClick={(e) => handleBookmark(e, index)}>
                <Bookmark size={16} />
              </button>
              <button className="action-button" onClick={(e) => handleShare(e, index)}>
                <Share size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="loading-container">
          <Loader className="spinner" size={24} />
        </div>
      )}

      {/* Read More button */}
      <div className="read-more">
        <button onClick={handleReadMore}>Read More</button>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#" className="footer-link">Log In</a>
          <a href="#" className="footer-link">About Us</a>
          <a href="#" className="footer-link">Help</a>
          <a href="#" className="footer-link">Terms</a>
          <a href="#" className="footer-link">Privacy Policy</a>
        </div>
        <div className="copyright">@2025 NewsSphere</div>
      </footer>
    </div>
  );
};

export default Aftersignup;
