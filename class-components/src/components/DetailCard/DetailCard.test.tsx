import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import DetailCard from './DetailCard';
import { supernaturalApi } from '../../services/supernaturalApi';
import type { Character } from '../../types/characters';

vi.mock('../../services/supernaturalApi', () => ({
  supernaturalApi: {
    getCharacterById: vi.fn(),
  },
}));

vi.mock('../Loader/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

describe('DetailCard component', () => {
  const mockHandleSetCard = vi.fn();
  
  // Исправленный mockCharacter под тип Character
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
    vi.mocked(supernaturalApi.getCharacterById).mockResolvedValue(mockCharacter);
  });

  describe('Correctly render', () => {
    test('Shows loader when loading', () => {
      vi.mocked(supernaturalApi.getCharacterById).mockImplementation(() => new Promise(() => {}));
      
      render(<DetailCard id="1" handleSetCard={mockHandleSetCard} />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    test('Shows character details after loading', async () => {
      render(<DetailCard id="1" handleSetCard={mockHandleSetCard} />);

      expect(await screen.findByText('Dean Winchester')).toBeInTheDocument();
      expect(await screen.findByText('Actor: Jensen Ackles')).toBeInTheDocument();
      expect(await screen.findByText('Occupation: Hunter')).toBeInTheDocument();
    });

    test('Displays character image with correct attributes', async () => {
      render(<DetailCard id="1" handleSetCard={mockHandleSetCard} />);

      const image = await screen.findByRole('img');
      expect(image).toHaveAttribute('src', mockCharacter.img);
      expect(image).toHaveAttribute('alt', mockCharacter.name);
    });
  });

  describe('API calls', () => {
    test('Fetches character by id on mount', async () => {
      render(<DetailCard id="2" handleSetCard={mockHandleSetCard} />);

      expect(supernaturalApi.getCharacterById).toHaveBeenCalledWith('2');
      await screen.findByText('Dean Winchester');
    });

    test('Refetches when id changes', async () => {
      const { rerender } = render(<DetailCard id="1" handleSetCard={mockHandleSetCard} />);

      await screen.findByText('Dean Winchester');
      expect(supernaturalApi.getCharacterById).toHaveBeenCalledTimes(1);

      rerender(<DetailCard id="2" handleSetCard={mockHandleSetCard} />);
      
      expect(supernaturalApi.getCharacterById).toHaveBeenCalledTimes(2);
      expect(supernaturalApi.getCharacterById).toHaveBeenCalledWith('2');
    });

    test('Calls handleSetCard with id after successful fetch', async () => {
      render(<DetailCard id="1" handleSetCard={mockHandleSetCard} />);

      await screen.findByText('Dean Winchester');
      expect(mockHandleSetCard).toHaveBeenCalledWith('1');
    });
  });

  describe('User interactions', () => {
    test('Clicking close button calls handleSetCard with null', async () => {
      const user = userEvent.setup();
      
      render(<DetailCard id="1" handleSetCard={mockHandleSetCard} />);

      await screen.findByText('Dean Winchester');
      
      const closeButton = document.querySelector('.detail-card__close-button');
      await user.click(closeButton!);
      
      expect(mockHandleSetCard).toHaveBeenCalledWith(null);
    });
  });

  describe('Error handling', () => {
    test('Handles API error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(supernaturalApi.getCharacterById).mockRejectedValue(new Error('API Error'));

      render(<DetailCard id="1" handleSetCard={mockHandleSetCard} />);

      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(screen.queryByText('Dean Winchester')).not.toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});