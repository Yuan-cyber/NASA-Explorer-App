import axios from 'axios';
import { fetchApod, fetchEpic, fetchNeows, generatePoeticCopy } from './index';

jest.mock('axios');

describe('API functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetchApod returns real-like data', async () => {
    const apodMock = {
      date: "2025-06-25",
      explanation: "This interstellar skyscape ...",
      hdurl: "https://apod.nasa.gov/apod/image/2506/SagittariusTrip_Rubin.png",
      media_type: "image",
      service_version: "v1",
      title: "Rubin's First Look: A Sagittarius Skyscape",
      url: "https://apod.nasa.gov/apod/image/2506/SagittariusTrip_Rubin1100.png"
    };
    axios.get.mockResolvedValue({ data: apodMock });
    const res = await fetchApod();
    expect(res.data).toHaveProperty('date', '2025-06-25');
    expect(res.data).toHaveProperty('media_type', 'image');
    expect(res.data).toHaveProperty('title');
    expect(res.data).toHaveProperty('url');
  });

  it('fetchEpic returns real-like array', async () => {
    const epicMock = [
      {
        identifier: "20250624170239",
        caption: "This image was taken by NASA's EPIC camera ...",
        date: "2025-06-24 16:57:51",
        url: "https://epic.gsfc.nasa.gov/archive/natural/2025/06/24/png/epic_1b_20250624170239.png"
      },
      {
        identifier: "20250624180806",
        caption: "This image was taken by NASA's EPIC camera ...",
        date: "2025-06-24 18:03:18",
        url: "https://epic.gsfc.nasa.gov/archive/natural/2025/06/24/png/epic_1b_20250624180806.png"
      }
    ];
    axios.get.mockResolvedValue({ data: epicMock });
    const res = await fetchEpic('2025-06-24');
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data[0]).toHaveProperty('identifier');
    expect(res.data[0]).toHaveProperty('url');
    expect(res.data[0]).toHaveProperty('caption');
  });

  it('fetchNeows returns real-like array', async () => {
    const neowsMock = [
      {
        date: "2025-06-19",
        total: 6,
        hazardous: 1,
        min_diameter: 0.015,
        max_diameter: 0.299,
        asteroids: [
          { id: 1, name: "Asteroid 1", estimated_diameter: { kilometers: { estimated_diameter_min: 0.01, estimated_diameter_max: 0.02 } }, is_potentially_hazardous_asteroid: false, close_approach_data: [{ close_approach_date: "2025-06-19", relative_velocity: { kilometers_per_hour: "12345" }, miss_distance: { kilometers: "98765" } }] }
        ]
      },
      {
        date: "2025-06-20",
        total: 14,
        hazardous: 2,
        min_diameter: 0.0027,
        max_diameter: 1.71,
        asteroids: []
      }
    ];
    axios.get.mockResolvedValue({ data: neowsMock });
    const res = await fetchNeows();
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data[0]).toHaveProperty('date');
    expect(res.data[0]).toHaveProperty('asteroids');
    expect(Array.isArray(res.data[0].asteroids)).toBe(true);
    expect(res.data[0].asteroids[0]).toHaveProperty('name');
    expect(res.data[0].asteroids[0]).toHaveProperty('estimated_diameter');
  });

  it('generatePoeticCopy returns poeticCopy on success', async () => {
    axios.post.mockResolvedValue({ data: { poeticCopy: 'A poetic line about the universe.' } });
    const res = await generatePoeticCopy('test explanation');
    expect(res).toBe('A poetic line about the universe.');
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5001/api/apod/poetic-copy', { explanation: 'test explanation' });
  });

  it('generatePoeticCopy throws error if no poeticCopy', async () => {
    axios.post.mockResolvedValue({ data: { error: 'AI error' } });
    await expect(generatePoeticCopy('test')).rejects.toThrow('AI error');
  });
}); 