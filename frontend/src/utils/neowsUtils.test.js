import { getLatestNeowsData } from './neowsUtils';

// Test suite for getLatestNeowsData utility function
describe('getLatestNeowsData', () => {
  /**
   * Should return the data with the latest date from a non-empty array
   */
  it('returns the data with the latest date', () => {
    const data = [
      { date: '2024-06-01', total: 5 },
      { date: '2024-06-02', total: 10 },
      { date: '2024-05-30', total: 3 }
    ];
    expect(getLatestNeowsData(data)).toEqual({ count: 10, date: '2024-06-02' });
  });

  /**
   * Should return { count: 0, date: 'N/A' } for an empty array
   */
  it('returns N/A for empty array', () => {
    expect(getLatestNeowsData([])).toEqual({ count: 0, date: 'N/A' });
  });

  /**
   * Should return { count: 0, date: 'N/A' } for null or undefined input
   */
  it('returns N/A for invalid input', () => {
    expect(getLatestNeowsData(null)).toEqual({ count: 0, date: 'N/A' });
    expect(getLatestNeowsData(undefined)).toEqual({ count: 0, date: 'N/A' });
  });

  /**
   * Should return the only element if array has one item
   */
  it('returns the only element if array has one item', () => {
    const data = [{ date: '2024-06-01', total: 7 }];
    expect(getLatestNeowsData(data)).toEqual({ count: 7, date: '2024-06-01' });
  });
}); 