const request = require('supertest');
const express = require('express');
const neowsRouter = require('../routes/neows');
const neowsController = require('../controllers/neowsController');

// Mock axios to avoid real HTTP requests during tests
jest.mock('axios');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use('/api/neows', neowsRouter);

// Clear neowsCache before each test to avoid cache pollution
beforeEach(() => {
  neowsController.neowsCache.data = {};
  neowsController.neowsCache.expires = {};
});

// Test suite for NEOWS (Near Earth Object Web Service) API
// Covers overview, filters, asteroid detail, and error scenarios
describe('GET /api/neows', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test: should return formatted overview data
  it('should return formatted overview data', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        near_earth_objects: {
          '2024-06-27': [
            {
              id: '1',
              is_potentially_hazardous_asteroid: true,
              estimated_diameter: { kilometers: { estimated_diameter_min: 0.1, estimated_diameter_max: 0.2 } }
            },
            {
              id: '2',
              is_potentially_hazardous_asteroid: false,
              estimated_diameter: { kilometers: { estimated_diameter_min: 0.05, estimated_diameter_max: 0.15 } }
            }
          ]
        }
      }
    });
    const res = await request(app).get('/api/neows');
    // Expect a successful response with formatted overview data
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('date', '2024-06-27');
    expect(res.body[0]).toHaveProperty('total', 2);
    expect(res.body[0]).toHaveProperty('hazardous', 1);
    expect(res.body[0]).toHaveProperty('min_diameter', 0.05);
    expect(res.body[0]).toHaveProperty('max_diameter', 0.2);
    expect(Array.isArray(res.body[0].asteroids)).toBe(true);
  });

  // Test: should support hazardous and diameter filters
  it('should support hazardous and diameter filters', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        near_earth_objects: {
          '2024-06-27': [
            {
              id: '1',
              is_potentially_hazardous_asteroid: true,
              estimated_diameter: { kilometers: { estimated_diameter_min: 0.1, estimated_diameter_max: 0.2 } }
            },
            {
              id: '2',
              is_potentially_hazardous_asteroid: false,
              estimated_diameter: { kilometers: { estimated_diameter_min: 0.05, estimated_diameter_max: 0.15 } }
            }
          ]
        }
      }
    });
    const res = await request(app).get('/api/neows?hazardous=true&min_diameter=0.15');
    // Expect a successful response with filtered data
    expect(res.statusCode).toBe(200);
    expect(res.body[0].total).toBe(1);
    expect(res.body[0].asteroids[0].id).toBe('1');
  });

  // Test: should return 500 on axios error
  it('should return 500 on axios error', async () => {
    axios.get.mockRejectedValueOnce(new Error('network error'));
    const res = await request(app).get('/api/neows');
    // Expect a 500 error and a specific error message
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Failed to fetch NeoWs data');
  });
});

describe('GET /api/neows/asteroid/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test: should return asteroid detail
  it('should return asteroid detail', async () => {
    axios.get.mockResolvedValueOnce({ data: { id: '123', name: 'Test Asteroid' } });
    const res = await request(app).get('/api/neows/asteroid/123');
    // Expect a successful response with asteroid detail
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', '123');
    expect(res.body).toHaveProperty('name', 'Test Asteroid');
  });

  // Test: should return 500 on axios error
  it('should return 500 on axios error', async () => {
    axios.get.mockRejectedValueOnce(new Error('network error'));
    const res = await request(app).get('/api/neows/asteroid/123');
    // Expect a 500 error and a specific error message
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Failed to fetch asteroid detail');
  });
}); 
