import axios from 'axios';

// Base URL for all NASA API requests, configured via environment variable
const API_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Fetch data from the given URL with retry logic.
 * Retries the request up to `retries` times if a network error occurs (not for HTTP errors).
 * @param {string} url - The API endpoint to fetch.
 * @param {number} retries - Number of retry attempts (default: 2).
 * @param {number} delay - Delay between retries in ms (default: 500).
 * @returns {Promise<AxiosResponse>} - The Axios response object.
 */
async function fetchWithRetry(url, retries = 2, delay = 500) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await axios.get(url);
    } catch (err) {
      // Only retry on network errors, not HTTP errors (err.response exists for HTTP errors)
      if (err.response || i === retries) {
        throw err;
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

/**
 * Fetch Astronomy Picture of the Day (APOD) data from NASA API.
 * @returns {Promise<AxiosResponse>}
 */
export const fetchApod = () => fetchWithRetry(`${API_URL}/apod`);

/**
 * Fetch EPIC (Earth Polychromatic Imaging Camera) images for a specific date.
 * @param {string} [date] - Optional date string in 'YYYY-MM-DD' format.
 * @returns {Promise<AxiosResponse>}
 */
export const fetchEpic = (date) => {
  const url = new URL(`${API_URL}/epic`);
  if (date) {
    url.searchParams.append('date', date);
  }
  return fetchWithRetry(url.toString());
};

/**
 * Fetch NeoWs (Near Earth Object Web Service) asteroid data from NASA API.
 * @returns {Promise<AxiosResponse>}
 */
export const fetchNeows = () => fetchWithRetry(`${API_URL}/neows`);

/**
 * Generate a poetic copy for the APOD explanation using the backend AI service.
 * @param {string} explanation - The APOD explanation text.
 * @returns {Promise<string>} - The generated poetic copy string.
 * @throws {Error} - If the backend returns an error or no poetic copy.
 */
export async function generatePoeticCopy(explanation) {
  const res = await axios.post(`${API_URL}/apod/poetic-copy`, { explanation });
  if (res.data && res.data.poeticCopy) {
    return res.data.poeticCopy;
  } else {
    throw new Error(res.data?.error || 'failed to generate');
  }
} 