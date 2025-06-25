import React from 'react';

const AsteroidDetail = ({ asteroid, onClose }) => {
  if (!asteroid) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{asteroid.name}</h2>
        <div>
          <b>Hazardous:</b> {asteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
        </div>
        <div>
          <b>Estimated Diameter (km):</b> {asteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3)} - {asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)}
        </div>
        <div>
          <b>Close Approach Date:</b> {asteroid.close_approach_data[0]?.close_approach_date}
        </div>
        <div>
          <b>Relative Velocity (km/h):</b> {asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_hour}
        </div>
        <div>
          <b>Miss Distance (km):</b> {asteroid.close_approach_data[0]?.miss_distance.kilometers}
        </div>
      </div>
    </div>
  );
};

export default AsteroidDetail; 