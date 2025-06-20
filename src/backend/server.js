const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();
dotenv.config();
const API= process.env.GNEWS_API_KEY
const PORT = process.env.PORT || 5000;

const nodemailer = require("nodemailer");
const otpStore = new Map();

const serviceAccount = require("../config/firebaseServiceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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



app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));