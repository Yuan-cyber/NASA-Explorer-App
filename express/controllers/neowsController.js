const axios = require('axios');
const NASA_API_KEY = (process.env.NASA_API_KEY || 'DEMO_KEY').trim();
const NASA_BASE_URL = 'https://api.nasa.gov';

exports.getNeowsOverview = async (req, res) => {
  try {
    const { start_date, end_date, hazardous, min_diameter, max_diameter } = req.query;
    const today = new Date();
    const end = req.query.end_date || today.toISOString().slice(0, 10);
    const start = req.query.start_date || new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const url = `${NASA_BASE_URL}/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${NASA_API_KEY}`;
    console.log('Requesting URL:', url);
    const { data } = await axios.get(url);
    const result = Object.entries(data.near_earth_objects).map(([date, asteroids]) => {
      let filtered = asteroids;
      if (hazardous) {
        filtered = filtered.filter(a => a.is_potentially_hazardous_asteroid === (hazardous === 'true' || hazardous === 'hazardous'));
      }
      if (min_diameter) {
        filtered = filtered.filter(a => a.estimated_diameter.kilometers.estimated_diameter_max >= parseFloat(min_diameter));
      }
      if (max_diameter) {
        filtered = filtered.filter(a => a.estimated_diameter.kilometers.estimated_diameter_min <= parseFloat(max_diameter));
      }
      const hazardousCount = filtered.filter(a => a.is_potentially_hazardous_asteroid).length;
      const minDia = filtered.length ? Math.min(...filtered.map(a => a.estimated_diameter.kilometers.estimated_diameter_min)) : 0;
      const maxDia = filtered.length ? Math.max(...filtered.map(a => a.estimated_diameter.kilometers.estimated_diameter_max)) : 0;
      return {
        date,
        total: filtered.length,
        hazardous: hazardousCount,
        min_diameter: minDia,
        max_diameter: maxDia,
        asteroids: filtered
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
    res.json(result);
  } catch (err) {
    console.error('NeoWs API Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch NeoWs data', message: err.message });
  }
};

exports.getAsteroidDetail = async (req, res) => {
  try {
    const url = `${NASA_BASE_URL}/neo/rest/v1/neo/${req.params.id}?api_key=${NASA_API_KEY}`;
    const { data } = await axios.get(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch asteroid detail', message: err.message });
  }
}; 