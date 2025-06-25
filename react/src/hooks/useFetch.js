import { useState, useEffect } from 'react';
import axios from 'axios';
export default function useFetch(url, params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(url, { params })
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, [url, JSON.stringify(params)]);
  return { data, loading, error };
} 