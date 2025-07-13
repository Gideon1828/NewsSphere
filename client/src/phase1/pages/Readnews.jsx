import './Readnews.css';
import Header1 from '../components/Header1.jsx';
import Footer from '../components/Footer.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Readnews = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;

  const [relatedArticles, setRelatedArticles] = useState([]);
  const [storyboardArticles, setStoryboardArticles] = useState([]);

  const API_KEY = "7ff96f128765d291d0276d3769d1827d"; // 🔁 Replace with your real key
  const BASE_URL = "https://gnews.io/api/v4/search";

  // If no article is passed, redirect back
  if (!article) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        const keyword = article.title?.split(" ").slice(0, 3).join(" "); // Pick first 3 words for relevance
        const response = await axios.get(`${BASE_URL}?q=${keyword}&lang=en&max=10&apikey=${API_KEY}`);
        const articles = response.data.articles;

        setRelatedArticles(articles.slice(0, 6)); // Related Articles
        setStoryboardArticles(articles.slice(6, 9)); // Storyboard (3 articles)
      } catch (error) {
        console.error("Error fetching related news:", error);
      }
    };

    fetchRelatedArticles();
  }, [article]);

  return (
    <div>
      {/* Header */}
      <Header1 />

      {/* Main */}
      <main className="Mymain">
        <div className="main-feature">
          <div className="highlight">
            <img src={article.image} alt="headline" className="headline-img" />
            <div className="headline-content">
              <h2>{article.title}</h2>
              <p>{article.description || "No description available."}</p>
              <p className="meta">
                {article.source.name} - {new Date(article.publishedAt).toLocaleString()}<br />
                <Link to="/Login" className="login-read">Login To Read more</Link>
              </p>
            </div>
          </div>

          <div className="storyboard">
            <h3>Related Storyboard</h3>
            {storyboardArticles.map((story, i) => (
              <Link
                to="/Readnews"
                state={{ article: story }}
                className="article-link"
                key={i}
              >
                <div className="story-snippet">
                  <img src={story.image} alt="story" />
                  <div>
                    <p><b>{story.title}</b></p>
                    <span>{story.source.name} - {story.publishedAt.slice(0, 10)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="related-articles-section">
          <h3>Related articles</h3>
          <div className="related-grid">
            {relatedArticles.map((related, i) => (
              <Link
                to="/Readnews"
                state={{ article: related }}
                className="article-link"
                key={i}
              >
                <div className="related-card">
                  <img src={related.image} alt="related" />
                  <div>
                    <p><b>{related.title}</b></p>
                    <span>{related.source.name} - {related.publishedAt.slice(0, 10)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Readnews;
