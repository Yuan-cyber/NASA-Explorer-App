const axios = require('axios');
const NASA_API_KEY = (process.env.NASA_API_KEY || 'DEMO_KEY').trim();
const NASA_BASE_URL = 'https://api.nasa.gov';

// 简单内存缓存
const cache = { data: null, expires: 0 };
const CACHE_TTL = 3600; // 1小时

exports.getApod = async (req, res) => {
  try {
    const now = Date.now();
    if (!req.query.date && cache.data && cache.expires > now) {
      return res.json(cache.data);
    }
    let url = `${NASA_BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}`;
    if (req.query.date) url += `&date=${req.query.date}`;
    if (req.query.start_date && req.query.end_date) url += `&start_date=${req.query.start_date}&end_date=${req.query.end_date}`;
    if (req.query.count) url += `&count=${req.query.count}`;
    const { data } = await axios.get(url);
    if (!req.query.date) {
      cache.data = data;
      cache.expires = now + CACHE_TTL * 1000;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch APOD data',
      message: err.response?.data?.error?.message || err.message
    });
  }
}; 