"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./Search.css"

const Search = ({ onClose, onSelectTopic }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTopics, setSelectedTopics] = useState([])
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const topics = [
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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }

    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose?.()
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [onClose])

  const handleSearchChange = (e) => setSearchQuery(e.target.value)

  const handleTopicClick = (topic) => {
    setSelectedTopics([topic]) // Only one topic selected at a time

    if (onSelectTopic) {
      onSelectTopic(topic) // Notify parent
    }

    if (onClose) {
      onClose() // Close the search immediately
    }
  }

  const handleCancel = () => onClose?.()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Search query:", searchQuery)
    console.log("Selected topics:", selectedTopics)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  }

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  const headingVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  const topicVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
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
    <AnimatePresence>
      <motion.div
        className="search-dropdown-container"
        ref={containerRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <form onSubmit={handleSubmit}>
          <motion.div className="search-input-wrapper" variants={inputVariants}>
            <motion.input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="What's your Passion?"
              value={searchQuery}
              onChange={handleSearchChange}
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <div className="topics-container">
            <motion.h2 className="featured-heading" variants={headingVariants}>
              Featured
            </motion.h2>
            <motion.div
              className="topics-list"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.03,
                  },
                },
              }}
            >
              {topics.map((topic, index) => (
                <motion.button
                  key={index}
                  type="button"
                  className={`topic-item ${selectedTopics.includes(topic) ? "selected" : ""}`}
                  onClick={() => handleTopicClick(topic)}
                  variants={topicVariants}
                  whileHover="hover"
                  whileTap="tap"
                  custom={index}
                >
                  {topic}
                </motion.button>
              ))}
            </motion.div>
          </div>

          <motion.button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            Cancel
          </motion.button>
        </form>
      </motion.div>
    </AnimatePresence>
  )
}

export default Search
