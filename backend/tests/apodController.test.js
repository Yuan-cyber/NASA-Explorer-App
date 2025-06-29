process.env.GEMINI_API_KEY = 'fake-key';

// Mock the @google/genai module to avoid real API calls during tests
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

const request = require('supertest');
const express = require('express');
const apodRouter = require('../routes/apod');
const app = express();
app.use(express.json());
app.use('/api/apod', apodRouter);

// Test suite for APOD poetic copy API
// Covers both success and error scenarios
describe('POST /api/apod/poetic-copy', () => {
  // Test: should return poetic copy for valid explanation
  it('should return poetic copy for valid explanation', async () => {
    const res = await request(app)
      .post('/api/apod/poetic-copy')
      .send({ explanation: 'The Milky Way stretches across the night sky.' });

    // Expect a successful response with the mocked poetic copy
    expect(res.statusCode).toBe(200);
    expect(res.body.poeticCopy).toBeDefined();
    expect(typeof res.body.poeticCopy).toBe('string');
    expect(res.body.poeticCopy).toBe('Mocked poetic copy.');
  });

  // Test: should return 400 if explanation is missing
  it('should return 400 if explanation is missing', async () => {
    const res = await request(app)
      .post('/api/apod/poetic-copy')
      .send({});

    // Expect a 400 error and a specific error message
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Missing explanation in request body');
  });
}); 