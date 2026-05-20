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
  // Individual error states for each API
  const [apodError, setApodError] = useState(null);
  const [neowsError, setNeowsError] = useState(null);
  const [epicError, setEpicError] = useState(null);
  // Incrementing this triggers a re-fetch of all data
  const [retryCount, setRetryCount] = useState(0);

  const refetch = () => setRetryCount(c => c + 1);

  // Fetch all NASA data in parallel when the provider mounts (or refetch is called)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Reset individual errors
        setApodError(null);
        setNeowsError(null);
        setEpicError(null);

        // Fetch APOD, NeoWs, and EPIC data concurrently using allSettled
        // This allows partial failures - successful APIs will still return data
        const results = await Promise.allSettled([
          fetchApod(),
          fetchNeows(),
          fetchEpic()
        ]);

        const [apodResult, neowsResult, epicResult] = results;

        // Handle APOD result
        if (apodResult.status === 'fulfilled') {
          setApodData(apodResult.value.data);
          setApodError(null);
        } else {
          console.error('APOD fetch failed:', apodResult.reason);
          setApodError("We can’t load today’s APOD right now. NASA’s APOD service may be temporarily unavailable—please try again in a bit.");
          setApodData(null);
        }

        // Handle NeoWs result
        if (neowsResult.status === 'fulfilled') {
          setNeowsData(neowsResult.value.data);
          setNeowsError(null);
        } else {
          console.error('NeoWs fetch failed:', neowsResult.reason);
          setNeowsError("We can’t load asteroid data right now. NASA’s NeoWs service may be temporarily unavailable—please try again later.");
          setNeowsData(null);
        }

        // Handle EPIC result
        if (epicResult.status === 'fulfilled') {
          setEpicData(epicResult.value.data);
          setEpicError(null);
        } else {
          console.error('EPIC fetch failed:', epicResult.reason);
          setEpicError('EPIC Earth images are temporarily unavailable due to NASA service issues. Please try again later.');
          setEpicData([]);
        }

      } catch (err) {
        // This catch handles unexpected errors (like network failures before API calls)
        console.error("Failed to fetch data for the context:", err);
        setError("Failed to connect to NASA services. Please check your network and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [retryCount]);

  // The value provided to all consumers of this context
  const value = {
    apodData,
    neowsData,
    epicData,
    loading,
    error,
    apodError,
    neowsError,
    epicError,
    refetch,
  };

  return (
    <NasaDataContext.Provider value={value}>
      {children}
    </NasaDataContext.Provider>
  );
}; 