import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DetailCard from './DetailCard';
import { supernaturalApi } from '../../store/api/supernaturalApi';
import type { Character } from '../../types/characters';

vi.mock('../../store/api/supernaturalApi', () => ({
  useGetCharacterByIdQuery: vi.fn(),
  supernaturalApi: {
    reducerPath: 'supernaturalApi',
    reducer: (state = {}) => state,
    middleware: () => (next: any) => (action: any) => next(action),
  },
}));

import { useGetCharacterByIdQuery } from '../../store/api/supernaturalApi';

vi.mock('../Loader/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      [supernaturalApi.reducerPath]: supernaturalApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(supernaturalApi.middleware),
  });
};

describe('DetailCard component', () => {
  const mockHandleSetCard = vi.fn();
  
  const mockCharacter: Character = {
    id: '1',
    name: 'Dean Winchester',
    img: 'https://example.com/dean.jpg',
    actor: ['Jensen Ackles'],
    episodes: [
      { id: '1', title: 'Pilot' },
      { id: '2', title: 'Faith' }
    ],
    occupation: ['Hunter']
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <Provider store={createTestStore()}>
        {component}
      </Provider>
    );
  };

  describe('Correctly render', () => {
    test('Shows loader when loading', () => {
      (useGetCharacterByIdQuery as any).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });
      
      renderWithProvider(<DetailCard id="1" handleSetCard={mockHandleSetCard} />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    test('Shows character details after loading', async () => {
      (useGetCharacterByIdQuery as any).mockReturnValue({
        data: mockCharacter,
        isLoading: false,
        error: null,
      });
      
      renderWithProvider(<DetailCard id="1" handleSetCard={mockHandleSetCard} />);

      expect(await screen.findByText('Dean Winchester')).toBeInTheDocument();
      expect(await screen.findByText('Actor: Jensen Ackles')).toBeInTheDocument();
      expect(await screen.findByText('Occupation: Hunter')).toBeInTheDocument();
    });

    test('Displays character image with correct attributes', async () => {
      (useGetCharacterByIdQuery as any).mockReturnValue({
        data: mockCharacter,
        isLoading: false,
        error: null,
      });
      
      renderWithProvider(<DetailCard id="1" handleSetCard={mockHandleSetCard} />);

      const image = await screen.findByRole('img');
      expect(image).toHaveAttribute('src', mockCharacter.img);
      expect(image).toHaveAttribute('alt', mockCharacter.name);
    });
  });

  describe('API calls', () => {
    test('Calls query with correct id', async () => {
      (useGetCharacterByIdQuery as any).mockReturnValue({
        data: mockCharacter,
        isLoading: false,
        error: null,
      });
      
      renderWithProvider(<DetailCard id="2" handleSetCard={mockHandleSetCard} />);

      expect(useGetCharacterByIdQuery).toHaveBeenCalledWith('2');
    });
  });

  describe('User interactions', () => {
    test('Clicking close button calls handleSetCard with null', async () => {
      const user = userEvent.setup();
      
      (useGetCharacterByIdQuery as any).mockReturnValue({
        data: mockCharacter,
        isLoading: false,
        error: null,
      });
      
      renderWithProvider(<DetailCard id="1" handleSetCard={mockHandleSetCard} />);

      await screen.findByText('Dean Winchester');
      
      const closeButton = document.querySelector('.detail-card__close-button');
      if (closeButton) await user.click(closeButton);
      
      expect(mockHandleSetCard).toHaveBeenCalledWith(null);
    });
  });

  describe('Error handling', () => {
    test('Handles API error gracefully', async () => {
      (useGetCharacterByIdQuery as any).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('API Error'),
      });
      
      renderWithProvider(<DetailCard id="1" handleSetCard={mockHandleSetCard} />);

      expect(screen.queryByText('Dean Winchester')).not.toBeInTheDocument();
    });
  });
});