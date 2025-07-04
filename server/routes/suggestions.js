

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RSI, MACD, BollingerBands } from 'technicalindicators';
import Suggestion from '../models/Suggestion.js';
import auth from '../middleware/auth.js';
import { getGoldNews } from '../services/newsService.js';
import { getRealTimeData } from '../services/priceService.js';

const router = express.Router();

// Initialize Gemini AI

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY );
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Get latest suggestion
router.get('/latest', auth, async (req, res) => {
  try {
    const suggestion = await Suggestion.findOne({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(1);

    res.json(suggestion);
  } catch (error) {
    console.error('Error fetching latest suggestion:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all suggestions for user
router.get('/', auth, async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate new suggestion
router.post('/refresh', auth, async (req, res) => {
  try {
    let finalSuggestion;
    try {
      finalSuggestion = await generateEnhancedAISuggestion();
    } catch (error) {
      console.error('Error generating AI suggestion, falling back to mock data:', error.message);
      finalSuggestion = generateMockSuggestion();
    }

    const suggestion = new Suggestion({
      ...finalSuggestion,
      userId: req.user.userId,
    });

    await suggestion.save();
    res.status(201).json(suggestion);
  } catch (error) {
    console.error('Error generating suggestion:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate mock suggestion for demo
function generateMockSuggestion() {
  const currentPrice = 2330 + Math.random() * 20;
  const isLong = Math.random() > 0.5;

  const entryPrice = currentPrice + (Math.random() - 0.5) * 5;
  const targetPrice = isLong ? entryPrice + (15 + Math.random() * 20) : entryPrice - (15 + Math.random() * 20);
  const stopLoss = isLong ? entryPrice - (8 + Math.random() * 10) : entryPrice + (8 + Math.random() * 10);

  return {
    entryPrice: parseFloat(entryPrice.toFixed(2)),
    targetPrice: parseFloat(targetPrice.toFixed(2)),
    stopLoss: parseFloat(stopLoss.toFixed(2)),
    reason: 'This is a mock suggestion used for demonstration purposes when the AI is not available. It uses randomized data and does not reflect real market analysis.',
    confidence: Math.floor(70 + Math.random() * 25),
    riskReward: parseFloat((Math.abs(targetPrice - entryPrice) / Math.abs(entryPrice - stopLoss)).toFixed(1)),
    analysis: {
      indicator: 'Mock Data',
      signal: 'N/A',
      reasoning: 'No real-time analysis was performed.',
      sentiment: 'Neutral',
    },
  };
}

// Analyzes the sentiment of a news headline
async function analyzeSentiment(headline) {
  const prompt = `What is the sentiment of this headline for the price of gold (XAU/USD)? Respond with only one word: POSITIVE, NEGATIVE, or NEUTRAL.

Headline: "${headline}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim().toUpperCase();
  } catch (error) {
    console.error('Error analyzing sentiment:', error.message);
    return 'NEUTRAL';
  }
}

// Generate an enhanced AI suggestion using Gemini and technical indicators
async function generateEnhancedAISuggestion() {
  // --- 1. Fetch News and Analyze Sentiment ---
  const headlines = await getGoldNews();
  let sentimentSummary = 'Neutral';
  const sentimentScores = { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0 };
  let analyzedHeadlines = [];

  if (headlines.length > 0) {
    const sentimentPromises = headlines.map(async (headline) => {
      const sentiment = await analyzeSentiment(headline);
      sentimentScores[sentiment] = (sentimentScores[sentiment] || 0) + 1;
      return { headline, sentiment };
    });
    analyzedHeadlines = await Promise.all(sentimentPromises);

    if (sentimentScores.POSITIVE > sentimentScores.NEGATIVE) sentimentSummary = 'Positive';
    if (sentimentScores.NEGATIVE > sentimentScores.POSITIVE) sentimentSummary = 'Negative';
  }

  // --- 2. Technical Analysis Calculation ---
  let close;
  try {
    close = await getRealTimeData();
    console.log('Price data from getRealTimeData:', close);
  } catch (error) {
    console.error('Error fetching price data:', error.message);
    throw new Error('Failed to fetch price data.');
  }

  if (!close || close.length < 34 || !close.every(price => !isNaN(price) && price > 0)) {
    throw new Error(`Invalid price data: ${close ? close.length : 0} prices received.`);
  }

  const currentPrice = close[close.length - 1];
  console.log('Current price:', currentPrice);

  let rsi, macd, bb;
  try {
    rsi = RSI.calculate({ values: close, period: 14 }).slice(-1)[0];
    macd = MACD.calculate({
      values: close,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    }).slice(-1)[0];
    bb = BollingerBands.calculate({ period: 20, values: close, stdDev: 2 }).slice(-1)[0];

    if (!rsi || !macd || !bb || isNaN(rsi) || isNaN(macd.MACD) || isNaN(bb.upper)) {
      throw new Error('Invalid technical indicator values.');
    }
    console.log('Technical indicators:', { rsi, macd, bb });
  } catch (error) {
    console.error('Error calculating technical indicators:', error.message);
    throw new Error('Failed to calculate technical indicators.');
  }

  // --- 3. Construct the AI Prompt ---
  const prompt = `
    You are a world-class financial analyst for a high-performance trading firm, specializing in XAU/USD (Gold).
    Your analysis must be sharp, concise, and actionable.

    **Current Market Data:**
    - Current Price: ${currentPrice.toFixed(2)} USD
    - **Market Sentiment:** ${sentimentSummary}
      ${analyzedHeadlines.map(h => `- (${h.sentiment}) ${h.headline}`).join('\n      ')}
    - **Technical Indicators (Daily chart):**
      - RSI(14): ${rsi.toFixed(2)}
      - MACD(12,26,9): MACD Line: ${macd.MACD.toFixed(2)}, Signal Line: ${macd.signal.toFixed(2)}, Histogram: ${macd.histogram.toFixed(2)}
      - Bollinger Bands(20,2): Upper: ${bb.upper.toFixed(2)}, Middle: ${bb.middle.toFixed(2)}, Lower: ${bb.lower.toFixed(2)}

    **Your Task:**
    Based *only* on the data provided, generate a trading suggestion.
    1. **Decision:** State your primary trading decision (BUY, SELL, or HOLD).
    2. **Confidence:** Provide a confidence score (0-100).
    3. **Strategy:** Define a precise entry price, a primary take-profit target, and a stop-loss.
    4. **Analysis:** Write a brief, professional analysis explaining your reasoning. Reference the specific indicator and sentiment data that justify your decision.

    **Output Format:**
    Return your response as a single, clean JSON object. Do not include any markdown formatting, code blocks, or additional text outside the JSON object.
    {
      "decision": "BUY",
      "confidence": 85,
      "entryPrice": 1234.56,
      "targetPrice": 1245.67,
      "stopLoss": 1230.00,
      "analysis": "The RSI at 32.5 suggests the asset is approaching oversold territory, while positive news sentiment provides a bullish catalyst. The price is also testing the lower Bollinger Band, indicating a potential reversal. The MACD histogram shows weakening bearish momentum, supporting a long position."
    }
  `;

  // --- 4. API Call and Response Parsing ---
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Debug: Log the raw response
    console.log('Raw Gemini API response:', text);

    // Clean markdown and code blocks
    text = text.replace(/```json\n|\n```/g, '').trim();

    // Validate and parse JSON
    let aiResponse;
    try {
      aiResponse = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse cleaned AI response:', text, parseError.message);
      throw new Error('Invalid AI response format after cleaning');
    }

    // Validate required fields
    if (!aiResponse.decision || !aiResponse.confidence || !aiResponse.entryPrice || !aiResponse.targetPrice || !aiResponse.stopLoss || !aiResponse.analysis) {
      console.error('Incomplete AI response:', aiResponse);
      throw new Error('AI response missing required fields');
    }

    return {
      entryPrice: aiResponse.entryPrice,
      targetPrice: aiResponse.targetPrice,
      stopLoss: aiResponse.stopLoss,
      reason: aiResponse.analysis,
      confidence: aiResponse.confidence,
      riskReward: parseFloat((Math.abs(aiResponse.targetPrice - aiResponse.entryPrice) / Math.abs(aiResponse.entryPrice - aiResponse.stopLoss)).toFixed(1)),
      analysis: {
        indicator: 'RSI, MACD, Bollinger Bands',
        signal: aiResponse.decision,
        reasoning: `RSI: ${rsi.toFixed(2)}, MACD Hist: ${macd.histogram.toFixed(2)}, BB: (${bb.lower.toFixed(2)}-${bb.upper.toFixed(2)})`,
        sentiment: sentimentSummary,
        news: analyzedHeadlines,
      },
    };
  } catch (error) {
    console.error('Error in Gemini API call or response parsing:', error.message);
    throw new Error('Invalid AI response format');
  }
}

export default router;