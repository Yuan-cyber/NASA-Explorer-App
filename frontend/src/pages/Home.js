import React from 'react';
import { Link } from 'react-router-dom';
import { useNasaData } from '../context/DataContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import './Home.css';
import { getLatestNeowsData } from '../utils/neowsUtils';

/**
 * Home page component.
 * Displays a dashboard overview of APOD, EPIC, and NeoWs data.
 * Users can click on each section to navigate to the corresponding detail page.
 */
const Home = () => {
  const { apodData, neowsData, epicData, loading, error } = useNasaData();

  const latestNeows = getLatestNeowsData(neowsData);

  const latestEpicImage = epicData && epicData.length > 0 ? epicData[epicData.length - 1] : null;

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="home-container">
      {/* Left column: APOD section */}
      <div className="home-column-left">
        <h2 className="home-block-title">📷 ASTRONOMY PICTURE OF THE DAY <span style={{color:'#888'}}>- APOD</span></h2>
        {/* Clickable block navigates to APOD page */}
        <Link to="/apod" className="home-block apod-block">
          {apodData && apodData.media_type === 'image' && (
            <img src={apodData.url} alt={apodData.title} className="home-block-image" />
          )}
          {apodData && apodData.media_type === 'video' && (
            <div className="video-placeholder">Video content, click to view</div>
          )}
        </Link>
      </div>
      {/* Right column: EPIC and NeoWs sections */}
      <div className="home-column-right">
        <h2 className="home-block-title">🌍 latest earth photo <span style={{color:'#888'}}>- EPIC</span></h2>
        {/* Clickable block navigates to EPIC page */}
        <Link to="/epic" className="home-block epic-block">
          {latestEpicImage && <img src={latestEpicImage.url} alt="Latest Earth Photo" className="home-block-image"/>}
        </Link>
        <h2 className="home-block-title">☄️ Asteroids today <span style={{color:'#888'}}>- NeoWs</span></h2>
        {/* Clickable block navigates to NeoWs page */}
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