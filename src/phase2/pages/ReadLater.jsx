"use client";

import { useState, useRef, useEffect } from "react";
import { Bookmark, MoreHorizontal, Trash2, Share } from "lucide-react";
import "./ReadLater.css";
import Header2 from "../components/Header2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReadLater = () => {
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState("latest");
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedArticles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/user-preferences", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const articles = res.data.readLaterNews || [];
        setSavedArticles(articles);
      } catch (err) {
        console.error("Error fetching saved articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedArticles();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest(".sort-button")) {
        setSortMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSortMenu = () => setSortMenuOpen(!sortMenuOpen);

  const handleSortChange = (option) => {
    setSortOption(option);
    const sorted = [...savedArticles];
    if (option === "oldest") sorted.reverse();
    setSavedArticles(sorted);
    setSortMenuOpen(false);
  };

  const clearAllArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/clear-bookmarks", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedArticles([]);
    } catch (err) {
      console.error("Error clearing bookmarks:", err);
    }
    setSortMenuOpen(false);
  };

  const shareArticle = (article) => {
    alert(`Sharing: ${article.title}`);
  };

  const openArticle = (article) => {
  // push a new route and attach the article in location.state
  navigate("/Readarticle", { state: { article } });
};

const removeBookmark = async (article) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    await axios.post(
      "http://localhost:5000/api/toggle-bookmark",
      {
        title: article.title,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source || "Unknown",  // optional but good to pass
        description: article.description || "",
        image: article.image || ""
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Remove from local state
    setSavedArticles((prev) =>
      prev.filter((a) => a.url !== article.url)
    );
  } catch (err) {
    console.error("Error removing bookmark:", err);
  }
};


  if (loading) return <p>Loading saved articles...</p>;

  return (
    <div className="read-later-container">
      <Header2 />

      <main className="read-later-content">
        <div className="read-later-header">
          <h1 className="read-later-title">Read Later</h1>
          <div className="sort-options">
            <button className="sort-button" onClick={toggleSortMenu}>
              <MoreHorizontal size={24} />
            </button>

            {sortMenuOpen && (
              <div className="sort-menu" ref={menuRef}>
                <div className="sort-menu-options">
                  <label className="sort-option">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortOption === "latest"}
                      onChange={() => handleSortChange("latest")}
                    />
                    <span className="radio-custom">
                      {sortOption === "latest" && <div className="radio-checked"></div>}
                    </span>
                    <span>Latest</span>
                  </label>

                  <label className="sort-option">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortOption === "oldest"}
                      onChange={() => handleSortChange("oldest")}
                    />
                    <span className="radio-custom">
                      {sortOption === "oldest" && <div className="radio-checked"></div>}
                    </span>
                    <span>Oldest</span>
                  </label>
                </div>

                <div className="sort-menu-divider"></div>

                <button className="clear-all-button" onClick={clearAllArticles}>
                  <Trash2 size={16} className="trash-icon" />
                  <span>Clear all</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="sort-indicator">{sortOption === "latest" ? "Latest" : "Oldest"}</div>

        {savedArticles.length === 0 ? (
          <p>No saved articles found.</p>
        ) : (
          <div className="articles-grid">
            {savedArticles.map((article, idx) => (
              <div key={idx} className="article-card" onClick={() => openArticle(article)} style={{ cursor: "pointer" }}>
                 <img
                className="source-avatar"
                src={`https://www.google.com/s2/favicons?sz=32&domain_url=${article.url}`}
                alt={article.source}
              />
              <span className="source-name">{article.source}</span>
                <img src={article.image || "/placeholder.svg"} alt={article.title} />
                <h2>{article.title}</h2>
                <p>{article.description || "No description available."}</p>
                <p className="article-time">
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleString() : "Unknown time"}
                </p>
                <div className="article-actions">
                  <button onClick={(e) => { e.stopPropagation(); shareArticle(article); }}>
                    <Share size={16} />
                  </button>
                  <button
  onClick={(e) => {
    e.stopPropagation();
    removeBookmark(article);
  }}
>
  <Bookmark size={16} fill="blue" />
</button>


                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReadLater;
