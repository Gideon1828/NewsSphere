// utils/cosineSimilarity.js

function cosineSimilarity(vec1, vec2) {
  const allKeys = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
  let dotProduct = 0, normA = 0, normB = 0;

  for (const key of allKeys) {
    const val1 = vec1[key] || 0;
    const val2 = vec2[key] || 0;

    dotProduct += val1 * val2;
    normA += val1 * val1;
    normB += val2 * val2;
  }

  if (normA === 0 || normB === 0) return 0; // No similarity
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = { cosineSimilarity };
