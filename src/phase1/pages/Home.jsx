import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Header1 from "../components/Header1";
import Footer from "../components/Footer";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [articles, setArticles] = useState([]);
  const [articlesToShow, setArticlesToShow] = useState(6);

  const categories = [
    { label: "General", value: "general" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Technology", value: "technology" },
    { label: "Travel", value: "travel" },
    { label: "Food", value: "food" },
    { label: "Sports", value: "sports" },
  ];

  const categoryToSubreddit = {
    general: "news",
    entertainment: "entertainment",
    technology: "technology",
    travel: "travel",
    food: "food",
    sports: "sports",
  };

  const handleCategoryClick = (categoryValue) => {
    setActiveCategory(categoryValue);
    setArticlesToShow(6); // Reset article count on category change
  };

  const handleReadMore = () => {
    setArticlesToShow((prev) => prev + 3);
  };

 useEffect(() => {
  const fetchArticles = async () => {
    try {
      const gnewsResponse = await fetch(
        `https://gnews.io/api/v4/top-headlines?category=${activeCategory}&lang=en&country=in&max=20&apikey=553dc14c7832190909f27b1b12fa5252`
      );
      const gnewsData = await gnewsResponse.json();
      const gnewsArticles = gnewsData.articles || [];

      const redditResponse = await fetch(
        `http://localhost:5000/api/reddit?subreddit=${activeCategory}&limit=10`
      );
      const redditData = await redditResponse.json();

      const redditFormatted = Array.isArray(redditData)
        ? redditData.map(post => ({
            title: post.title,
            url: post.url,
            image: post.image || "/placeholder.png",
            publishedAt: post.publishedAt || new Date().toISOString(),
            source: { name: post.source || "Reddit", url: post.url },
          }))
        : [];

      const combined = [...gnewsArticles, ...redditFormatted];
      const shuffled = combined.sort(() => Math.random() - 0.5);

      setArticles(shuffled);
    } catch (error) {
      console.error("Error fetching combined news:", error);
    }
  };

  fetchArticles();
}, [activeCategory]);



  return (
    <div>
      <Header1 />

      <div className="news-page">
        <main className="Mymain">
          <section className="hero">
            <h1>Stay Informed</h1>
            <h1>Stay Ahead</h1>
            <Link to="/Signup">
              <button className="cta-btn">Sign Up</button>
            </Link>
          </section>

          <nav className="category-nav">
            {categories.map((category, index) => (
              <span
                key={index}
                className={activeCategory === category.value ? "active" : ""}
                onClick={() => handleCategoryClick(category.value)}
                style={{ cursor: "pointer" }}
              >
                {category.label}
              </span>
            ))}
          </nav>

          <main className="articles-grid">
            {articles.slice(0, articlesToShow).map((article, index) => (
              <Link to="/Readnews" state={{ article }} key={index} className="article-link">
                <div className="article-card">
                  <div className="card-header">
                    <img
                      className="source-avatar"
                      src={`https://www.google.com/s2/favicons?sz=32&domain_url=${article.source.url}`}
                      alt={article.source.name}
                    />
                    <span className="source-name">{article.source.name}</span>
                  </div>
                  <img
                    className="card-img"
                    src={article.image || "/placeholder.png"}
                    alt="article"
                  />
                  <p className="time">{new Date(article.publishedAt).toLocaleString()}</p>
                  <h3 className="title">{article.title}</h3>
                  <p className="author">
                    {article.source?.name}
                    <span style={{ fontSize: "12px", color: "gray" }}>
                      ({article.fromReddit ? "Reddit" : "GNews"})
                    </span>
                  </p>
                  <div className="card-actions">
                    <span>✔️</span>
                    <span>🔖</span>
                    <span>🔗</span>
                  </div>
                </div>
              </Link>
            ))}
          </main>

          <div className="read-more">
            {articlesToShow < articles.length && (
              <button onClick={handleReadMore}>Read More</button>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
