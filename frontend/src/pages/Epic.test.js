import { render, screen } from '@testing-library/react';
import Epic from './Epic';
import * as DataContext from '../context/DataContext';

// Mock EPIC image data (structure matches NASA API)
const mockEpicData = [
  {
    identifier: '20250624170239',
    caption: 'Test caption',
    date: '2025-06-24 16:57:51',
    url: 'https://test.com/epic.png'
  }
];

describe('Epic page', () => {
  // Mock useNasaData before each test
  beforeEach(() => {
    jest.spyOn(DataContext, 'useNasaData');
  });

  it('renders epic image and title', () => {
    // Provide mock context with image data, no loading/error
    DataContext.useNasaData.mockReturnValue({
      epicData: mockEpicData,
      loading: false,
      error: null
    });
    render(<Epic />);
    // Should render the page title
    expect(screen.getByText(/Earth Polychromatic Imaging Camera/i)).toBeInTheDocument();
    // Should render the image with correct alt text
    expect(screen.getByAltText(/Test caption/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    // Provide mock context with loading true
    DataContext.useNasaData.mockReturnValue({
      epicData: [],
      loading: false,
      error: null
    });
    render(<Epic />);
    // Should show loader
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message', () => {
    // Provide mock context with error
    DataContext.useNasaData.mockReturnValue({
      epicData: [],
      loading: false,
      error: 'Failed to fetch'
    });
    render(<Epic />);
    // Should show error message
    expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
  });

});

