import React from 'react';
import { Link } from 'react-router-dom';
import { useNasaData } from '../context/DataContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import './Home.css';

const Home = () => {
  const { apodData, neowsData, epicData, loading, error } = useNasaData();

  // New logic to find the most recent asteroid data
  const getLatestNeowsData = () => {
    if (!neowsData || neowsData.length === 0) {
      return { count: 0, date: 'N/A' };
    }
    // Sort by date descending and pick the first one
    const latestData = [...neowsData].sort((a, b) => b.date.localeCompare(a.date))[0];
    return {
      count: latestData.total,
      date: latestData.date
    };
  };

  const latestNeows = getLatestNeowsData();
  const latestEpicImage = epicData && epicData.length > 0 ? epicData[epicData.length - 1] : null;

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="home-container">
      <div className="home-column-left">
        <h2 className="home-block-title">ASTRONOMY PICTURE OF THE DAY</h2>
        <Link to="/apod" className="home-block apod-block">
          {apodData && apodData.media_type === 'image' && (
            <img src={apodData.url} alt={apodData.title} className="home-block-image" />
          )}
          {apodData && apodData.media_type === 'video' && (
            <div className="video-placeholder">Video content, click to view</div>
          )}
        </Link>
      </div>
      <div className="home-column-right">
        <h2 className="home-block-title">latest earth photo</h2>
        <Link to="/epic" className="home-block epic-block">
          {latestEpicImage && <img src={latestEpicImage.url} alt="Latest Earth Photo" className="home-block-image"/>}
        </Link>
        <h2 className="home-block-title">Asteroids today</h2>
        <Link to="/neows" className="home-block neows-block">
          <div className="neows-info">
            <span className="neows-count">{latestNeows.count}</span>
            <span className="neows-date">on {latestNeows.date}</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home; 