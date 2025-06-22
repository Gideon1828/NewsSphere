// utils/buildInterestProfile.js

async function buildInterestProfile(clicks) {
  const keywordFreq = {};

  clicks.forEach(doc => {
    const keywords = doc.keywords || [];
    keywords.forEach(keyword => {
      keywordFreq[keyword] = (keywordFreq[keyword] || 0) + 1;
    });
  });

  // Normalize scores (optional)
  const total = Object.values(keywordFreq).reduce((sum, val) => sum + val, 0);
  const normalized = {};
  for (const keyword in keywordFreq) {
    normalized[keyword] = keywordFreq[keyword] / total;
  }

  return normalized; // final interest vector
}

module.exports = { buildInterestProfile };
