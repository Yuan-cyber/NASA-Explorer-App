import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Apod from './Apod';
import * as DataContext from '../context/DataContext';
import * as api from '../api';

// Mock the API module for AI poetic copy
jest.mock('../api');

// Mock APOD data for context
const mockApodData = {
  title: "Test Title",
  date: "2025-06-25",
  explanation: "Test explanation",
  media_type: "image",
  url: "https://test.com/image.png"
};

// Test suite for the Apod page component
describe('Apod page', () => {
  beforeEach(() => {
    // Mock useNasaData to provide APOD data and loading/error state
    jest.spyOn(DataContext, 'useNasaData').mockReturnValue({
      apodData: mockApodData,
      loading: false,
      error: null
    });
  });

  /**
   * Should render APOD title, explanation, and image
   */
  it('renders APOD data', () => {
    render(<Apod />);
    expect(screen.getByText(/Test Title/)).toBeInTheDocument();
    expect(screen.getByText(/Test explanation/)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockApodData.url);
  });

  /**
   * Should show AI poetic copy after clicking the button
   */
  it('shows AI poetic copy after button click', async () => {
    api.generatePoeticCopy.mockResolvedValue('A poetic line!');
    render(<Apod />);
    fireEvent.click(screen.getByText(/Turn This Into Poetry/i));
    expect(screen.getByText(/Generating/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/A poetic line!/)).toBeInTheDocument());
  });
});
