import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import * as api from '../api';

jest.mock('../api');

describe('App integration: navigation between pages', () => {
  beforeEach(() => {
    api.fetchApod.mockResolvedValue({ data: { title: 'Test APOD', media_type: 'image', url: 'https://test.com/apod.png', date: '2025-06-25', explanation: 'Test explanation' } });
    api.fetchNeows.mockResolvedValue({ data: [{ date: '2025-06-24', total: 5, hazardous: 1, asteroids: [] }] });
    api.fetchEpic.mockResolvedValue({ data: [{ url: 'https://test.com/epic.png', caption: 'Earth', date: '2025-06-24', identifier: 'id1' }] });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('navigates between Home, APOD, EPIC, and NeoWs pages', async () => {
    render(<App />);

    await waitFor(() => expect(screen.getByText(/ASTRONOMY PICTURE OF THE DAY/i)).toBeInTheDocument());

    const apodLinks = screen.getAllByRole('link', { name: /APOD/i });
    fireEvent.click(apodLinks[0]);
    await waitFor(() => expect(screen.getByText(/Test APOD/i)).toBeInTheDocument());

    fireEvent.click(screen.getByText(/EPIC/i));
    await waitFor(() => expect(screen.getByText(/Earth Polychromatic Imaging Camera/i)).toBeInTheDocument());

    await waitFor(() => expect(screen.getByRole('link', { name: /NeoWs/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('link', { name: /NeoWs/i }));
    await waitFor(() => expect(screen.getByText(/Near Earth Asteroids per Day/i)).toBeInTheDocument());
  });
}); 