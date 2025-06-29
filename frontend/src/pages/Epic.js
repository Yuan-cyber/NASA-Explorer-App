import React, { useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNasaData } from '../context/DataContext';
import { fetchEpic } from '../api';
import './Page.css';

/** 
 * Epic page component.
 */ 
const Epic = () => {
  // Get initial EPIC data, loading, and error state from context
  const { epicData: initialEpicData, loading: initialLoading, error: initialError } = useNasaData();
  
  // Local state for EPIC images, loading, error, and selected date
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

  // Fetch EPIC images when selectedDate changes
  useEffect(() => {
    const dateStr = selectedDate.toISOString().slice(0, 10);
    console.log('useEffect triggered, selectedDate:', selectedDate, 'dateStr:', dateStr);
    setLoading(true);
    fetchEpic(dateStr)
      .then(res => {
        console.log('fetchEpic result:', res.data);
        setImages(res.data);
      })
      .catch(err => setError("Failed to fetch EPIC images for this date."))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  // Preload all images for animation
  useEffect(() => {
    if (images.length === 0) {
      setPreloaded(true);
      return;
    }
    setPreloaded(false); 
    
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
  }, [images]);

  // Animation interval logic: cycles through images if animating
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

  // Start animation: show player and begin cycling images
  const startAnimation = () => {
    if (!images.length || !preloaded) return;
    setShowPlayer(true);
    setIsAnimating(true);
  };
  
  // Pause or resume animation
  const togglePause = () => {
    setIsAnimating(prev => !prev);
  };

  // Reset animation to initial state
  const resetAnimation = () => {
    setShowPlayer(false);
    setIsAnimating(false);
    setCurrentImageIndex(0);
  };

  return (
    <div className="epic-card">
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

      {loading && <div className="loader" role="status"><div></div></div>}
      {error && <div className="error-message">{error}</div>}
      
      {/* No images info */}
      {!loading && !error && !images.length && 
        <div className="info-message"> 🛰️ No EPIC images were taken on this day. Try another date!</div>
      }

      {/* Image grid and animation controls */}
      {!showPlayer ? (
        <>
          <div className="animation-controls">
            <button 
              onClick={startAnimation} 
              className="main-button"
              disabled={!images.length || loading}
            >
              {preloaded ? 'Animate' : 'Loading Images...'}
            </button>
          </div>
          {/* Show image grid if images are available */}
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
            <button onClick={togglePause} className="main-button">
              {isAnimating ? 'Pause' : 'Resume'}
            </button>
            <button onClick={resetAnimation} className="main-button">
              Reset
            </button>
          </div>
          {/* Animation player: shows current image and caption */}
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