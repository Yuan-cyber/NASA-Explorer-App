import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApod, fetchNeows, fetchEpic } from '../api';

const NasaDataContext = createContext(null);

export const useNasaData = () => useContext(NasaDataContext);

export const NasaDataProvider = ({ children }) => {
  const [apodData, setApodData] = useState(null);
  const [neowsData, setNeowsData] = useState(null);
  const [epicData, setEpicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [apodRes, neowsRes, epicRes] = await Promise.all([
          fetchApod(),
          fetchNeows(),
          fetchEpic()
        ]);

        setApodData(apodRes.data);
        setNeowsData(neowsRes.data);
        setEpicData(epicRes.data);

      } catch (err) {
        console.error("Failed to fetch data for the context:", err);
        setError("One or more NASA APIs failed to respond. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Empty dependency array means this runs only once on mount

  const value = {
    apodData,
    neowsData,
    epicData,
    loading,
    error
  };

  return (
    <NasaDataContext.Provider value={value}>
      {children}
    </NasaDataContext.Provider>
  );
}; 