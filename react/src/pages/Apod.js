import React from 'react';
import { useNasaData } from '../context/DataContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import './Page.css';

const Apod = () => {
  const { apodData, loading, error } = useNasaData();

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!apodData) return <ErrorMessage message="No APOD data available." />;

  return (
    <div className="card">
      <h2 className="card-title">{apodData.title}</h2>
      <p className="card-subtitle">Astronomy Picture of the Day for {new Date(apodData.date).toLocaleDateString()}</p>
      
      {apodData.media_type === 'image' ? (
        <img src={apodData.url} alt={apodData.title} className="card-image" />
      ) : (
        <iframe
          src={apodData.url}
          title={apodData.title}
          className="card-video"
          allow="fullscreen"
        />
      )}
      
      <p className="card-text">{apodData.explanation}</p>
      
      {apodData.copyright && <p className="card-info">Copyright: {apodData.copyright}</p>}
    </div>
  );
};

export default Apod; 