import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { NasaDataProvider, useNasaData } from './DataContext';
import * as api from '../api';

// Mock all API functions used by the context
jest.mock('../api');

// Mock data for each NASA API
const mockApod = { title: 'Test APOD' };
const mockNeows = [{ date: '2025-06-19', total: 6 }];
const mockEpic = [{ identifier: '20250624170239', url: 'https://test.com/epic.png' }];

/**
 * TestComponent consumes the NASA data context and renders its values for assertions.
 */
const TestComponent = () => {
  const { apodData, neowsData, epicData, loading, error } = useNasaData();
  return (
    <div>
      <div data-testid="apod">{apodData ? apodData.title : 'no apod'}</div>
      <div data-testid="neows">{neowsData ? neowsData.length : 'no neows'}</div>
      <div data-testid="epic">{epicData ? epicData.length : 'no epic'}</div>
      <div data-testid="loading">{loading ? 'loading' : 'not loading'}</div>
      <div data-testid="error">{error || 'no error'}</div>
    </div>
  );
};

// Test suite for the NasaDataProvider context
describe('NasaDataProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Should provide context value after all API fetches succeed
   */
  it('provides context value after successful fetch', async () => {
    api.fetchApod.mockResolvedValue({ data: mockApod });
    api.fetchNeows.mockResolvedValue({ data: mockNeows });
    api.fetchEpic.mockResolvedValue({ data: mockEpic });
    render(
      <NasaDataProvider>
        <TestComponent />
      </NasaDataProvider>
    );
    expect(screen.getByTestId('loading').textContent).toBe('loading');
    await waitFor(() => expect(screen.getByTestId('apod').textContent).toBe('Test APOD'));
    expect(screen.getByTestId('neows').textContent).toBe('1');
    expect(screen.getByTestId('epic').textContent).toBe('1');
    expect(screen.getByTestId('loading').textContent).toBe('not loading');
    expect(screen.getByTestId('error').textContent).toBe('no error');
  });

  /**
   * Should set error if any API fetch fails
   */
  it('sets error if any API fails', async () => {
    api.fetchApod.mockRejectedValue(new Error('fail'));
    api.fetchNeows.mockResolvedValue({ data: mockNeows });
    api.fetchEpic.mockResolvedValue({ data: mockEpic });
    render(
      <NasaDataProvider>
        <TestComponent />
      </NasaDataProvider>
    );
    await waitFor(() => expect(screen.getByTestId('error').textContent).toMatch(/failed/i));
    expect(screen.getByTestId('loading').textContent).toBe('not loading');
  });

  /**
   * Should render children even if not consuming the context
   */
  it('renders children', async () => {
    api.fetchApod.mockResolvedValue({ data: mockApod });
    api.fetchNeows.mockResolvedValue({ data: mockNeows });
    api.fetchEpic.mockResolvedValue({ data: mockEpic });
    render(
      <NasaDataProvider>
        <div>child content</div>
      </NasaDataProvider>
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});
