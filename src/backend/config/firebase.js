const admin = require("firebase-admin");

if (!admin.apps.length) {
  // Load from environment variable if deployed, else from file
  const serviceAccount = process.env.FIREBASE_SERVICE_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_KEY)
    : require("./firebaseServiceKey.json"); // fallback for local dev

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
