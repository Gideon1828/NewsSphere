"use client";

import { useState, useRef, useEffect } from "react";
import { Bookmark, MoreHorizontal, Trash2, Share } from "lucide-react";
import "./ReadLater.css";
import Header2 from "../components/Header2";
import axios from "axios";

const ReadLater = () => {
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState("latest");
  const menuRef = useRef(null);
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchSavedArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const prefsRes = await axios.get("http://localhost:5000/api/user-preferences", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const savedTitles = prefsRes.data.readLaterNews || [];

      // Map titles to article-like objects with placeholders
      const articles = savedTitles.map((title, idx) => ({
        title,
        description: "No description available.",
        url: "#", // No URL saved, so just a placeholder or you can remove the link
        image: "/placeholder.svg",
      }));

      setSavedArticles(articles);
    } catch (err) {
      console.error("Error fetching saved articles:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchSavedArticles();
}, []);


  // Close sort menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest(".sort-button")) {
        setSortMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSortMenu = () => setSortMenuOpen(!sortMenuOpen);

  const handleSortChange = (option) => {
    setSortOption(option);
    const sorted = [...savedArticles];

    if (option === "oldest") {
      sorted.reverse();
    }

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
              <div key={idx} className="article-card">
                <img src={article.image || "/placeholder.svg"} alt={article.title} />
                <h2>{article.title}</h2>
                <p>{article.description}</p>
                <a href={article.url} target="_blank" rel="noreferrer">
                  Read full article
                </a>
                <div className="article-actions">
                  <button onClick={() => shareArticle(article)}>
                    <Share size={16} />
                  </button>
                  <button disabled>
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
