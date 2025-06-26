const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { extractKeywords } = require("./utils/tfidf");
/* const { buildInterestProfile } = require("./utils/buildInterestProfile"); */
const { cosineSimilarity } = require("./utils/cosineSimilarity");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cron = require("node-cron");
const { generateDigest } = require("./utils/digest");
const { generateTopPicksDigest } = require("./utils/topPicks");
const axios = require("axios");
const admin = require("./config/firebase"); // Adjust path if needed


const app = express();
dotenv.config();
const API= process.env.GNEWS_API_KEY
const PORT = process.env.PORT || 5000;

const nodemailer = require("nodemailer");
const otpStore = new Map();



const db = admin.firestore();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to handle JSON requests
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Expect header like "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    req.user = user; // Attach decoded user info to request
    next();
  });
};

// Default Route
app.get("/", (req, res) => {
  res.send("Firebase is running!");
});

// Registration Route
app.post("/api/signup", async (req, res) => {
  try {
    const { email, fullName, password } = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    // Check if user already exists
    const userSnapshot = await db.collection("users").where("email", "==", email).get();

    if (!userSnapshot.empty) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add new user
    const newUserRef = await db.collection("users").add({
      email,
      fullName,
      password: hashedPassword,
      createdAt: new Date(),

      selectedCategory: null,
      isNotificationOn: false,
      readLaterNews: [],
    });

    // ✅ Generate JWT token like in login
    const token = jwt.sign(
      {
        userId: newUserRef.id,
        email,
        fullName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: newUserRef.id,
        email,
        fullName,
      },
    });
  } catch (error) {
    console.error("Register Error:", error.code, error.message, error.details);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
});


// Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    // Find user by email
    const userSnapshot = await db.collection("users").where("email", "==", email).get();

    if (userSnapshot.empty) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: userDoc.id,
        email: userData.email,
        fullName: userData.fullName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Return token with user info (avoid sending password)
    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: userDoc.id,
        email: userData.email,
        fullName: userData.fullName,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

// Save selected categories for a user
// … above imports, admin setup, auth middleware…

// Save selected categories
app.post("/api/save-categories", authenticateToken, async (req, res) => {
  try {
    const { selectedCategory } = req.body;
    const userId = req.user.userId;

    if (!Array.isArray(selectedCategory) || selectedCategory.length < 3) {
      return res.status(400).json({ message: "Please select at least 3 categories." });
    }

    const userRef = db.collection("users").doc(userId);
    await userRef.update({ selectedCategory });

    return res.status(200).json({ message: "Categories saved successfully." });
  } catch (err) {
    console.error("Save Categories Error:", err);
    return res.status(500).json({ message: "Server error." });
  }
});

// Get user preferences (selectedCategory, isNotificationOn)
app.get('/api/user-preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const data = userDoc.data();
    return res.status(200).json({
      selectedCategory: data.selectedCategory || [],
      isNotificationOn: data.isNotificationOn || false,
      readLaterNews: data.readLaterNews || [] ,
      
    });
  } catch (err) {
    console.error('Get Preferences Error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Save notification preference
app.post('/api/save-notification', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { isNotificationOn } = req.body;

    await db.collection('users').doc(userId).update({ isNotificationOn });

    return res.status(200).json({ message: 'Notification preference updated.' });
  } catch (err) {
    console.error('Save Notification Error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});


// Toggle bookmark (add or remove)
app.post('/api/toggle-bookmark', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { source, title, description, url, image, publishedAt } = req.body;

    if (!title || !url || !publishedAt) {
      return res.status(400).json({ message: "Missing required article fields." });
    }

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found." });
    }

    const userData = userDoc.data();
    let updatedBookmarks = userData.readLaterNews || [];

    // Check if already bookmarked by URL
    const alreadyBookmarked = updatedBookmarks.some(article => article.url === url);

    if (alreadyBookmarked) {
      // Remove the article
      updatedBookmarks = updatedBookmarks.filter(article => article.url !== url);
    } else {
      // Add the article
      updatedBookmarks.push({ source, title, description, url, image, publishedAt });
    }

    await userRef.update({ readLaterNews: updatedBookmarks });

    return res.status(200).json({ message: "Bookmark updated.", readLaterNews: updatedBookmarks });

  } catch (err) {
    console.error("Bookmark toggle error:", err);
    return res.status(500).json({ message: "Server error." });
  }
});

app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

  otpStore.set(email, { otp, expiresAt });

  // Configure your email service (Gmail here)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // app password (not your login password)
    },
  });

  const mailOptions = {
    from: `"NewsSphere" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for NewsSphere Signup",
    text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("OTP Send Error:", error);
    res.status(500).json({ message: "Failed to send OTP." });
  }
});

app.post("/api/verify-otp", async (req, res) => {
  const { email, fullName, password, otp } = req.body;
  if (!email || !fullName || !password || !otp) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const record = otpStore.get(email);
  if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  try {
    const userSnapshot = await db.collection("users").where("email", "==", email).get();
    if (!userSnapshot.empty) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserRef = await db.collection("users").add({
      email,
      fullName,
      password: hashedPassword,
      createdAt: new Date(),
      selectedCategory: null,
      isNotificationOn: false,
      readLaterNews: [],
    });

    const token = jwt.sign(
      { userId: newUserRef.id, email, fullName },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Cleanup used OTP
    otpStore.delete(email);

    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: newUserRef.id,
        email,
        fullName,
      },
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Reset password with OTP (forgot password flow)
app.post("/api/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, and new password are required." });
  }

  const record = otpStore.get(email);
  if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  try {
    const userSnapshot = await db.collection("users").where("email", "==", email).get();
    if (userSnapshot.empty) {
      return res.status(404).json({ message: "User not found." });
    }

    const userDoc = userSnapshot.docs[0];
    const userRef = db.collection("users").doc(userDoc.id);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRef.update({ password: hashedPassword });

    otpStore.delete(email); // Cleanup OTP

    res.status(200).json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error while resetting password." });
  }
});

// Manual route to trigger digest email
app.get("/api/send-digest", async (req, res) => {
  try {
    await generateDigest();
    res.send("✅ Digest sent successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error generating digest.");
  }
});

app.get("/api/send-top-picks", async (req, res) => {
  try {
    await generateTopPicksDigest();
    res.send("✅ Weekly top picks sent.");
  } catch (err) {
    res.status(500).send("❌ Error sending weekly digest.");
  }
});


app.get("/api/reddit", async (req, res) => {
  const { subreddit = "news", limit = 10 } = req.query;

  try {
    const response = await axios.get(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`, {
      headers: { "User-Agent": "NewsSphereBot/1.0" },
    });

    const children = response.data?.data?.children;

    if (!Array.isArray(children) || children.length === 0) {
      return res.status(404).json({ message: `No posts found for subreddit r/${subreddit}` });
    }

    const posts = children.map(post => {
      const data = post.data;

      return {
        title: data.title,
        url: `https://reddit.com${data.permalink}`,
        author: data.author || "Unknown",
        publishedAt: new Date(data.created_utc * 1000).toISOString(),
        source: `r/${subreddit}`,
        image:
          data.preview?.images?.[0]?.source?.url.replace(/&amp;/g, "&") ||
          (data.thumbnail?.startsWith("http") ? data.thumbnail : null) ||
          null,
        description: data.selftext || "No description available.",
      };
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Reddit fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch from Reddit", error: err.message });
  }
});




// ✅ Route: Track article click/read
app.post("/api/track-click", authenticateToken, async (req, res) => {
  try {
    const { title, description, content } = req.body;
    const userId = req.user.userId;

    if (!title || !description) {
      return res.status(400).json({ message: "Missing article content." });
    }

    const fullText = `${title} ${description} ${content || ""}`;
    const keywords = extractKeywords(fullText);

    await db.collection("users").doc(userId).collection("clickHistory").add({
      title,
      description,
      content,
      keywords,
      timestamp: new Date(),
    });

    await rebuildInterestProfile(userId); // Automatically update interest profile

    res.status(200).json({ message: "Click tracked and keywords extracted.", keywords });
  } catch (err) {
    console.error("Track click error:", err);
    return res.status(500).json({ message: "Server error." });
  }
});

// ✅ Rebuild interest profile (weighted keyword vector)
const rebuildInterestProfile = async (userId) => {
  const now = new Date();
  const threeDaysAgo = new Date(now.setDate(now.getDate() - 3));

  const snapshot = await db.collection("users")
    .doc(userId)
    .collection("clickHistory")
    .get();

  const recentClicks = [];
  const batch = db.batch();

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const docRef = doc.ref;

    // If older than 3 days, mark for deletion
    if (data.timestamp && data.timestamp.toDate() < threeDaysAgo) {
      batch.delete(docRef);
    } else {
      recentClicks.push(data);
    }
  });

  if (!snapshot.empty) {
    await batch.commit(); // Delete old clicks
  }

  const interestVector = await buildInterestProfile(recentClicks);
  await db.collection("users").doc(userId).update({
    interestProfile: interestVector,
    lastUpdated: new Date(),
  });
};


const buildInterestProfile = async (clicks) => {
  const keywordCount = {};
  for (const click of clicks) {
    const keywords = click.keywords || [];
    for (const keyword of keywords) {
      keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
    }
  }
  return keywordCount;
};

// Modify rebuildInterestProfile
// ✅ This is correct
const cleanupOldClicks = async () => {
  const snapshot = await db.collection("users").doc(userId).collection("clickHistory").get();

  const now = Date.now();
  const threeDaysAgo = now - (3 * 24 * 60 * 60 * 1000);

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.timestamp && data.timestamp.toDate().getTime() < threeDaysAgo) {
      await doc.ref.delete();
    }
  }
};

// ✅ Call it like this inside another async function or route



// ✅ Recommend articles based on weighted profile
app.post("/api/recommend-articles", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { articles } = req.body;

    if (!Array.isArray(articles) || articles.length === 0) {
      return res.status(400).json({ message: "Articles required." });
    }

    const userDoc = await db.collection("users").doc(userId).get();
    const userVector = userDoc.data().interestProfile;

    if (!userVector || Object.keys(userVector).length === 0) {
      return res.status(400).json({ message: "No interest profile found." });
    }

    const scoredArticles = articles.map(article => {
      const fullText = `${article.title} ${article.description} ${article.content || ""}`;
      const keywords = extractKeywords(fullText, 10);

      let score = 0;
      for (const keyword of keywords) {
        if (userVector[keyword]) {
          score += userVector[keyword];
        }
      }

      return { ...article, score };
    });

    const sorted = scoredArticles.sort((a, b) => b.score - a.score);
    const topMatches = sorted.filter(a => a.score > 0).slice(0, 10);
    res.status(200).json(topMatches);
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

const topicCache = new Map();

const getNewsForTopic = async (topic, apiKey, profileScore) => {
  const cacheKey = topic.toLowerCase();
  const cached = topicCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
    return cached.data.map(article => ({
      ...article,
      source: article.source.name,
      score: profileScore,
    }));
  }

  const res = await axios.get(
    `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&lang=en&max=10&apikey=${apiKey}`
  );

  const articles = res.data.articles.map(article => ({
    ...article,
    source: article.source.name,
    score: profileScore,
  }));

  topicCache.set(cacheKey, { data: articles, timestamp: Date.now() });
  return articles;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const fetchWithRetry = async (fn, retries = 3, delayMs = 1500) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await delay(delayMs);
    }
  }
};


app.get("/api/smart-recommendations", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userDoc = await db.collection("users").doc(userId).get();
    const profile = userDoc.data().interestProfile || {};

    const topTopics = Object.entries(profile)
      .filter(([key]) => isNaN(key) && key.length > 2) // ❌ Filter bad topics
      .sort((a, b) => b[1] - a[1])
      .map(([topic]) => topic)
      .slice(0, 5); // Top 5 valid interests

    const results = [];
    const keys = [process.env.GNEWS_API_KEY1, process.env.GNEWS_API_KEY2];
    const API_KEY = keys[Math.floor(Math.random() * keys.length)];

    for (const topic of topTopics) {
      try {
        const articles = await fetchWithRetry(() => getNewsForTopic(topic, API_KEY, profile[topic]));
        results.push(...articles);
        await delay(1500); // ⏱ Add delay between requests to avoid rate-limiting
      } catch (err) {
        console.error(`❌ GNews fetch failed for topic "${topic}":`, err.response?.data || err.message);
      }
    }

    if (results.length === 0) {
      return res.status(200).json([]); // Return empty safely
    }

    const sorted = results.sort((a, b) => b.score - a.score);
    res.status(200).json(sorted.slice(0, 10));
  } catch (err) {
    console.error("❌ /smart-recommendations server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



app.post("/api/rebuild-interest-profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    await rebuildInterestProfile(userId);
    await cleanupOldClicks(userId);
    return res.status(200).json({ message: "Profile rebuilt successfully." });
  } catch (err) {
    console.error("Profile rebuild error:", err);
    return res.status(500).json({ message: "Failed to rebuild profile." });
  }
});

// ✅ Get clicked articles to filter duplicates on frontend
app.get("/api/get-clicked-articles", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const snapshot = await db.collection("users").doc(userId).collection("clickHistory").get();
    const clicked = snapshot.docs.map(doc => doc.data());
    res.status(200).json(clicked);
  } catch (err) {
    console.error("Error fetching clicked articles:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));