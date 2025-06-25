import React, { useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNasaData } from '../context/DataContext';
import { fetchEpic } from '../api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import './Page.css';

const Epic = () => {
  const { epicData: initialEpicData, loading: initialLoading, error: initialError } = useNasaData();
  
  const [images, setImages] = useState(initialEpicData || []);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // State for the animation logic
  const [showPlayer, setShowPlayer] = useState(false); // Controls if the player is visible
  const [isAnimating, setIsAnimating] = useState(false); // Controls if the animation is running
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [preloaded, setPreloaded] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setImages(initialEpicData || []);
    setLoading(initialLoading);
    setError(initialError);
  }, [initialEpicData, initialLoading, initialError]);

  useEffect(() => {
    if (images.length > 0 && selectedDate.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)) {
      return;
    }
    
    const dateStr = selectedDate.toISOString().slice(0, 10);
    setLoading(true);
    fetchEpic(dateStr)
      .then(res => {
        setImages(res.data);
      })
      .catch(err => setError("Failed to fetch EPIC images for this date."))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  useEffect(() => {
    if (images.length > 0) {
      let loadedCount = 0;
      images.forEach(imgData => {
        const img = new Image();
        img.src = imgData.url;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            setPreloaded(true);
          }
        };
      });
    }
  }, [images]);

  useEffect(() => {
    if (isAnimating && showPlayer) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 200);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAnimating, showPlayer, images.length]);

  const startAnimation = () => {
    if (!images.length || !preloaded) return;
    setShowPlayer(true);
    setIsAnimating(true);
  };
  
  const togglePause = () => {
    setIsAnimating(prev => !prev);
  };

  const resetAnimation = () => {
    setShowPlayer(false);
    setIsAnimating(false);
    setCurrentImageIndex(0);
  };

  return (
    <div className="card epic-card">
      <h2 className="card-title">Earth Polychromatic Imaging Camera</h2>
      <div className="date-picker-container">
        <label htmlFor="epic-datepicker">Select a date:</label>
        <DatePicker
          id="epic-datepicker"
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="yyyy/MM/dd"
          className="epic-datepicker"
          maxDate={new Date()} // Users cannot select future dates
        />
      </div>

      {loading && <div className="loader"><div></div></div>}
      {error && <div className="error-message">{error}</div>}
      
      {!loading && !error && !images.length && 
        <div className="info-message">No images available for this date.</div>
      }

      {!showPlayer ? (
        <>
          <div className="animation-controls">
            <button 
              onClick={startAnimation} 
              className="epic-button"
              disabled={!images.length || loading}
            >
              {preloaded ? 'Animate' : 'Loading Images...'}
            </button>
          </div>
          {!showPlayer && images.length > 0 && (
            <div className="image-grid">
              {images.map(img => (
                <div key={img.identifier} className="grid-item">
                  <img src={img.url} alt={img.caption} className="grid-image" />
                  <div className="grid-info">
                    <p>{img.caption}</p>
                    <p><b>Date:</b> {new Date(img.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="animation-controls">
            <button onClick={togglePause} className="epic-button">
              {isAnimating ? 'Pause' : 'Resume'}
            </button>
            <button onClick={resetAnimation} className="epic-button">
              Reset
            </button>
          </div>
          <div className="animation-player">
            <img src={images[currentImageIndex].url} alt={images[currentImageIndex].caption} />
            <p>{images[currentImageIndex].caption}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Epic; 