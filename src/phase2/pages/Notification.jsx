"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Bookmark, Bell, User } from "lucide-react"
import "./Notification.css"

const Notification = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const modalRef = useRef(null)

  // Close notification modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Only close if the click wasn't on the bell icon
        if (!event.target.closest(".notification-bell")) {
          setIsNotificationOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Toggle notification modal
  const toggleNotificationModal = () => {
    setIsNotificationOpen(!isNotificationOpen)
  }

  // Handle notification preference
  const handleNotificationPreference = (enabled) => {
    setNotificationsEnabled(enabled)
    setIsNotificationOpen(false)

    // In a real application, you would save this preference to the user's account
    console.log(`Notifications ${enabled ? "enabled" : "disabled"} for NewsSphere`)

    // Show a toast or some feedback to the user
    const message = enabled ? "Notifications enabled" : "Notifications disabled"
    alert(message) // In a real app, use a toast component instead
  }

  return (
    <div className="notification-container">
      {/* Header with navigation */}
      <header className="header">
        <div className="search-container">
          <Search className="search-icon" size={24} strokeWidth={2} />
          <span className="search-text">SEARCH</span>
        </div>

        <div className="nav-actions">
          <button className="nav-button">
            <Bookmark size={24} strokeWidth={2} />
          </button>

          <button
            className={`nav-button notification-bell ${!notificationsEnabled ? "disabled" : ""}`}
            onClick={toggleNotificationModal}
          >
            <Bell size={24} strokeWidth={2} fill="#FF7043" color="#FF7043" />
          </button>

          <button className="nav-button profile">
            <User size={24} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Notification Modal */}
      {isNotificationOpen && (
        <div className="notification-overlay">
          <div className="notification-modal" ref={modalRef}>
            <h2 className="notification-title">NOTIFICATIONS</h2>

            <p className="notification-message">
              you want To turn <span className="highlight">Notification</span> {notificationsEnabled ? "OFF" : "ON"} For
              NewsSphere?
            </p>

            <div className="notification-actions">
              <button
                className="action-button yes-button"
                onClick={() => handleNotificationPreference(!notificationsEnabled)}
              >
                Yes
              </button>

              <button className="action-button no-button" onClick={() => setIsNotificationOpen(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notification
