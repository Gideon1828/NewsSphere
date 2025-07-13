const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const axios = require("axios");

const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Get top clicked articles across all users in past 7 days
const getTopArticles = async () => {
  const snapshot = await db.collectionGroup("clickHistory").get();

  const articleMap = new Map();

  snapshot.forEach(doc => {
    const data = doc.data();
    const key = data.title + data.url;

    if (!articleMap.has(key)) {
      articleMap.set(key, { ...data, count: 1 });
    } else {
      articleMap.get(key).count++;
    }
  });

  const sorted = [...articleMap.values()].sort((a, b) => b.count - a.count);
  return sorted.slice(0, 5); // Top 5
};

const sendTopPicksEmail = async (to, articles) => {
  const html = `
    <h2>📈 Weekly Top Picks</h2>
    <ul>
      ${articles.map(a => `<li><strong>${a.title}</strong><br><a href="${a.url}">${a.url}</a></li>`).join("")}
    </ul>
  `;

  await transporter.sendMail({
    from: `"NewsSphere" <${process.env.EMAIL}>`,
    to,
    subject: "🌟 This Week's Top News Picks",
    html,
  });
};

const generateTopPicksDigest = async () => {
  try {
    const topArticles = await getTopArticles();
    const users = await db.collection("users").where("isNotificationOn", "==", true).get();

    for (const doc of users.docs) {
      const user = doc.data();
      if (user.email) {
        await sendTopPicksEmail(user.email, topArticles);
        console.log(`✅ Top Picks sent to ${user.email}`);
      }
    }
  } catch (err) {
    console.error("❌ Error sending Top Picks:", err.message);
  }
};

module.exports = { generateTopPicksDigest };
