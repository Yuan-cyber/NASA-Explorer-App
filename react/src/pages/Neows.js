import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Area } from 'recharts';
import { useNasaData } from '../context/DataContext';
import AsteroidDetail from './AsteroidDetail';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import './Page.css';

// The user's preferred custom colors
const COLORS = ['#b39ddb', '#ffccbc']; // Light Purple (Hazardous), Light Orange (Non-hazardous)

const Neows = () => {
  const { neowsData, loading, error } = useNasaData();
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);

  // Correctly find the latest date from the array
  const latestDate = neowsData && neowsData.length > 0
    ? [...neowsData].sort((a, b) => b.date.localeCompare(a.date))[0].date
    : null;
    
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Set selectedDate once data is loaded and we have a latestDate
  useEffect(() => {
    if (latestDate && !selectedDate) {
      setSelectedDate(latestDate);
    }
  }, [latestDate, selectedDate]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  // Correct check for the new array data structure
  if (!neowsData || neowsData.length === 0) return <ErrorMessage message="No NeoWs data available." />;

  // Correctly calculate chart data from the array
  const chartData = neowsData.map(day => ({
    date: day.date,
    total: day.total,
  })).sort((a, b) => a.date.localeCompare(b.date));
  
  // Correctly calculate pie data from the array
  const totalHazardous = neowsData.reduce((sum, day) => sum + (day.hazardous || 0), 0);
  const totalNonHazardous = neowsData.reduce((sum, day) => sum + ((day.total || 0) - (day.hazardous || 0)), 0);
  
  const pieData = [
    { name: 'Hazardous', value: totalHazardous },
    { name: 'Non-hazardous', value: totalNonHazardous }
  ];

  const handleChartClick = (e) => {
    if (e && e.activePayload && e.activePayload.length > 0) {
      const clickedDate = e.activePayload[0].payload.date;
      setSelectedDate(clickedDate);
    }
  };
  
  // Correctly find the asteroid data for the selected date from the array
  const dailyData = neowsData.find(day => day.date === selectedDate)?.asteroids || [];

  return (
    <div>
      <div className="charts-row">
        <div className="chart-card" style={{ flex: 7 }}>
          <h3>Asteroids per Day</h3>
          <div className="click-tip">Click on a date in the chart to filter the list below.</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ left: 10, right: 30, top: 20, bottom: 5 }} onClick={handleChartClick}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F8EF7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#4F8EF7" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 14, fontWeight: 500, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 14, fontWeight: 500, fill: '#888' }} axisLine={false} tickLine={false} />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" vertical={false} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#4F8EF7" 
                strokeWidth={3}
                dot={{ r: 5, stroke: '#A084E8', strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 8, stroke: '#A084E8', fill: '#A084E8' }}
              />
              <Area type="monotone" dataKey="total" stroke={false} fill="url(#colorTotal)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card" style={{ flex: 3 }}>
          <h3>Hazardous Ratio<br />in 7 Days</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={pieData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={70} 
                label
                labelLine={false}
                stroke="#fff"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 4px 16px #b39ddb66)' }}
              >
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Legend 
                iconType="circle" 
                align="left" 
                verticalAlign="bottom" 
                wrapperStyle={{ fontSize: 14, color: '#888', fontWeight: 500, lineHeight: '1.8' }} 
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {selectedDate && (
        <div className="day-card">
          <div className="day-title">Asteroids for {selectedDate}</div>
          <div className="asteroid-list">
            {dailyData.map(asteroid => (
              <div 
                key={asteroid.id}
                className="asteroid-row-card"
                onClick={() => setSelectedAsteroid(asteroid)}
              >
                <div className="asteroid-row-main">
                  <span className="asteroid-name">{asteroid.name}</span>
                  <span className="asteroid-size">
                    {parseFloat(asteroid.estimated_diameter.kilometers.estimated_diameter_min).toFixed(2)} - 
                    {parseFloat(asteroid.estimated_diameter.kilometers.estimated_diameter_max).toFixed(2)} km
                  </span>
                </div>
                <div className={asteroid.is_potentially_hazardous_asteroid ? 'asteroid-hazardous-label' : 'asteroid-safe-label'}>
                  {asteroid.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Safe'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <AsteroidDetail asteroid={selectedAsteroid} onClose={() => setSelectedAsteroid(null)} />
    </div>
  );
};

export default Neows; 