const axios = require('axios');
const { NASA_BASE_URL, NASA_API_KEY } = require('../config');

// Simple in-memory cache for APOD data
const cache = { data: null, expires: 0 };
const CACHE_TTL = 3600; // 1 hour

const { GoogleGenAI } = require("@google/genai") ;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Fetch Astronomy Picture of the Day (APOD) from NASA API.
 * Supports optional query params: date, start_date, end_date, count.
 * Uses in-memory cache for requests without a specific date.
 */
exports.getApod = async (req, res) => {
  try {
    const now = Date.now();
    // Serve from cache if no date param and cache is valid
    if (!req.query.date && cache.data && cache.expires > now) {
      return res.json(cache.data);
    }
    // Build NASA API URL based on query params
    let url = `${NASA_BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}`;
    if (req.query.date) url += `&date=${req.query.date}`;
    if (req.query.start_date && req.query.end_date) url += `&start_date=${req.query.start_date}&end_date=${req.query.end_date}`;
    if (req.query.count) url += `&count=${req.query.count}`;
    // Fetch data from NASA
    const { data } = await axios.get(url);
    // Cache only if no specific date is requested
    if (!req.query.date) {
      cache.data = data;
      cache.expires = now + CACHE_TTL * 1000;
    }
    res.json(data);
  } catch (err) {
    // Return error with details for debugging
    res.status(500).json({
      error: 'Failed to fetch APOD data',
      message: err.response?.data?.error?.message || err.message
    });
  }
};

/**
 * Generate a poetic social media copy using Gemini AI based on the APOD explanation.
 * - Input: { explanation } in request body (string, required)
 * - Output: { poeticCopy } in response (string)
 * - Retries up to 3 times on transient errors
 * - Returns 400 if explanation is missing, 500 on AI or network errors
 */
exports.generatePoeticCopy = async (req, res) => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;
  try {
    const { explanation } = req.body;
    if (!explanation) {
      return res.status(400).json({ error: 'Missing explanation in request body' });
    }
    const prompt = `Please read the following NASA astronomy image explanation and generate a single, beautiful poetry for social media sharing. 

The poem should:
- Be imaginative and emotional.
- Be concise (10 lines maximum).
- Return only the poem itself, without extra descriptions.

NASA explanation:${explanation}`;
    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt 
        });
        const poeticCopy = result.candidates[0].content.parts[0].text.trim();
        return res.json({ poeticCopy });
      } catch (err) {
        lastError = err;
        console.error(`call GEMINI AI error ${attempt}:`, err.response?.data || err.message || err);
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }
    throw lastError;
  } catch (err) {
    res.status(500).json({
      error: 'Failed to generate poetic copy',
      message: err.response?.data?.error?.message || err.message
    });
  }
}; 