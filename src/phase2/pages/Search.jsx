"use client";

import { useState, useRef, useEffect } from "react";
import "./Search.css";

const Search = ({ onClose, onSelectTopic }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const topics = [
    "#SCIENCE", "#TECHNOLOGY", "#BUSSINESS", "#TRAVEL", "#POLITICS",
    "#FOOD", "#PERSONEL FINANCE", "#CLIMATE CHANGE", "#HEALTH", "#SPORTS",
    "#ENTERTAINMENT", "#LIFESTYLE", "#HOME GARDEN", "#SELF IMPROVEMENT", "#DIY",
    "#COMPUTER SCIENCE", "#BLACK HISTORY", "#WORLD ECONOMY", "#CELEBRITY NEWS", "#BOOKS",
    "#MUSIC", "#STYLE", "#DESIGN", "#RUSSIA-UKRAINE", "#BREAKTHROUGHS",
    "#Psychology", "#ENTREPRENEUERSHIP", "#CONSERVATIVE VIEW",
  ];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleTopicClick = (topic) => {
    setSelectedTopics([topic]); // Only one topic selected at a time

if (onSelectTopic) {
  onSelectTopic(topic); // Notify parent
}

if (onClose) {
  onClose(); // Close the search immediately
}
  };

  const handleCancel = () => onClose?.();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
    console.log("Selected topics:", selectedTopics);
  };

  return (
    <div className="search-dropdown-container" ref={containerRef}>
      <form onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="What's your Passion?"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="topics-container">
          <h2 className="featured-heading">Featured</h2>
          <div className="topics-list">
            {topics.map((topic, index) => (
              <button
                key={index}
                type="button"
                className={`topic-item ${selectedTopics.includes(topic) ? "selected" : ""}`}
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default Search;
