import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

async function fetchWithRetry(url, retries = 2, delay = 500) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await axios.get(url);
    } catch (err) {
      if (err.response || i === retries) {
        throw err;
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

export const fetchApod = () => fetchWithRetry(`${API_URL}/apod`);

export const fetchEpic = (date) => {
  const url = new URL(`${API_URL}/epic`);
  if (date) {
    url.searchParams.append('date', date);
  }
  return fetchWithRetry(url.toString());
};

export const fetchNeows = () => fetchWithRetry(`${API_URL}/neows`); 