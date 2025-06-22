import React, { useState, useEffect } from 'react';
import './Aftersignup.css';
import { Bookmark, ChevronDown, Share, Loader } from 'lucide-react';
import Header2 from '../components/Header2';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import topicTranslations from './topicTranslations';

const Aftersignup = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("For You");
  const [articlesToShow, setArticlesToShow] = useState(3);
  const [newsArticles, setNewsArticles] = useState([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [preferredLang, setPreferredLang] = useState(localStorage.getItem('lang') || 'en');
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();


  const checkIfBookmarked = (article) => {
    return bookmarkedArticles.some(a => a.url === article.url);
  };

  const getLocalizedTopic = (topic, lang) => {
    const key = topic.toLowerCase();
    return topicTranslations[key]?.[lang] || topic;
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
    const interval = setInterval(() => {
      const lang = localStorage.getItem('lang') || 'en';
      if (lang !== preferredLang) {
        setPreferredLang(lang);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [preferredLang]);

useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const localizedTopic = getLocalizedTopic(selectedTopic, preferredLang);
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=${localizedTopic}&lang=${preferredLang}&max=30&apikey=553dc14c7832190909f27b1b12fa5252`
        );
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
          setNewsArticles(data.articles);
        } else {
          const fallback = await fetch(
            `https://gnews.io/api/v4/top-headlines?lang=${preferredLang}&max=30&apikey=e199c04b5ba393d25905d7f978036249`
          );
          const fallbackData = await fallback.json();
          setNewsArticles(fallbackData.articles || []);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [selectedTopic, preferredLang]);


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
        const res = await axios.get('https://newssphere-wxr1.onrender.com/api/user-preferences', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarkedArticles(res.data.readLaterNews || []);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      }
    };

    fetchUserBookmarks();
  }, [token]);

  useEffect(() => {
    const fetchRecommendedArticles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || selectedTopic !== "For You") return;

        const clickedRes = await fetch("http://localhost:5000/api/get-clicked-articles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const clicked = await clickedRes.json();
        const clickedUrls = clicked.map(c => c.url);

        const filteredArticles = newsArticles.filter(
          article => !clickedUrls.includes(article.url)
        );

        if (filteredArticles.length === 0) {
  console.warn("🚫 No new articles left to recommend.");
  setRecommendedArticles([]); // Optional: Clear recommendations
  return;
}

const response = await fetch("http://localhost:5000/api/smart-recommendations", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


        if (!response.ok) {
          const err = await response.json();
          console.error("❌ Error from server:", err);
          return;
        }

        const recommended = await response.json();
        setRecommendedArticles(recommended);
      } catch (error) {
        console.error("❌ Failed to fetch recommendations:", error);
      }
    };

    fetchRecommendedArticles();
  }, [selectedTopic, newsArticles]);



  const handleBookmark = async (e, article) => {
    e.preventDefault();
    const payload = {
      source: article.source.name,
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image,
      publishedAt: article.publishedAt,
    };

    try {
      const res = await axios.post("https://newssphere-wxr1.onrender.com/api/toggle-bookmark", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarkedArticles(res.data.readLaterNews || []);
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  };

  const handleExpand = (e, index) => {
    e.preventDefault();
    console.log(`Expanded article ${index}`);
  };

  const handleReadMore = () => {
    setArticlesToShow((prev) => prev + 3);
  };

  const openArticle = (article) => {
    navigate("/Readarticle", { state: { article } });
  };

  return (
    <div className="news-container">
      <Header2 onTopicSelect={handleTopicSelect} />

      <div className="welcome-message">Welcome {userName}!</div>

      <div className="for-you-section">
        <h1 className="for-you-title">
          {selectedTopic.replace(/^#/, '')}
          <span className="for-you-icon"></span>
        </h1>
        <p className="for-you-subtitle">The Best of Everything you Follow</p>
      </div>

      <div className="news-grid">
  {selectedTopic === "For You" ? (
    recommendedArticles.length > 0 ? (
      recommendedArticles.slice(0, articlesToShow).map((article, index) => (
        <div className="news-card" key={`rec-${index}`}>
          <div onClick={() => openArticle(article)} className="news-source" style={{ cursor: "pointer" }}>
            <img
              className="source-avatar"
              src={`https://www.google.com/s2/favicons?sz=32&domain_url=${article.source?.url || article.url}`}
              alt={article.source?.name ||article.source  || "Unknown"}
            />
            <span className="source-name">{article.source?.name ||article.source  || "Unknown Source"}</span>
          </div>
          <div onClick={() => openArticle(article)} className="news-image" style={{ cursor: "pointer" }}>
            <img src={article.image || "/placeholder.svg"} alt="News thumbnail" />
          </div>
          <div onClick={() => openArticle(article)} className="news-time" style={{ cursor: "pointer" }}>
            {new Date(article.publishedAt).toLocaleTimeString()} | {new Date(article.publishedAt).toLocaleDateString()}
          </div>
          <h2 onClick={() => openArticle(article)} className="news-title" style={{ cursor: "pointer" }}>
            {article.title}
          </h2>
          <div onClick={() => openArticle(article)} className="news-author" style={{ cursor: "pointer" }}>
            <span className="source-name">{article.source?.name || "Unknown"}</span> - By {article.author || "Unknown"}
          </div>
          <p onClick={() => openArticle(article)} className="news-content" style={{ cursor: "pointer" }}>
            {article.description}
          </p>
          <div className="news-actions">
            <button className="action-button" onClick={(e) => { e.stopPropagation(); handleExpand(e, index); }}>
              <ChevronDown size={16} />
            </button>
            <button className="action-button" onClick={(e) => handleBookmark(e, article)} style={{ color: checkIfBookmarked(article) ? "blue" : "black" }}>
              <Bookmark fill={checkIfBookmarked(article) ? "blue" : "none"} />
            </button>
            <button className="action-button" onClick={(e) => { e.stopPropagation(); handleExpand(e, index); }}>
              <Share size={16} />
            </button>
          </div>
        </div>
      ))
    ) : (
      <p>No recommendations yet. Please interact with some articles to see personalized results.</p>
    )
  ) : (
    newsArticles.slice(0, articlesToShow).map((article, index) => (
      <div className="news-card" key={index}>
        <div onClick={() => openArticle(article)} className="news-source" style={{ cursor: "pointer" }}>
          <img
            className="source-avatar"
            src={`https://www.google.com/s2/favicons?sz=32&domain_url=${article.source.url}`}
            alt={article.source.name}
          />
          <span className="source-name">{article.source.name}</span>
        </div>
        <div onClick={() => openArticle(article)} className="news-image" style={{ cursor: "pointer" }}>
          <img src={article.image || "/placeholder.svg"} alt="News thumbnail" />
        </div>
        <div onClick={() => openArticle(article)} className="news-time" style={{ cursor: "pointer" }}>
          {new Date(article.publishedAt).toLocaleTimeString()} | {new Date(article.publishedAt).toLocaleDateString()}
        </div>
        <h2 onClick={() => openArticle(article)} className="news-title" style={{ cursor: "pointer" }}>
          {article.title}
        </h2>
        <div onClick={() => openArticle(article)} className="news-author" style={{ cursor: "pointer" }}>
          <span className="source-name">{article.source.name}</span> - By {article.author || "Unknown"}
        </div>
        <p onClick={() => openArticle(article)} className="news-content" style={{ cursor: "pointer" }}>
          {article.description}
        </p>
        <div className="news-actions">
          <button className="action-button" onClick={(e) => { e.stopPropagation(); handleExpand(e, index); }}>
            <ChevronDown size={16} />
          </button>
          <button className="action-button" onClick={(e) => handleBookmark(e, article)} style={{ color: checkIfBookmarked(article) ? "blue" : "black" }}>
            <Bookmark fill={checkIfBookmarked(article) ? "blue" : "none"} />
          </button>
          <button className="action-button" onClick={(e) => { e.stopPropagation(); handleExpand(e, index); }}>
            <Share size={16} />
          </button>
        </div>
      </div>
    ))
  )}
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
