# NASA Space Explorer

This is a full-stack web application for exploring NASA astronomy data (APOD, EPIC, NEOWS) and generating social media copy using Gemini AI.

It is suitable for astronomy image sharing, science education, and social media content creation.

🌐 **Live Demo**: https://nasa-explorer-app-frontend.onrender.com/

![nasa_screenshot1](https://github.com/user-attachments/assets/328cea6e-2cce-4777-b935-817672c86196)
![nasa_screenshot2](https://github.com/user-attachments/assets/d1ea0d65-d0e3-477f-931b-e5da8b475800)


## Features

- **Astronomy Picture of the Day (APOD)**: View daily space imagery with detailed explanations.
- **Earth Polychromatic Imaging Camera (EPIC)**: Browse and create animations for daily images of Earth.
- **Near Earth Object Web Service (NeoWs)**: Visualize near-Earth asteroid data, including a line graph of daily counts, a pie chart of hazardous ratios, and detailed asteroid lists.
- **AI-Powered Poetic Copy**: Instantly generate poetic and social-media-friendly copy for APOD images using Gemini AI.
- **Responsive Design**: Fully responsive layout for desktop and mobile devices.

## Stack

- **Frontend**: React 18, React Router DOM, Axios, Recharts, React DatePicker, CSS Modules
- **Backend**: Node.js, Express, Gemini AI API
- **Testing**: Jest, React Testing Library

## Project Structure

```
frontend/
  public/             # Static assets and manifest
  src/
    api/              # API request functions
    components/       # Reusable UI components
    context/          # React Context for global NASA data
    pages/            # Main page components (APOD, EPIC, Neows, Home)
    utils/            # Utility functions
    index.js          # App entry point
    App.js            # Main app component and routing
  .env                # Environment variables


backend/
  controllers/         # Business logic
  routes/              # Route definitions
  tests/               # Automated tests
  .env                 # Environment variables
  config.js            # Centralized configuration for API URLs, keys
  index.js             # Entry point
```

## Getting Started

### Prerequisites

- Node.js ≥ 16
- npm >= 8

### Installation

1. Clone the repository
```bash
git clone https://github.com/Yuan-cyber/NASA-Explorer-App
cd NASA-Explorer-App
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Configure environment variables

- Create a .env file in the backend/ directory with the following content:
  NASA_API_KEY=your_nasa_api_key
  GEMINI_API_KEY=your_gemini_api_key

  > You can get your NASA API key from NASA API Portal, and Gemini API key from Google AI Studio.

- Create a .env file in the frontend/ directory with the following content:
  REACT_APP_API_BASE_URL=http://localhost:5001/api
  > If you change the backend port, update this URL accordingly.

### Running

1. Start the backend
```bash
cd backend
npm node index.js
```
The backend will start on http://localhost:5001 by default.

2. Start the frontend
```bash
cd ../frontend
npm start
```
The frontend will start on http://localhost:3000 by default.

## Usage

- Use the navigation bar to switch between Home, APOD, EPIC, and NeoWs pages.
- **On the Home page**, you can also click directly on the APOD image, the latest Earth photo, or the asteroid card to quickly enter the corresponding page.
- On the APOD page, click “✨Turn This Into Poetry✨” to generate a poetic caption.
- On the EPIC page, select any date to view Earth images for that day, and click “Animate” to play the sequence.
- On the NeoWs page, click on a date to see that day's asteroid list.

## API Endpoints

- /api/apod — Get Astronomy Picture of the Day
- /api/epic — Get EPIC images for a specific date
- /api/neows — Get near-Earth asteroid data
- /api/neows/asteroid/:id - Get NEO detail
- /api/apod/poetic-copy — Generate poetic copy for APOD

## Testing

1. Backend
```bash
cd backend
npm test
```

2. Frontend
```bash
cd ../frontend
npm test
```

## Error Handling & Edge Cases

- All backend controllers use try...catch and return meaningful error messages and status codes.
- For external API failures, the response includes a generic error and the original error message for debugging.
- Edge cases such as missing parameters, empty or delayed data from NASA APIs, and network timeouts are handled gracefully with appropriate status codes and user-friendly messages.
- The frontend displays loading states, error messages, and handles empty data gracefully.

## Performance Optimization

- Backend endpoints use in-memory caching to reduce NASA API load.
- AI copywriting endpoint has automatic retry logic for transient errors.

## Deployment

The app is deployed on Render.com.
