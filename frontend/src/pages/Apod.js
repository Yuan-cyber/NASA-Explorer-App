import React, { useState } from 'react';
import { useNasaData } from '../context/DataContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import './Page.css';
import { generatePoeticCopy } from '../api';

/**
 * APOD page component.
 * Displays NASA's daily space image or video, explanation, and allows generating poetic copy via AI.
 */
const Apod = () => {
  // Get APOD data and loading/error state from context
  const { apodData, loading, error } = useNasaData();
  // State for AI-generated poetic copy
  const [poeticCopy, setPoeticCopy] = useState('');
  const [copyLoading, setCopyLoading] = useState(false);
  const [copyError, setCopyError] = useState('');

  /**
   * Handle click to generate poetic copy using backend AI service
   */
  const handleGeneratePoeticCopy = async () => {
    setCopyLoading(true);
    setCopyError('');
    setPoeticCopy('');
    try {
      const poeticCopy = await generatePoeticCopy(apodData.explanation);
      setPoeticCopy(poeticCopy);
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setCopyError('Whoops—our AI is a bit overloaded-Try it again!');
      } else {
        setCopyError(err.message);
      }
    } finally {
      setCopyLoading(false);
    }
  };

  // Show loader or error if needed
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!apodData) return <ErrorMessage message="No APOD data available." />;

  return (
    <div className="card">
      {/* Title and subtitle */}
      <h2 className="card-title">{apodData.title}</h2>
      <p className="card-subtitle">Astronomy Picture of the Day for {new Date(apodData.date).toLocaleDateString()}</p>     
      <div className="scroll-down-arrow" />  
      {/* Image or video display */}
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
      {/* Copyright info if available */}
      {apodData.copyright && <p className="card-info">Copyright: {apodData.copyright}</p>}
      {/* Explanation text */}
      <p className="card-text">{apodData.explanation}</p>
      {/* AI Poetic Copy button and result */}
       <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <button
          onClick={handleGeneratePoeticCopy}
          disabled={copyLoading}
          className='main-button'
          style={{ fontSize: '1.2rem', padding: '16px 36px' }}
        >
          {copyLoading ? 'Generating...' : '✨Turn This Into Poetry✨'}
        </button>
      </div>
      {/* Error message for AI copy */}
      {copyError && <div style={{textAlign: 'center', fontSize:'1rem', color: '#6d28d9', marginTop: '8px'}}>{copyError}</div>}
      {/* Display AI-generated poetic copy if available */}
      {poeticCopy && (
        <div style={{
          marginTop: '24px',
          background: 'linear-gradient(135deg, #f8fafc 20%, #e0e7ff 100%)',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 24px #b3b3b333',
          fontSize: '1rem',
          color: '#333',
          lineHeight: 1.7,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{fontWeight: 700, fontSize: '1.2rem', marginBottom: 12, color: '#6d28d9', letterSpacing: 1, textAlign: 'center'}}>Your Poetic Caption from AI</div>
          <div style={{whiteSpace: 'pre-line', textAlign: 'center', maxWidth: 600}}>{poeticCopy}</div>
        </div>
      )}

    </div>
  );
};

export default Apod; 