import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApod, fetchNeows, fetchEpic } from '../api';

// Create a React context for sharing NASA data across the app
const NasaDataContext = createContext(null);

/**
 * Custom hook to access NASA data context.
 * @returns {object} - The context value containing all NASA data and loading/error states.
 */
export const useNasaData = () => useContext(NasaDataContext);

/**
 * Provider component that fetches NASA data and supplies it to the app via context.
 * Fetches APOD, NeoWs, and EPIC data in parallel on mount.
 * Handles loading and error states for all data.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The child components that will have access to the context.
 * @returns {JSX.Element}
 */
export const NasaDataProvider = ({ children }) => {
  // State for each NASA API
  const [apodData, setApodData] = useState(null);
  const [neowsData, setNeowsData] = useState(null);
  const [epicData, setEpicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all NASA data in parallel when the provider mounts
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch APOD, NeoWs, and EPIC data concurrently
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

  // The value provided to all consumers of this context
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