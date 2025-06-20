
# 🗞️ NewsSphere

**NewsSphere** is a personalized, multi-language news aggregation platform that delivers the latest articles based on user preferences, topics, and language. Built with React, Express, MongoDB, and GNews API, it allows users to sign up, explore news, bookmark articles, and change their preferred language in real time.

## 🌐 Features

- 🌍 **Multi-language Support**  
  Users can view articles in multiple languages (e.g., English, Spanish, French) using `lang` preferences stored in `localStorage`.

- 🔎 **Topic-Based Filtering**  
  Trending topics like *Business*, *Travel*, *Health*, etc., are dynamically translated based on selected language.

- 🧠 **AI-powered Suggestions (Coming Soon)**  
  Uses AI to suggest articles or summarize content intelligently.

- 📌 **Bookmark/Read Later**  
  Authenticated users can bookmark articles for later reading.

- 🔐 **JWT-based Authentication**  
  Secure signup/login system with token-based access control.

- 📱 **Responsive Design**  
  Optimized for all devices with responsive UI.

- 🔔 **Notifications (Planned)**  
  Push notifications based on topic or breaking news (via Firebase Cloud Messaging).

## 🌍 Live Site

-Not deployed Currently-Frontend: [newsphere.vercel.app](https://newsphere.vercel.app)  
-Not deployed Currently-Backend API: [newsphere-api.render.com](https://newsphere-api.render.com)


## 📁 Project Structure

- client/
├── src/
│ ├── components/
│ ├── pages/
│ │ ├── Aftersignup.jsx
│ ├── utils/
│ │ └── topicTranslations.js
│ ├── App.js
│ └── index.js

- server/
├── models/
├── routes/
├── controllers/
├── server.js


## 🧠 Tech Stack

- **Frontend:** React, React Router, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (JSON Web Tokens)
- **API:** [GNews API](https://gnews.io/)
- **Styling:** Custom CSS (light/dark mode support)
- **State:** LocalStorage, useState, useEffect

## ⚙️ How to Run

### 🚀 Frontend

```bash
cd client
npm install
npm start

### 🚀 Backend

```bash
cd server
npm install
node server.js

 Future Improvements
AI-based news summaries

Offline reading mode

Firebase push notifications

Autotranslation of entire UI (i18next)

User-selected regional filters

## 🙌 Contributing
PRs are welcome! For major changes, open an issue first.

## 🙏 Acknowledgements

- [GNews API](https://gnews.io/)
- [Lucide Icons](https://lucide.dev/)
- React & Express teams

## 📬 Contact

Made with ❤️ by [Gideon A](https://portfolio2025-gideon.vercel.app/)  
LinkedIn: [@gideon](https://linkedin.com/in/gideona)  
Email: gideonroy04@gmail.com


## 📄 License
MIT © 2025 NewsSphere

---
