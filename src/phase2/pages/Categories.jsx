"use client"

import { useState } from "react"
import "./Categories.css"
import Header2 from "../components/Header2"
import { useNavigate } from "react-router-dom"

function Categories() {
  const [showModal, setShowModal] = useState(true)
  const [selectedTopics, setSelectedTopics] = useState([])
  const [showFoodDropdown, setShowFoodDropdown] = useState(false)
  const navigate = useNavigate()

  const handleTopicSelection = (topics) => {
    setSelectedTopics(topics)
    setShowModal(false)
  }

  // Welcome Modal Component
  const WelcomeModal = () => {
    const [localSelectedTopics, setLocalSelectedTopics] = useState(selectedTopics || [])

    const topics = [
      "#NEWS",
      "#SCIENCE",
      "#TECHNOLOGY",
      "#BUSSINESS",
      "#TRAVEL",
      "#POLITICS",
      "#FOOD",
      "#PERSONEL FINANCE",
      "#CLIMATE CHANGE",
      "#HEALTH",
      "#SPORTS",
      "#ENTERTAINMENT",
      "#LIFESTYLE",
      "#HOME GARDEN",
      "#SELF IMPROVEMENT",
      "#DIY",
      "#COMPUTER SCIENCE",
      "#BLACK HISTORY",
      "#WORLD ECONOMY",
      "#CELEBRITY NEWS",
      "#BOOKS",
      "#MUSIC",
      "#STYLE",
      "#DESIGN",
      "#RUSSIA-UKRAINE",
      "#BREAKTHROUGHS",
      "#Psychology",
      "#ENTREPRENEUERSHIP",
      "#CONSERVATIVE VIEW",
    ]

    const toggleTopic = (topic) => {
      if (localSelectedTopics.includes(topic)) {
        setLocalSelectedTopics(localSelectedTopics.filter((t) => t !== topic))
      } else {
        setLocalSelectedTopics([...localSelectedTopics, topic])
      }
    }

    const handleContinue = async () => {
      if (localSelectedTopics.length >= 3) {
        handleTopicSelection(localSelectedTopics)

        try {
          const token = localStorage.getItem("token")
          const response = await fetch("https://newssphere-wxr1.onrender.com/api/save-categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ selectedCategory: localSelectedTopics }),
          })

          const data = await response.json()
          if (response.ok) {
            console.log("Categories saved:", data.message)
            navigate("/Aftersignup")
          } else {
            console.error("Failed to save categories:", data.message)
          }
        } catch (error) {
          console.error("Error saving categories:", error)
        }
      }
    }

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-body">
            <h2 className="modal-title">
              Welcome To <span className="orange-text">NewsSphere</span>
            </h2>
            <p className="modal-description">
              Follow what interests you to personalise news. Follow Atleast 3 Topics before Continuing
            </p>

            <div className="topics-container">
              {topics.map((topic, index) => (
                <button
                  key={topic}
                  className={`topic-button ${localSelectedTopics.includes(topic) ? "selected" : ""}`}
                  onClick={() => toggleTopic(topic)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {topic}
                </button>
              ))}
            </div>
            <div className="selected-count">{localSelectedTopics.length}/3 topics selected</div>
            <button
              className={`continue-button ${localSelectedTopics.length >= 3 ? "active" : "disabled"}`}
              onClick={handleContinue}
              disabled={localSelectedTopics.length < 3}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  // News Card Component
  const NewsCard = ({ index = 0 }) => {
    return (
      <div className="news-card" style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="news-card-content">
          <div className="news-source">
            <div className="source-avatar">
              <img src="https://via.placeholder.com/24" alt="CNBC" />
            </div>
            <span className="source-name">CNBC</span>
          </div>

          <div className="news-image">
            <img src="https://via.placeholder.com/400x200" alt="News image" />
            <div className="image-overlay"></div>
          </div>

          <div className="news-time">7 hours ago</div>

          <h3 className="news-title">Pope Francis on Breathing machine afer suffering sudden respiratory episode</h3>

          <div className="news-author">
            <span>CNBC - By mathiew hawkins</span>
          </div>

          <p className="news-excerpt">
            United arab emirates- feb 26,2025 : a cultural exchange delegation from china, organized by the state
            council information office, we know that Echange is Important for most of the Countries so far is kudo to
            the team So this is the first phase of the Project said Me
          </p>

          <div className="news-actions">
            <button className="action-button" title="Mark as read">
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="action-button" title="Save for later">
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="action-button" title="Share">
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.59 13.51L15.42 17.49"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.41 6.51L8.59 10.49"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header2 />

      {showModal && <WelcomeModal />}

      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">For You</h1>
            <div className="page-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7H21" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 12H21" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <h2 className="page-subtitle">The Best of EveryThing</h2>

          <div className="news-grid">
            <NewsCard index={0} />
            <NewsCard index={1} />
            <NewsCard index={2} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Categories
