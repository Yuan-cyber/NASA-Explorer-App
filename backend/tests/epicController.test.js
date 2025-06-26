const request = require('supertest');
const express = require('express');
const epicRouter = require('../routes/epic');

jest.mock('axios');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use('/api/epic', epicRouter);

describe('GET /api/epic', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('identifier', 'id1');
    expect(res.body[0]).toHaveProperty('caption', 'A test image');
    expect(res.body[0]).toHaveProperty('date', '2024-06-27 12:00:00');
    expect(res.body[0]).toHaveProperty('url');
    expect(res.body[0].url).toMatch(/img1\.png$/);
  });

  it('should return empty array when NASA API returns no data', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    const res = await request(app).get('/api/epic');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

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
    expect(res.statusCode).toBe(200);
    expect(res.body[0].identifier).toBe('id2');
    expect(res.body[0].url).toMatch(/img2\.png$/);
  });

  it('should return 500 on axios error', async () => {
    axios.get.mockRejectedValueOnce(new Error('network error'));
    const res = await request(app).get('/api/epic');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Failed to fetch EPIC data from NASA');
  });
}); 