"use client";

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Readarticle.css";
import Header2 from "../components/Header2";

const Readarticle = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;

  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [footerMenuOpen, setFooterMenuOpen] = useState(false);
  const [topicclicked, settopicclicked] = useState(null);

  // ✅ Handle outside click to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        headerMenuOpen &&
        headerRef.current &&
        !headerRef.current.contains(event.target) &&
        !event.target.closest(".header-trigger")
      ) {
        setHeaderMenuOpen(false);
      }

      if (
        footerMenuOpen &&
        footerRef.current &&
        !footerRef.current.contains(event.target) &&
        !event.target.closest(".footer-trigger")
      ) {
        setFooterMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [headerMenuOpen, footerMenuOpen]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!article) {
    return <div className="article-container"><p>No article data provided.</p></div>;
  }

  const relatedArticles = [
    {
      id: 1,
      title: "Hamilton Cancels Kennedy's Center Run",
      source: "The Hill-Hip timojita",
      image: "/placeholder.svg?height=80&width=120",
    },
  ];

  // ✅ Handle topic click from Header
  const handleTopicClick = (topic) => {
    setActiveTopic(topic);
    navigate("/aftersignup", { state: { topicclicked: topic } });
  };

  return (
    <div>
      <Header2
        activeTopic={topicclicked}
      />

      <div className={`article-container ${isVisible ? "fade-in" : ""}`}>
        <header className="article-header">
          <div className="news-source">
            <div className="cnbc-logo">
              <img
                className="source-avatar"
                src={`https://www.google.com/s2/favicons?sz=32&domain_url=${article.source.url}`}
                alt={article.source.name}
              />
              <span className="logo-text">{article.source?.name || "Unknown Source"}</span>
            </div>
          </div>
        </header>

        <main className="article-main">
          <article className="article-content">
            <h1 className="article-title slide-up">{article.title}</h1>

            <div className="article-image-container scale-in">
              <img src={article.image || "/placeholder.svg"} alt="Article" className="article-image" />
            </div>

            <div className="article-meta slide-up">
              <span className="source">{article.source?.name}</span>
              <span className="separator">-</span>
              <span className="author">By {article.author || "Unknown"}</span>
              <div className="timestamp">
                {new Date(article.publishedAt).toLocaleTimeString()} |{" "}
                {new Date(article.publishedAt).toLocaleDateString()}
              </div>
            </div>

            <div className="article-body">
              <div className="article-layout">
                <div className="article-text slide-up">
                  <p className="article-paragraph">{article.content || article.description}</p>
                </div>

                <div className="article-sidebar slide-up">
                  <div className="sidebar-content">
                    <p className="sidebar-text">
                      {article.description || "No additional summary available."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <section className="related-articles slide-up">
            <h2 className="related-title">Related articles</h2>
            <div className="related-grid">
              {relatedArticles.map((item, index) => (
                <div
                  key={item.id}
                  className="related-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="related-image" />
                  <div className="related-content">
                    <h3 className="related-item-title">{item.title}</h3>
                    <p className="related-source">{item.source}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="read-more-btn pulse">Read More</button>
          </section>
        </main>
      </div>

      <footer className="footer" ref={footerRef}>
        <div className="footer-links">
          <a href="#" className="footer-link footer-trigger">Log In</a>
          <a href="#" className="footer-link footer-trigger">About Us</a>
          <a href="#" className="footer-link footer-trigger">Help</a>
          <a href="#" className="footer-link footer-trigger">Terms</a>
          <a href="#" className="footer-link footer-trigger">Privacy Policy</a>
        </div>
        <div className="copyright">@2025 NewsSphere</div>
      </footer>
    </div>
  );
};

export default Readarticle;
