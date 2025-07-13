"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./Aftersignup.css"
import { Bookmark, ChevronDown, Share, Loader } from "lucide-react"
import Header2 from "../components/Header2"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import topicTranslations from "./topicTranslations"

const Aftersignup = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("Latest")
  const [articlesToShow, setArticlesToShow] = useState(3)
  const [newsArticles, setNewsArticles] = useState([])
  const [bookmarkedArticles, setBookmarkedArticles] = useState([])
  const [preferredLang, setPreferredLang] = useState(localStorage.getItem("lang") || "en")
  const [recommendedArticles, setRecommendedArticles] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const location = useLocation()

  const checkIfBookmarked = (article) => {
    return bookmarkedArticles.some((a) => a.url === article.url)
  }

  const getLocalizedTopic = (topic, lang) => {
    const key = topic.toLowerCase()
    return topicTranslations[key]?.[lang] || topic
  }
useEffect(() => {
  const topic = location.state?.topic || "Latest"
  setSelectedTopic(topic)
}, [location.state])

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic.replace(/^#/, ""))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const lang = localStorage.getItem("lang") || "en"
      if (lang !== preferredLang) {
        setPreferredLang(lang)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [preferredLang])

useEffect(() => {
  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const localizedTopic = getLocalizedTopic(selectedTopic, preferredLang);

      const keys = [
        "e199c04b5ba393d25905d7f978036249",
        "8b1e0d3eeb6d7eee73716a9c823dd2d5",
        "b1c263430e35be89aecc1e7c20a9b1e6", // ← 🔁 your third key
      ];

      let data;

      // 🔁 Try search with each key
      for (const key of keys) {
        const res = await fetch(
          `https://gnews.io/api/v4/search?q=${localizedTopic}&lang=${preferredLang}&max=30&apikey=${key}`
        );
        const json = await res.json();
        if (json.articles && json.articles.length > 0) {
          data = json;
          break;
        }
      }

      if (data?.articles?.length > 0) {
        setNewsArticles(data.articles);
      } else {
        console.warn("❌ All search keys failed. Trying top-headlines...");

        // 🔁 Try top-headlines with each key
        let fallbackData = null;
        for (const key of keys) {
          const fallbackRes = await fetch(
            `https://gnews.io/api/v4/top-headlines?lang=${preferredLang}&max=30&apikey=${key}`
          );
          const json = await fallbackRes.json();
          if (json.articles && json.articles.length > 0) {
            fallbackData = json;
            break;
          }
        }

        setNewsArticles(fallbackData?.articles || []);
      }
    } catch (error) {
      console.error("❌ Error fetching news with all keys:", error);
      setNewsArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchNews();
}, [selectedTopic, preferredLang]);



  useEffect(() => {
    const storedData = localStorage.getItem("user")
    if (storedData) {
      const user = JSON.parse(storedData)
      setUserName(user.fullName || "User")
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchUserBookmarks = async () => {
      if (!token) return

      try {
        const res = await axios.get("https://newssphere-wxr1.onrender.com/api/user-preferences", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setBookmarkedArticles(res.data.readLaterNews || [])
      } catch (err) {
        console.error("Error fetching bookmarks:", err)
      }
    }

    fetchUserBookmarks()
  }, [token])

  useEffect(() => {
    const fetchRecommendedArticles = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token || selectedTopic !== "For You") return

        const clickedRes = await fetch("http://localhost:5000/api/get-clicked-articles", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const clicked = await clickedRes.json()
        const clickedUrls = clicked.map((c) => c.url)

        const filteredArticles = newsArticles.filter((article) => !clickedUrls.includes(article.url))

        if (filteredArticles.length === 0) {
          console.warn("🚫 No new articles left to recommend.")
          setRecommendedArticles([]) // Optional: Clear recommendations
          return
        }

        const response = await fetch("http://localhost:5000/api/smart-recommendations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const err = await response.json()
          console.error("❌ Error from server:", err)
          return
        }

        const recommended = await response.json()
        setRecommendedArticles(recommended)
      } catch (error) {
        console.error("❌ Failed to fetch recommendations:", error)
      }
    }

    fetchRecommendedArticles()
  }, [selectedTopic, newsArticles])

  useEffect(() => {
    const savedSize = localStorage.getItem("fontSize") || "Normal"
    document.documentElement.style.setProperty("--user-font-size", savedSize)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem("fontSize") // e.g., "Small", "Normal", "Large"
    let scale = 1
    if (saved === "Small") scale = 0.9
    else if (saved === "Large") scale = 1.2
    document.documentElement.style.setProperty("--font-scale", scale)
  }, [])

  const handleBookmark = async (e, article) => {
    e.stopPropagation() // Keep this to prevent article navigation
    // Remove e.preventDefault() - this was blocking the bookmark functionality

    const payload = {
      source: article.source?.name || article.source || "Unknown",
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image,
      publishedAt: article.publishedAt,
    }

    try {
      const res = await axios.post("https://newssphere-wxr1.onrender.com/api/toggle-bookmark", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBookmarkedArticles(res.data.readLaterNews || [])
    } catch (err) {
      console.error("Bookmark error:", err)
    }
  }

  const handleExpand = (e, index) => {
    e.preventDefault()
    console.log(`Expanded article ${index}`)
  }

  const handleReadMore = () => {
    setArticlesToShow((prev) => prev + 3)
  }

  const openArticle = (e, article) => {
    // Remove e.preventDefault() and e.stopPropagation() - they were blocking navigation
    console.log("Opening article:", article.title) // Debug log
    navigate("/Readarticle", { state: { article } })
  }

  const testClick = (e, article) => {
    console.log("TEST CLICK WORKING:", article.title)
    openArticle(e, article)
  }

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

  const welcomeVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
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

  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <motion.div className="news-container" initial="hidden" animate="visible" variants={containerVariants}>
      <Header2 onTopicSelect={handleTopicSelect} />

      <motion.div className="welcome-message" variants={welcomeVariants}>
        Welcome {userName}!
      </motion.div>

      <motion.div className="for-you-section" variants={sectionVariants}>
        <motion.h1
          className="for-you-title"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {selectedTopic.replace(/^#/, "")}
          <motion.span
            className="for-you-icon"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
          ></motion.span>
        </motion.h1>
        <motion.p
          className="for-you-subtitle"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          The Best of Everything you Follow
        </motion.p>
      </motion.div>

      <motion.div className="news-grid" variants={containerVariants}>
        <AnimatePresence mode="wait">
          {selectedTopic === "For You" ? (
            recommendedArticles.length > 0 ? (
              recommendedArticles.slice(0, articlesToShow).map((article, index) => (
                <motion.div
                  className="news-card"
                  key={`rec-${index}`}
                  onClick={(e) => testClick(e, article)} // ✅ Add click here
                  style={{ cursor: "pointer" }} // ✅ Add pointer here
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                  whileHover="hover"
                  layout>
                  <motion.div
                    onClick={(e) => testClick(e, article)}
                    className="news-source"
                    style={{ cursor: "pointer" }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <motion.img
                      className="source-avatar"
                      src={`https://www.google.com/s2/favicons?sz=32&domain_url=${article.source?.url || article.url}`}
                      alt={article.source?.name || article.source || "Unknown"}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    />
                    <span className="source-name">{article.source?.name || article.source || "Unknown Source"}</span>
                  </motion.div>
                  <motion.div
                    onClick={(e) => testClick(e, article)}
                    className="news-image"
                    style={{ cursor: "pointer" }}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={article.image || "/placeholder.svg"} alt="News thumbnail" />
                  </motion.div>
                  <motion.div
                    onClick={(e) => testClick(e, article)}
                    className="news-time"
                    style={{ cursor: "pointer" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                  >
                    {new Date(article.publishedAt).toLocaleTimeString()} |{" "}
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </motion.div>
                  <motion.h2
                    onClick={(e) => testClick(e, article)}
                    className="news-title"
                    style={{ cursor: "pointer" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                  >
                    {article.title}
                  </motion.h2>
                  <motion.div
                    onClick={(e) => testClick(e, article)}
                    className="news-author"
                    style={{ cursor: "pointer" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                  >
                    <span className="source-name">{article.source?.name || "Unknown"}</span> - By{" "}
                    {article.author || "Unknown"}
                  </motion.div>
                  <motion.p
                    onClick={(e) => testClick(e, article)}
                    className="news-content"
                    style={{ cursor: "pointer" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
                  >
                    {article.description}
                  </motion.p>
                  <motion.div
                    className="news-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.7 }}
                  >
                    <motion.button
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        handleExpand(e, index)
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronDown size={16} />
                    </motion.button>
                    <motion.button
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        handleBookmark(e, article)
                      }}
                      style={{ color: checkIfBookmarked(article) ? "blue" : "black" }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Bookmark fill={checkIfBookmarked(article) ? "blue" : "none"} />
                    </motion.button>
                    <motion.button
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        handleExpand(e, index)
                      }}
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share size={16} />
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))
            ) : (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                No recommendations yet. Please interact with some articles to see personalized results.
              </motion.p>
            )
          ) : (
            newsArticles.slice(0, articlesToShow).map((article, index) => (
              <motion.div
              className="news-card"
              key={`rec-${index}`}
              onClick={(e) => testClick(e, article)} // ✅ Add click here
              style={{ cursor: "pointer" }} // ✅ Add pointer here
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
              whileHover="hover"
              layout>
                <motion.div
                  onClick={(e) => testClick(e, article)}
                  className="news-source"
                  style={{ cursor: "pointer" }}
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
                <motion.div
                  onClick={(e) => testClick(e, article)}
                  className="news-image"
                  style={{ cursor: "pointer" }}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={article.image || "/placeholder.svg"} alt="News thumbnail" />
                </motion.div>
                <motion.div
                  onClick={(e) => testClick(e, article)}
                  className="news-time"
                  style={{ cursor: "pointer" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                >
                  {new Date(article.publishedAt).toLocaleTimeString()} |{" "}
                  {new Date(article.publishedAt).toLocaleDateString()}
                </motion.div>
                <motion.h2
                  onClick={(e) => testClick(e, article)}
                  className="news-title"
                  style={{ cursor: "pointer" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                >
                  {article.title}
                </motion.h2>
                <motion.div
                  onClick={(e) => testClick(e, article)}
                  className="news-author"
                  style={{ cursor: "pointer" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                >
                  <span className="source-name">{article.source.name}</span> - By {article.author || "Unknown"}
                </motion.div>
                <motion.p
                  onClick={(e) => testClick(e, article)}
                  className="news-content"
                  style={{ cursor: "pointer" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
                >
                  {article.description}
                </motion.p>
                <motion.div
                  className="news-actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.7 }}
                >
                  <motion.button
                    className="action-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      handleExpand(e, index)
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronDown size={16} />
                  </motion.button>
                  <motion.button
                    className="action-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      handleBookmark(e, article)
                    }}
                    style={{ color: checkIfBookmarked(article) ? "blue" : "black" }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Bookmark fill={checkIfBookmarked(article) ? "blue" : "none"} />
                  </motion.button>
                  <motion.button
                    className="action-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      handleExpand(e, index)
                    }}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share size={16} />
                  </motion.button>
                </motion.div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="loading-container"
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Loader className="spinner" size={24} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="read-more"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <motion.button onClick={handleReadMore} variants={buttonVariants} whileHover="hover" whileTap="tap">
          Read More
        </motion.button>
      </motion.div>

      <motion.footer
        className="footer"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <motion.div
          className="footer-links"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {["Log In", "About Us", "Help", "Terms", "Privacy Policy"].map((link, index) => (
            <motion.a
              key={index}
              href="#"
              className="footer-link"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              {link}
            </motion.a>
          ))}
        </motion.div>
        <motion.div
          className="copyright"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          @2025 NewsSphere
        </motion.div>
      </motion.footer>
    </motion.div>
  )
}

export default Aftersignup
