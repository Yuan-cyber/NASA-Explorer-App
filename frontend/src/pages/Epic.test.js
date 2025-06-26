import { render, screen } from '@testing-library/react';
import Epic from './Epic';
import * as DataContext from '../context/DataContext';

const mockEpicData = [
  {
    identifier: '20250624170239',
    caption: 'Test caption',
    date: '2025-06-24 16:57:51',
    url: 'https://test.com/epic.png'
  }
];

describe('Epic page', () => {
  beforeEach(() => {
    jest.spyOn(DataContext, 'useNasaData');
  });

  it('renders epic image and title', () => {
    DataContext.useNasaData.mockReturnValue({
      epicData: mockEpicData,
      loading: false,
      error: null
    });
    render(<Epic />);
    expect(screen.getByText(/Earth Polychromatic Imaging Camera/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Test caption/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    DataContext.useNasaData.mockReturnValue({
      epicData: [],
      loading: false,
      error: null
    });
    render(<Epic />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message', () => {
    DataContext.useNasaData.mockReturnValue({
      epicData: [],
      loading: false,
      error: 'Failed to fetch'
    });
    render(<Epic />);
    expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
  });

});
