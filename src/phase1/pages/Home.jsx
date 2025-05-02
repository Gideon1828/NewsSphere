import React, { useState } from "react"; // 1. Add useState
import "./Home.css";
import { Link } from 'react-router-dom';
import Header from "../components/Header"
import Footer from "../components/Footer";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("News"); // 2. For active category
  const [articlesToShow, setArticlesToShow] = useState(9); // 3. For read more

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleReadMore = () => {
    setArticlesToShow((prev) => prev + 9);
  };

  const categories = ["News", "Entertainment", "Technology", "Travel", "Food", "Sports"];

  const articles = new Array(articlesToShow).fill({
    source: "CNBC",
    time: "7 hours ago",
    title:
      "Pope Francis on Breathing machine after suffering sudden respiratory episode",
    author: "By matthew hawkins",
    image: "/news-image.jpg",
  });

  return (
    <div>
      {/* 1. Header component */}  
      <Header />

      {/* 2. Main content */}
<div className="news-page">
      <main className="Mymain">

      <section className="hero">
        <h1>Stay Informed</h1>
        <h1>Stay Ahead</h1>
        <Link to="/Signup"><button className="cta-btn">Sign Up</button></Link>
      </section>

      <nav className="category-nav">
        {categories.map((category, index) => (
          <span
            key={index}
            className={activeCategory === category ? "active" : ""}
            onClick={() => handleCategoryClick(category)}
            style={{ cursor: "pointer" }}
          >
            {category}
          </span>
        ))}
      </nav>

      <main className="articles-grid">
        {articles.map((article, index) => (
          <Link to="/Readnews" key={index} className="article-link">
            <div className="article-card">
              <div className="card-header">
                <img className="source-avatar" src="/avatar.png" alt={article.source} />
                <span className="source-name">{article.source}</span>
              </div>
              <img className="card-img" src={article.image} alt="article visual" />
              <p className="time">{article.time}</p>
              <h3 className="title">{article.title}</h3>
              <p className="author">CNBC - {article.author}</p>
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
        <button onClick={handleReadMore}>Read More</button>
      </div>
      </main>

      {/* 3. Footer component */} 
      <Footer/>
    </div>
    </div> 
  );
}
export default Home;