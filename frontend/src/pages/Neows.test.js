import { render, screen } from '@testing-library/react';
import Neows from './Neows';
import * as DataContext from '../context/DataContext';

window.ResizeObserver = window.ResizeObserver || class {
    observe() {}
    disconnect() {}
    unobserve() {}
  };

const mockNeowsData = [
  {
    date: '2025-06-19',
    total: 6,
    hazardous: 1,
    min_diameter: 0.015,
    max_diameter: 0.299,
    asteroids: [
      {
        id: 1,
        name: 'Asteroid 1',
        estimated_diameter: { kilometers: { estimated_diameter_min: 0.01, estimated_diameter_max: 0.02 } },
        is_potentially_hazardous_asteroid: false,
        close_approach_data: [{ close_approach_date: '2025-06-19', relative_velocity: { kilometers_per_hour: '12345' }, miss_distance: { kilometers: '98765' } }]
      }
    ]
  }
];

describe('Neows page', () => {
  beforeEach(() => {
    jest.spyOn(DataContext, 'useNasaData');
  });

  it('renders neows chart and title', () => {
    DataContext.useNasaData.mockReturnValue({
      neowsData: mockNeowsData,
      loading: false,
      error: null
    });
    render(<Neows />);
    expect(screen.getByText(/Near Earth Asteroids per Day/i)).toBeInTheDocument();
    expect(screen.getByText(/Asteroids for 2025-06-19/i)).toBeInTheDocument();
    expect(screen.getByText(/Asteroid 1/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    DataContext.useNasaData.mockReturnValue({
      neowsData: [],
      loading: true,
      error: null
    });
    render(<Neows />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message', () => {
    DataContext.useNasaData.mockReturnValue({
      neowsData: [],
      loading: false,
      error: 'Failed to fetch'
    });
    render(<Neows />);
    expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
  });

  it('shows no data message', () => {
    DataContext.useNasaData.mockReturnValue({
      neowsData: [],
      loading: false,
      error: null
    });
    render(<Neows />);
    expect(screen.getByText(/No NeoWs data available/i)).toBeInTheDocument();
  });
});
