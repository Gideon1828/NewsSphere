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

- ✉️ **AI-Based Daily Digest**  
  Sends users a curated list of top articles around 7 AM daily, powered by AI.

- 👾 **Reddit Content Integration (Backup)**  
  NewsSphere fetches additional content from Reddit — but only if both GNews API keys fail — ensuring GNews remains the primary source.

## 🌍 Live Site

- Frontend: [newsphere.vercel.app](https://newssphere-2025.vercel.app/)  
- Backend API: [newsphere-api.render.com](https://newssphere-wxr1.onrender.com)

## 📁 Project Structure

- ├──public
- ├──src
- │ ├── backend/
- │ │ ├── config/
- │ │ ├── utils/
- │ ├── context/
- │ ├── Phase1(Before login)/
- │ ├── Phase2(After login)/


## 🧠 Tech Stack

- **Frontend:** React, React Router, Lucide Icons  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB + Mongoose  
- **Auth:** JWT (JSON Web Tokens)  
- **API:** [GNews API](https://gnews.io/)  
- **Styling:** Custom CSS (light/dark mode support)  
- **State:** LocalStorage, useState, useEffect  


## ⚙️ How to Run

```bash
npm install
npm run dev
cd src/backend
npm start
```


## 🔮 Future Improvements

- AI-based news summaries
- Offline reading mode
- Firebase push notifications
- Autotranslation of entire UI (i18next)
- User-selected regional filters


## 🙌 Contributing
- Pull Requests are welcome! For major changes, please open an issue first.

## 🙏 Acknowledgements
- GNews API

- Lucide Icons

- React & Express teams

## 📬 Contact
- Made with ❤️ by Gideon A
- LinkedIn: [@gideon](https://www.linkedin.com/in/gideon-a-27b425367)
- Email: gideonroy04@gmail.com

## 📄 License
- MIT © 2025 NewsSphere

---

Let me know if you want this saved as a file or want me to include setup for `.env` or deployment notes too.