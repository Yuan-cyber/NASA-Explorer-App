const axios = require('axios');
// It's good practice to keep the API key safe and not expose it
const NASA_API_KEY = (process.env.NASA_API_KEY || 'DEMO_KEY').trim();

exports.getEpic = async (req, res) => {
  try {
    // Get the specific date from the request query, if it exists
    const { date: queryDate } = req.query;

    // Construct the NASA API URL based on whether a date is provided
    const baseUrl = 'https://api.nasa.gov/EPIC/api/natural';
    const apiUrl = queryDate
      ? `${baseUrl}/date/${queryDate}?api_key=${NASA_API_KEY}`
      : `${baseUrl}/images?api_key=${NASA_API_KEY}`;

    console.log(apiUrl);
    const { data } = await axios.get(apiUrl);

    // If NASA API returns no data, send an empty array to the front-end
    if (!data || data.length === 0) {
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

    res.json(images);
  } catch (err) {
    // It's helpful to log the actual error on the server for debugging
    console.error('Error in getEpic controller:', err.message);
    res.status(500).json({ error: 'Failed to fetch EPIC data from NASA' });
  }
};