const request = require('supertest');
const express = require('express');
const epicRouter = require('../routes/epic');

// Mock axios to avoid real HTTP requests during tests
jest.mock('axios');
const axios = require('axios');
const epicController = require('../controllers/epicController');

const app = express();
app.use(express.json());
app.use('/api/epic', epicRouter);

// Clear epicCache before each test to avoid cache pollution
beforeEach(() => {
  epicController.epicCache.data = {};
  epicController.epicCache.expires = {};
});

// Test suite for EPIC image API
// Covers normal data, empty data, date param, and error scenarios
describe('GET /api/epic', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test: should return formatted images when NASA API returns data
  it('should return formatted images when NASA API returns data', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          identifier: 'id1',
          caption: 'A test image',
          date: '2024-06-27 12:00:00',
          image: 'img1'
        }
      ]
    });
    const res = await request(app).get('/api/epic');
    // Expect a successful response with formatted image data
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('identifier', 'id1');
    expect(res.body[0]).toHaveProperty('caption', 'A test image');
    expect(res.body[0]).toHaveProperty('date', '2024-06-27 12:00:00');
    expect(res.body[0]).toHaveProperty('url');
    expect(res.body[0].url).toMatch(/img1\.png$/);
  });

  // Test: should return empty array when NASA API returns no data
  it('should return empty array when NASA API returns no data', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    const res = await request(app).get('/api/epic');
    // Expect a successful response with an empty array
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  // Test: should support date query param
  it('should support date query param', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          identifier: 'id2',
          caption: 'Another image',
          date: '2024-06-26 10:00:00',
          image: 'img2'
        }
      ]
    });
    const res = await request(app).get('/api/epic?date=2024-06-26');
    // Expect a successful response with the correct image for the date
    expect(res.statusCode).toBe(200);
    expect(res.body[0].identifier).toBe('id2');
    expect(res.body[0].url).toMatch(/img2\.png$/);
  });

  // Test: should return 500 on axios error
  it('should return 500 on axios error', async () => {
    axios.get.mockRejectedValueOnce(new Error('network error'));
    const res = await request(app).get('/api/epic');
    // Expect a 500 error and a specific error message
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Failed to fetch EPIC data from NASA');
  });
}); 