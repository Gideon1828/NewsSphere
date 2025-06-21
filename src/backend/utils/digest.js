// utils/digest.js
const axios = require("axios");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
// ✅ Initialize Firebase if not already
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_KEY)
  : require(path.join(__dirname, "../config/firebaseServiceKey.json")); // used only for local dev

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

}

const db = admin.firestore();

const fetchTopStories = async (lang = "en") => {
  const res = await axios.get(
    `https://gnews.io/api/v4/top-headlines?lang=${lang}&country=in&max=10&apikey=${process.env.GNEWS_API_KEY}`
  );
  return res.data.articles.slice(0, 5);
};

const getMissedArticles = (allArticles, userBookmarks) => {
  const bookmarked = new Set((userBookmarks || []).map(a => a.url));
  return allArticles.filter(a => !bookmarked.has(a.url)).slice(0, 3);
};

const summarizeArticle = async (title, content) => {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "user",
          content: `Summarize in one line:\n\nTitle: ${title}\n\nContent: ${content}`
        }
      ]
    },
    {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "NewsSphere AI Digest"
      }
    }
  );
  return res.data.choices[0].message.content.trim();
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendDigestEmail = async (to, html) => {
  await transporter.sendMail({
    from: `"NewsSphere" <${process.env.EMAIL}>`,
    to,
    subject: "📰 Your Daily News Digest",
    html,
  });
};

const generateDigest = async () => {
  try {
    const userSnapshot = await db.collection("users").get();

    for (const doc of userSnapshot.docs) {
      try {
        const user = doc.data();

        // ✅ Only send if user enabled notifications
        if (!user.isNotificationOn || !user.email) continue;

        const lang = user.languagePreference || "en";
        const bookmarks = user.readLaterNews || [];

        const topArticles = await fetchTopStories(lang);

        const summarized = await Promise.all(
          topArticles.map(async article => ({
            title: article.title,
            summary: await summarizeArticle(article.title, article.description || "")
          }))
        );

        const missed = getMissedArticles(topArticles, bookmarks);

        const html = `
          <h2>🗞️ Daily Digest</h2>
          <h3>Top Stories</h3>
          <ul>${summarized.map(a => `<li><strong>${a.title}</strong>: ${a.summary}</li>`).join("")}</ul>
          <h3>🕓 In Case You Missed It</h3>
          <ul>${missed.map(m => `<li><a href="${m.url}">${m.title}</a></li>`).join("")}</ul>
        `;

        await sendDigestEmail(user.email, html);
        console.log(`✅ Digest sent to ${user.email}`);
      } catch (userErr) {
        console.error(`❌ Error sending to ${doc.id}:`, userErr.message);
      }
    }
  } catch (err) {
    console.error("❌ Digest process failed:", err.message);
  }
};

module.exports = { generateDigest };
