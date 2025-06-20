import React, { useState, useEffect } from 'react';
import './Aftersignup.css';
import { Bookmark, ChevronDown, Share, Loader } from 'lucide-react';

import Header2 from '../components/Header2';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';


const Aftersignup = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("For You");
  const [articlesToShow, setArticlesToShow] = useState(3);
  const [newsArticles, setNewsArticles] = useState([]); 
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();

  const checkIfBookmarked = (article) => {
  return bookmarkedArticles.some(a => a.url === article.url);
};

  useEffect(() => {
    if (location.state && location.state.topic) {
      setSelectedTopic(location.state.topic);
    }
  }, [location.state]);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic.replace(/^#/, ''));
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=${selectedTopic}&lang=en&country=in&max=30&apikey=e199c04b5ba393d25905d7f978036249`
        );
        const data = await response.json();
        if (data.articles) {
          setNewsArticles(data.articles);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [selectedTopic]);

  useEffect(() => {
    const storedData = localStorage.getItem('user');
    if (storedData) {
      const user = JSON.parse(storedData);
      setUserName(user.fullName || 'User');
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUserBookmarks = async () => {
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:5000/api/user-preferences', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarkedArticles(res.data.readLaterNews || []);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      }
    };

    fetchUserBookmarks();
  }, [token]);

  const handleBookmark = async (e, article) => {
  e.preventDefault();

  const isBookmarked = bookmarkedArticles.some(a => a.url === article.url);

  const payload = {
    source:article.source.name,
    title: article.title,
    description: article.description,
    url: article.url,
    image: article.image,
    publishedAt: article.publishedAt,
  };

  try {
    const res = await axios.post("http://localhost:5000/api/toggle-bookmark", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Update bookmarks with the response (cleaner approach)
    setBookmarkedArticles(res.data.readLaterNews || []);
  } catch (err) {
    console.error("Bookmark error:", err);
  }
};

  const handleShare = (e, index) => {
    e.preventDefault();
    console.log(`Shared article ${index}`);
  };

  const handleExpand = (e, index) => {
    e.preventDefault();
    console.log(`Expanded article ${index}`);
  };

  const handleReadMore = () => {
    setArticlesToShow((prev) => prev + 3);
  };


  const openArticle = (article) => {
  // push a new route and attach the article in location.state
  navigate("/Readarticle", { state: { article } });
};

  /* const bookmarkedSet = new Set(bookmarkedArticles.map(t => t.trim()));
 */
  return (
    <div className="news-container">
      <Header2 onTopicSelect={handleTopicSelect} />

      <div className="welcome-message">
        Welcome {userName}!
      </div>

      <div className="for-you-section">
        <h1 className="for-you-title">
          {selectedTopic.replace(/^#/, '')}
          <span className="for-you-icon"></span>
        </h1>
        <p className="for-you-subtitle">The Best of Everything you Follow</p>
      </div>

      <div className="news-grid">
        {newsArticles.slice(0, articlesToShow).map((article, index) => (
          <div className="news-card" key={index} >
            <div onClick={() => openArticle(article)}style={{cursor:"pointer" }} className="news-source">
              <img
                className="source-avatar"
                src={`https://www.google.com/s2/favicons?sz=32&domain_url=${article.source.url}`}
                alt={article.source.name}
              />
              <span className="source-name">{article.source.name}</span>
            </div>
            <div onClick={() => openArticle(article)}style={{cursor:"pointer" }} className="news-image">
              <img src={article.image || "/placeholder.svg"} alt="News thumbnail" />
            </div>
            <div onClick={() => openArticle(article)}style={{cursor:"pointer" }} className="news-time">
              {new Date(article.publishedAt).toLocaleTimeString()} | {new Date(article.publishedAt).toLocaleDateString()}
            </div>
            <h2 onClick={() => openArticle(article)}style={{cursor:"pointer" }} className="news-title">{article.title}</h2>
            <div onClick={() => openArticle(article)}style={{cursor:"pointer" }} className="news-author">
              <span className="source-name">{article.source.name}</span> - By {article.author || "Unknown"}
            </div>
            <p onClick={() => openArticle(article)}style={{cursor:"pointer" }} className="news-content">{article.description}</p>
            <div className="news-actions">
              <button className="action-button" onClick={(e) => {e.stopPropagation(); handleExpand(e, index);
              }}>
                <ChevronDown size={16} />
              </button>
              <button
                className="action-button"
                onClick={(e) => handleBookmark(e, article)}
              
                style={{ color: checkIfBookmarked(article) ? "blue" : "black" }}
              >
                <Bookmark fill={checkIfBookmarked(article) ? "blue" : "none"} />
              </button>
              <button className="action-button" onClick={(e) => {e.stopPropagation(); handleExpand(e, index);
              }}>
                <Share size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="loading-container">
          <Loader className="spinner" size={24} />
        </div>
      )}

      <div className="read-more">
        <button onClick={handleReadMore}>Read More</button>
      </div>

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
