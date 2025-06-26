import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { NasaDataProvider, useNasaData } from './DataContext';
import * as api from '../api';

jest.mock('../api');

const mockApod = { title: 'Test APOD' };
const mockNeows = [{ date: '2025-06-19', total: 6 }];
const mockEpic = [{ identifier: '20250624170239', url: 'https://test.com/epic.png' }];

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

describe('NasaDataProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
