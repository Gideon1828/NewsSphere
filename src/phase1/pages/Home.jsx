"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./Home.css"
import { Link,  useNavigate  } from "react-router-dom"
import Header1 from "../components/Header1"
import Footer from "../components/Footer"
import { useParams } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("general")
  const [articles, setArticles] = useState([])
  const [articlesToShow, setArticlesToShow] = useState(6)
  const { query } = useParams(); // from /search/:query
  const categories = [
    { label: "General", value: "general" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Technology", value: "technology" },
    { label: "Travel", value: "travel" },
    { label: "Food", value: "food" },
    { label: "Sports", value: "sports" },
  ]
  // 🔁 Reset active category when on a search page
useEffect(() => {
  if (query) {
    setActiveCategory(null);  // during search, no category is active
  }
}, [query]);


  const categoryToSubreddit = {
    general: "news",
    entertainment: "movies",
    technology: "technology",
    travel: "travel",
    food: "food",
    sports: "sports",
  }

 const handleCategoryClick = (categoryValue) => {
  navigate("/");
  setActiveCategory(categoryValue);
  setArticlesToShow(6); // Reset count
          // 🔁 Clear search route to restore hero
};

  const handleReadMore = () => {
    setArticlesToShow((prev) => prev + 3)
  }

  useEffect(() => {
   /*  const isSearch = Boolean(query);

  // 🟡 Disable category highlight during search
  if (isSearch && activeCategory !== null) {
    setActiveCategory(null);
  } */
  const fetchArticles = async () => {
    let gnewsArticles = [];

    const searchTerm = query || activeCategory;
    const isSearch = Boolean(query);

    const cleanedQuery = searchTerm.trim().replace(/\s+/g, " ");
    const encodedQuery = encodeURIComponent(cleanedQuery);

    try {
      const res1 = await fetch(
        `https://gnews.io/api/v4/${isSearch ? "search" : "top-headlines"}?${isSearch ? `q=${encodedQuery}` : `category=${activeCategory}`}&lang=en&country=in&max=20&apikey=5d808f3800d44aaac70cea0db99f68ad`
      );
      const data1 = await res1.json();

      if (data1.articles?.length > 0) {
        gnewsArticles = data1.articles;
      } else {
        throw new Error("First key returned no articles");
      }
    } catch (err1) {
      console.warn("First key failed, trying second…");
      try {
        const res2 = await fetch(
          `https://gnews.io/api/v4/${isSearch ? "search" : "top-headlines"}?${isSearch ? `q=${encodedQuery}` : `category=${activeCategory}`}&lang=en&country=in&max=20&apikey=553dc14c7832190909f27b1b12fa5252`
        );
        const data2 = await res2.json();
        if (data2.articles?.length > 0) {
          gnewsArticles = data2.articles;
        } else {
          throw new Error("Second key also failed");
        }
      } catch (err2) {
        console.error("Both GNews keys failed:", err2);

        // Try Reddit fallback only when it's NOT a search
        if (!isSearch) {
          try {
            const redditResponse = await fetch(
              `https://newssphere-wxr1.onrender.com/api/reddit?subreddit=${categoryToSubreddit[activeCategory]}&limit=10`
            );
            const redditData = await redditResponse.json();

            if (Array.isArray(redditData)) {
              gnewsArticles = redditData.map((post) => ({
                title: post.title,
                url: post.url,
                image: post.image || "/placeholder.png",
                publishedAt: post.publishedAt || new Date().toISOString(),
                source: { name: post.source || "Reddit", url: post.url },
                fromReddit: true,
              }));
            }
          } catch (redditErr) {
            console.warn("Reddit fetch failed:", redditErr);
          }
        }
      }
    }

    const shuffled = gnewsArticles.sort(() => Math.random() - 0.5);
    setArticles(shuffled);
  };

  fetchArticles();
}, [activeCategory, query]);





  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const categoryVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Header1 />

      <div className="news-page">
        <main className="Mymain">
          <motion.section className="hero" variants={heroVariants}>
            {query ? (
            <motion.h1
            initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}>Search results for: <em>{query}</em></motion.h1>
            ) : (
              <>
            <motion.h1
            initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}>Stay Informed</motion.h1>
              <motion.h1>Stay Ahead</motion.h1>
              <Link to="/Signup">
              <motion.button className="cta-btn" variants={buttonVariants} whileHover="hover" whileTap="tap">
                Sign Up
              </motion.button>
            </Link>
            </>
            )}

            
          </motion.section>

          <motion.nav className="category-nav" variants={categoryVariants}>
            {/* Select for small screens */}
           <div className="custom-select-wrapper">
            <motion.select
              value={activeCategory || ""}
              onChange={(e) => handleCategoryClick(e.target.value)}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="custom-select"
              >
            {categories.map((category, index) => (
              <option key={index} value={category.value}>
              {category.label}
              </option>
              ))}
              </motion.select>
          </div>


            {/* Span buttons for large screens */}
            {categories.map((category, index) => (
              <motion.span
                key={index}
                className={activeCategory === category.value ? "active" : ""}
                onClick={() => handleCategoryClick(category.value)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label}
              </motion.span>
            ))}
          </motion.nav>

          <motion.main className="articles-grid" variants={containerVariants}>
            <AnimatePresence mode="wait">
              {articles.slice(0, articlesToShow).map((article, index) => (
                <motion.div
                  key={`${activeCategory}-${index}`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                  whileHover="hover"
                  layout
                >
                  <Link to="/Readnews" state={{ article }} className="article-link">
                    <div className="article-card">
                      <motion.div
                        className="card-header"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <motion.img
                          className="source-avatar"
                          src={`https://www.google.com/s2/favicons?sz=32&domain_url=${article.source.url}`}
                          alt={article.source.name}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        />
                        <span className="source-name">{article.source.name}</span>
                      </motion.div>
                      <motion.img
                        className="card-img"
                        src={article.image || "/placeholder.png"}
                        alt="article"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                        whileHover={{ scale: 1.05 }}
                      />
                      <motion.p
                        className="time"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                      >
                        {new Date(article.publishedAt).toLocaleString()}
                      </motion.p>
                      <motion.h3
                        className="title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                      >
                        {article.title}
                      </motion.h3>
                      <motion.p
                        className="author"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                      >
                        {article.source?.name}
                        <span style={{ fontSize: "12px", color: "gray" }}>
                          ({article.fromReddit ? "Reddit" : "GNews"})
                        </span>
                      </motion.p>
                      <motion.div
                        className="card-actions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
                      >
                        <motion.span whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }}>
                          ✔️
                        </motion.span>
                        <motion.span whileHover={{ scale: 1.2, rotate: -10 }} whileTap={{ scale: 0.9 }}>
                          🔖
                        </motion.span>
                        <motion.span whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }}>
                          🔗
                        </motion.span>
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.main>

          <motion.div
            className="read-more"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {articlesToShow < articles.length && (
              <motion.button onClick={handleReadMore} variants={buttonVariants} whileHover="hover" whileTap="tap">
                Read More
              </motion.button>
            )}
          </motion.div>
        </main>
      </div>

      <Footer />
    </motion.div>
  )
}

export default Home