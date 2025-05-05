"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Bookmark, Bell, User, ChevronDown, MoreHorizontal, Trash2, Share, Check } from "lucide-react"
import "./ReadLater.css"
import Header2 from "../components/Header2"

const ReadLater = () => {
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [sortOption, setSortOption] = useState("latest")
  const menuRef = useRef(null)

  // Sample saved articles data
  const [savedArticles, setSavedArticles] = useState([
    {
      id: 1,
      source: "CNBC",
      sourceImage: "/cnbc-logo.png",
      timeAgo: "7 hours ago",
      title: "Pope Francis on Breathing machine afer suffering sudden respiratory episode",
      author: "matthew hawkins",
      date: "feb 26,2025",
      content:
        "United arab emirates- feb 26,2025 : a cultural exchange delegation from china, organized by the state council information office, we know that Echange is Important for most of the Countries so far is kudo to the team So this is the first phase of the Project said Me",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10.png-bOOTQxAD12o4f5NuV04TBBTDXcVaGA.jpeg",
      expanded: false,
      bookmarked: true,
    },
    {
      id: 2,
      source: "CNBC",
      sourceImage: "/cnbc-logo.png",
      timeAgo: "7 hours ago",
      title: "Pope Francis on Breathing machine afer suffering sudden respiratory episode",
      author: "matthew hawkins",
      date: "feb 26,2025",
      content:
        "United arab emirates- feb 26,2025 : a cultural exchange delegation from china, organized by the state council information office, we know that Echange is Important for most of the Countries so far is kudo to the team So this is the first phase of the Project said Me",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10.png-bOOTQxAD12o4f5NuV04TBBTDXcVaGA.jpeg",
      expanded: false,
      bookmarked: true,
    },
    {
      id: 3,
      source: "CNBC",
      sourceImage: "/cnbc-logo.png",
      timeAgo: "7 hours ago",
      title: "Pope Francis on Breathing machine afer suffering sudden respiratory episode",
      author: "matthew hawkins",
      date: "feb 26,2025",
      content:
        "United arab emirates- feb 26,2025 : a cultural exchange delegation from china, organized by the state council information office, we know that Echange is Important for most of the Countries so far is kudo to the team So this is the first phase of the Project said Me",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10.png-bOOTQxAD12o4f5NuV04TBBTDXcVaGA.jpeg",
      expanded: false,
      bookmarked: true,
    },
  ])

  // Close sort menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest(".sort-button")) {
        setSortMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Toggle sort menu
  const toggleSortMenu = () => {
    setSortMenuOpen(!sortMenuOpen)
  }

  // Handle sort option change
  const handleSortChange = (option) => {
    setSortOption(option)

    // Sort the articles based on the selected option
    const sortedArticles = [...savedArticles]
    if (option === "oldest") {
      // For demo purposes, we'll just reverse the array
      sortedArticles.reverse()
    }

    setSavedArticles(sortedArticles)
    setSortMenuOpen(false)
  }

  // Clear all saved articles
  const clearAllArticles = () => {
    setSavedArticles([])
    setSortMenuOpen(false)
  }

  // Toggle article expansion
  const toggleArticleExpansion = (id) => {
    setSavedArticles(
      savedArticles.map((article) => (article.id === id ? { ...article, expanded: !article.expanded } : article)),
    )
  }

  // Toggle bookmark status
  const toggleBookmark = (id) => {
    setSavedArticles(
      savedArticles.map((article) => (article.id === id ? { ...article, bookmarked: !article.bookmarked } : article)),
    )
  }

  // Share article
  const shareArticle = (id) => {
    const article = savedArticles.find((a) => a.id === id)
    console.log(`Sharing article: ${article.title}`)
    // In a real app, implement sharing functionality
    alert(`Sharing: ${article.title}`)
  }

  return (
    <div className="read-later-container">
      {/* Header */}
      <Header2/>

      {/* Read Later Content */}
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

        {savedArticles.length > 0 ? (
          <div className="articles-grid">
            {savedArticles.map((article) => (
              <div className="article-card" key={article.id}>
                <div className="article-source">
                  <div className="source-logo">
                    <span>{article.source}</span>
                  </div>
                </div>

                <div className="article-image">
                  <img src={article.image || "/placeholder.svg"} alt={article.title} />
                </div>

                <div className="article-time">{article.timeAgo}</div>

                <h2 className="article-title">{article.title}</h2>

                <div className="article-author">
                  <span className="source-name">{article.source}</span> - By {article.author}
                </div>

                <p className="article-content">{article.content}</p>

                <div className="article-actions">
                  <button className="action-button" onClick={() => toggleArticleExpansion(article.id)}>
                    <Check size={16} />
                  </button>

                  <button
                    className={`action-button ${article.bookmarked ? "active" : ""}`}
                    onClick={() => toggleBookmark(article.id)}
                  >
                    <Bookmark size={16} fill={article.bookmarked ? "#ff5722" : "none"} />
                  </button>

                  <button className="action-button" onClick={() => shareArticle(article.id)}>
                    <Share size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-articles">
            <p>You have no saved articles</p>
            <button className="browse-button">Browse articles</button>
          </div>
        )}
      </main>
    </div>
  )
}

export default ReadLater
