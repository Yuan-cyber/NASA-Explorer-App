const axios = require('axios');
const { NASA_BASE_URL, NASA_API_KEY } = require('../config');

// Add cache for EPIC API
const epicCache = { data: {}, expires: {} };
const CACHE_TTL = 3600; // 1 hour

/**
 * Fetch Earth Polychromatic Imaging Camera (EPIC) from NASA API.
 */
exports.getEpic = async (req, res) => {
  try {
    const now = Date.now();
    const cacheKey = req.query.date || 'latest';
    if (
      epicCache.data[cacheKey] &&
      epicCache.expires[cacheKey] > now
    ) {
      return res.json(epicCache.data[cacheKey]);
    }
    // Get the specific date from the request query, if it exists
    const { date: queryDate } = req.query;

    const baseUrl = `${NASA_BASE_URL}/EPIC/api/natural`;

    const apiUrl = queryDate
      ? `${ baseUrl}/date/${queryDate}?api_key=${NASA_API_KEY}`
      : `${ baseUrl}/images?api_key=${NASA_API_KEY}`;

    console.log(apiUrl);
    const { data } = await axios.get(apiUrl);

    // If NASA API returns no data, send an empty array to the front-end
    if (!data || data.length === 0) {
      epicCache.data[cacheKey] = [];
      epicCache.expires[cacheKey] = now + CACHE_TTL * 1000;
      return res.json([]);
    }
    
    // Map the data to the format needed by the front-end
    const images = data.map(img => {
      const date = img.date.split(' ')[0].replace(/-/g, '/');
      return {
        identifier: img.identifier,
        caption: img.caption,
        date: img.date,
        // Using PNG for better image quality, as is standard for EPIC archive
        url: `https://epic.gsfc.nasa.gov/archive/natural/${date}/png/${img.image}.png`
      };
    });

    // Set cache
    epicCache.data[cacheKey] = images;
    epicCache.expires[cacheKey] = now + CACHE_TTL * 1000;

    res.json(images);
  } catch (err) {
    
    console.error('Error in getEpic controller:', err.message);
    res.status(500).json({ error: 'Failed to fetch EPIC data from NASA' });
  }
};

exports.epicCache = epicCache;