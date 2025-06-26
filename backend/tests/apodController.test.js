const request = require('supertest');
const express = require('express');
const apodRouter = require('../routes/apod');

jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
        models: {
          generateContent: async () => ({
            candidates: [
              { content: { parts: [{ text: 'Mocked poetic copy.' }] } }
            ]
          })
        }
      }))
    };
  });

const app = express();
app.use(express.json());
app.use('/api/apod', apodRouter);

describe('POST /api/apod/poetic-copy', () => {
  it('should return poetic copy for valid explanation', async () => {
    const res = await request(app)
      .post('/api/apod/poetic-copy')
      .send({ explanation: 'The Milky Way stretches across the night sky.' });

    expect(res.statusCode).toBe(200);
    expect(res.body.poeticCopy).toBeDefined();
    expect(typeof res.body.poeticCopy).toBe('string');
    expect(res.body.poeticCopy).toBe('Mocked poetic copy.');
  });

  it('should return 400 if explanation is missing', async () => {
    const res = await request(app)
      .post('/api/apod/poetic-copy')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Missing explanation in request body');
  });
}); 