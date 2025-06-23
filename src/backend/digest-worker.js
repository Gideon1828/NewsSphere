// digest-worker.js
const { generateDigest } = require("./utils/digest");
require("dotenv").config();

const cron = require("node-cron");

console.log("🟢 Digest worker started");

// Run at 7:00 AM IST = 1:30 AM UTC → cron time = 30 1 * * *
cron.schedule("30 1 * * *", async () => {
  console.log("⏰ Running daily digest at 7:00 AM IST...");
  await generateDigest();
});

setInterval(() => {
  console.log("💡 Worker is alive");
}, 1000 * 60 * 5); // every 5 minutes
