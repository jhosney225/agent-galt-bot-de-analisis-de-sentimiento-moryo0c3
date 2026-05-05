```javascript
const Sentiment = require('sentiment');
const fs = require('fs');
const path = require('path');

// Initialize sentiment analyzer
const sentiment = new Sentiment();

// Sample financial news data
const financialNews = [
  {
    id: 1,
    title: "Tech stocks surge amid positive earnings reports",
    content: "Major technology companies reported exceptional earnings today, exceeding analyst expectations. Investors showed strong confidence in the sector.",
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Markets decline as inflation fears persist",
    content: "Stock markets fell sharply today as investors worry about persistent inflation. Economic indicators suggest challenging times ahead for the economy.",
    date: "2024-01-14"
  },
  {
    id: 3,
    title: "Gold prices stabilize following Federal Reserve announcement",
    content: "Precious metals remained relatively stable after the central bank's neutral statement. Traders expressed cautious optimism about future monetary policy.",
    date: "2024-01-13"
  },
  {
    id: 4,
    title: "Oil prices plummet due to oversupply concerns",
    content: "Crude oil experienced a significant drop amid supply glut fears. The energy sector faces headwinds as demand weakens globally.",
    date: "2024-01-12"
  },
  {
    id: 5,
    title: "Cryptocurrency market rebounds with promising developments",
    content: "Digital assets recovered strongly following regulatory clarity. Investors embraced the positive news about blockchain innovation.",
    date: "2024-01-11"
  },
  {
    id: 6,
    title: "Retail sector struggles with disappointing quarterly results",
    content: "Major retailers reported poor sales figures, disappointing Wall Street. Consumer spending has deteriorated significantly this quarter.",
    date: "2024-01-10"
  },
  {
    id: 7,
    title: "Healthcare stocks climb on breakthrough drug approval",
    content: "Pharmaceutical companies celebrated FDA approval of innovative treatments. The healthcare sector shows tremendous promise moving forward.",
    date: "2024-01-09"
  },
  {
    id: 8,
    title: "Real estate market faces uncertainty amid interest rate hikes",
    content: "Housing prices show weakness as borrowing costs increase. Developers express concerns about project viability.",
    date: "2024-01-08"
  }
];

// Financial sentiment keywords for enhanced analysis
const financialKeywords = {
  very_positive: ['surge', 'soar', 'exceptional', 'breakthrough', 'triumph', 'excellent', 'outstanding'],
  positive: ['gain', 'growth', 'strong', 'confidence', 'recovery', 'stable', 'positive'],
  very_negative: ['plummet', 'crash', 'collapse', 'disaster', 'failure', 'severe'],
  negative: ['decline', 'fall', 'weakness', 'concerns', 'deteriorated', 'disappointing']
};

// Analyze sentiment of a single news item
function analyzeNewsSentiment(newsItem) {
  const fullText = `${newsItem.title} ${newsItem.content}`;
  const analysis = sentiment.analyze(fullText);
  
  // Get comparative score for better interpretation
  const words = fullText.toLowerCase().split(/\s+/);
  const comparativeScore = analysis.comparative;
  
  // Determine sentiment category
  let sentimentCategory = 'NEUTRAL';
  let confidence = 'low';
  
  if (comparativeScore > 0.1) {
    sentimentCategory = 'POSITIVE';
    if (comparativeScore > 0.2) confidence = 'high';
    else confidence = 'medium';
  } else if (comparativeScore < -0.1) {
    sentimentCategory = 'NEGATIVE';
    if (comparativeScore < -0.2) confidence = 'high';
    else confidence = 'medium';
  } else {
    sentimentCategory = 'NEUTRAL';
    confidence = 'medium';
  }
  
  // Calculate impact score (0-100)
  const impactScore = Math.round((Math.abs(comparativeScore) * 100));
  
  return {
    newsId: newsItem.id,
    title: newsItem.title,
    date: newsItem.date,
    sentiment: sentimentCategory,
    score: analysis.score,
    comparative: parseFloat(comparativeScore.toFixed(4)),
    confidence: confidence,
    impactScore: Math.min(impactScore, 100),
    positiveWords: analysis.words.filter(w => sentiment.analyze(w).score > 0).length,
    negativeWords: analysis.words.filter(w => sentiment.analyze(w).score < 0).length,
    wordsAnalyzed: analysis.words.length
  };
}

// Analyze all news items
function analyzeAllNews(newsItems) {
  return newsItems.map(newsItem => analyzeNewsSentiment(newsItem));
}

// Generate sentiment report
function generateSentimentReport(analysisResults) {
  const totalNews = analysisResults.length;
  const positiveCount = analysisResults.filter(r => r.sentiment === 'POSITIVE').length;
  const negativeCount = analysisResults.filter(r => r.sentiment === 'NEGATIVE').length;
  const neutralCount = analysisResults.filter(r => r.sentiment === 'NEUTRAL').length;
  
  const avgComparative = (analysisResults.reduce((sum, r) => sum + r.comparative, 0) / totalNews).toFixed(4);
  const avgImpactScore = Math.round(analysisResults.reduce((sum, r) => sum + r.impactScore, 0) / totalNews);
  
  const sentimentTrend = parseFloat(avgComparative) > 0 ? 'BULLISH' : parseFloat(avgComparative) < 0 ? 'BEARISH' : 'NEUTRAL';
  
  return {
    reportDate: new Date().toISOString(),
    totalNewsAnalyzed: totalNews,
    sent