// utils/tfidf.js
const natural = require("natural");

function extractKeywords(text, topN = 10) {
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(text);

  const terms = tfidf.listTerms(0); // only one doc
  const keywords = terms.slice(0, topN).map(term => term.term);

  return keywords;
}

module.exports = { extractKeywords };
