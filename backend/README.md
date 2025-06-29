# NASA AI Backend Service

## Project Overview

This project is a Node.js backend service that aggregates NASA astronomy data (APOD, EPIC, NEOWS) and provides AI-powered poetic copywriting using Gemini. It is suitable for astronomy infomation sharing, science education, and social media content generation.

---

## Directory Structure

```
backend/
  controllers/         # Business logic
  routes/              # Route definitions
  tests/               # Automated tests
  index.js             # Entry point
  package.json         # Dependency management
  .env                 # Environment variables
```

---

## Prerequisites

- **Node.js** >= 16
- **npm** >= 8

---

## Installation

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root:

```
NASA_API_KEY=your_nasa_api_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## Start the Server

```bash
node index.js
```

The server runs at `http://localhost:5001` by default.

---

## API Documentation

### 1. APOD (Astronomy Picture of the Day)

- **GET** `/api/apod`
  - Optional query: `date`, `start_date`, `end_date`, `count`
  - Returns: APOD image and explanation

### 2. EPIC (Earth Polychromatic Imaging Camera)

- **GET** `/api/epic`
  - Optional query: `date`
  - Returns: List of EPIC images

### 3. NEOWS (Near Earth Object Web Service)

- **GET** `/api/neows`
  - Optional query: `start_date`, `end_date`, `hazardous`, `min_diameter`, `max_diameter`
  - Returns: NEO summary
- **GET** `/api/neows/asteroid/:id`
  - Returns: Asteroid details

### 4. AI Poetic Copy Generation

- **POST** `/api/apod/poetic-copy`
  - Request body:
    ```json
    { "explanation": "APOD explanation text" }
    ```
  - Response:
    ```json
    { "poeticCopy": "Generated poetic copy" }
    ```

---

## Testing

Automated tests cover all major APIs. Run:

```bash
npm test
```

---

## Error Handling & Edge Cases

- All controllers use `try...catch` and return meaningful error messages and status codes.
- For external API failures, the response includes a generic error and the original error message for debugging.
- You can further improve by returning custom error codes and more detailed messages for different error types (e.g., 401 Unauthorized, 404 Not Found, timeout, etc.).
- Input parameters are validated, and missing/invalid parameters return 400 errors.

---

## Performance Optimization

- APOD endpoint uses in-memory caching to reduce NASA API load.
- AI copywriting endpoint has automatic retry logic for transient errors.
- For high-traffic scenarios, consider adding caching for EPIC/NEOWS endpoints (e.g., Redis) and rate limiting for AI endpoints.
- For static image resources (e.g., NASA images), consider using a CDN to accelerate global access and reduce load on NASA servers. This can be done by configuring a CDN service (like Cloudflare, AWS CloudFront, etc.) to cache and serve image URLs, and updating the image URL prefix in the backend response.

---

## FAQ

- **How to get NASA/Gemini/OpenAI API keys?**
  - Register at [NASA API Portal](https://api.nasa.gov/), [Google AI Studio](https://aistudio.google.com/app/apikey), or [OpenAI Platform](https://platform.openai.com/account/api-keys).
- **How to switch between Gemini and OpenAI?**
  - Set the corresponding API key in `.env` and update the logic in `apodController.js` if needed.

---

## Contribution

Feel free to open issues or pull requests for suggestions and improvements!

---

## License

ISC
