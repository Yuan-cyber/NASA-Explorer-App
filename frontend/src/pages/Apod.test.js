import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Apod from './Apod';
import * as DataContext from '../context/DataContext';
import * as api from '../api';

jest.mock('../api');

const mockApodData = {
  title: "Test Title",
  date: "2025-06-25",
  explanation: "Test explanation",
  media_type: "image",
  url: "https://test.com/image.png"
};

describe('Apod page', () => {
  beforeEach(() => {
    jest.spyOn(DataContext, 'useNasaData').mockReturnValue({
      apodData: mockApodData,
      loading: false,
      error: null
    });
  });

  it('renders APOD data', () => {
    render(<Apod />);
    expect(screen.getByText(/Test Title/)).toBeInTheDocument();
    expect(screen.getByText(/Test explanation/)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockApodData.url);
  });

  it('shows AI poetic copy after button click', async () => {
    api.generatePoeticCopy.mockResolvedValue('A poetic line!');
    render(<Apod />);
    fireEvent.click(screen.getByText(/Turn This Into Poetry/i));
    expect(screen.getByText(/Generating/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/A poetic line!/)).toBeInTheDocument());
  });
});
