import { screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import CharacterCard from './CharacterCard';
import { renderWithProviders } from '../../tests/test-utils';
import { configureStore } from '@reduxjs/toolkit';
import selectedCardsReducer from '../../store/slices/selectCards';

describe('CharacterCard component', () => {
  const mockSetId = vi.fn();
  const mockProps = {
    name: 'Dean Winchester',
    img: 'https://example.com/dean.jpg',
    actor: ['Jensen Ackles'],
    id: '1',
    setId: mockSetId
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Correctly render', () => {
    test('Displays character name', () => {
      renderWithProviders(<CharacterCard {...mockProps} />);

      expect(screen.getByText('Dean Winchester')).toBeInTheDocument();
    });

    test('Displays actor name', () => {
      renderWithProviders(<CharacterCard {...mockProps} />);

      expect(screen.getByText('Actor: Jensen Ackles')).toBeInTheDocument();
    });

    test('Displays multiple actors correctly', () => {
      const propsWithMultipleActors = {
        ...mockProps,
        actor: ['Jensen Ackles', 'Jared Padalecki']
      };
      
      renderWithProviders(<CharacterCard {...propsWithMultipleActors} />);

      expect(screen.getByText('Actor: Jensen Ackles, Jared Padalecki')).toBeInTheDocument();
    });

    test('Displays character image with correct attributes', () => {
      renderWithProviders(<CharacterCard {...mockProps} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', mockProps.img);
      expect(image).toHaveAttribute('alt', mockProps.name);
    });

    test('Checkbox is unchecked by default when id not in selectedCards', () => {
      const store = configureStore({
        reducer: {
          selectedCards: selectedCardsReducer
        },
        preloadedState: {
          selectedCards: { selectCards: [] }
        }
      });

      renderWithProviders(<CharacterCard {...mockProps} />, { store });

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    test('Checkbox is checked when id is in selectedCards', () => {
      const store = configureStore({
        reducer: {
          selectedCards: selectedCardsReducer
        },
        preloadedState: {
          selectedCards: { selectCards: ['1'] }
        }
      });

      renderWithProviders(<CharacterCard {...mockProps} />, { store });

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });

  describe('User interactions', () => {
    test('Clicking card calls setId with character id', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(<CharacterCard {...mockProps} />);

      const card = screen.getByText('Dean Winchester').closest('.character-card');
      if (card) await user.click(card);
      
      expect(mockSetId).toHaveBeenCalledWith('1');
      expect(mockSetId).toHaveBeenCalledTimes(1);
    });

    test('Clicking on image calls setId with character id', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(<CharacterCard {...mockProps} />);

      const image = screen.getByRole('img');
      await user.click(image);
      
      expect(mockSetId).toHaveBeenCalledWith('1');
    });

    test('Clicking on name calls setId with character id', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(<CharacterCard {...mockProps} />);

      const name = screen.getByText('Dean Winchester');
      await user.click(name);
      
      expect(mockSetId).toHaveBeenCalledWith('1');
    });

    test('Checkbox click toggles selection and does not trigger setId', async () => {
      const user = userEvent.setup();
      
      const store = configureStore({
        reducer: {
          selectedCards: selectedCardsReducer
        },
        preloadedState: {
          selectedCards: { selectCards: [] }
        }
      });
      
      renderWithProviders(<CharacterCard {...mockProps} />, { store });

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      expect(mockSetId).not.toHaveBeenCalled();
      expect(store.getState().selectedCards.selectCards).toContain('1');
    });

    test('Checkbox click stops propagation to parent card', async () => {
      const user = userEvent.setup();
      const parentClickHandler = vi.fn();
      
      renderWithProviders(
        <div onClick={parentClickHandler}>
          <CharacterCard {...mockProps} />
        </div>
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      expect(parentClickHandler).not.toHaveBeenCalled();
    });

    test('Checkbox click toggles from checked to unchecked', async () => {
      const user = userEvent.setup();
      
      const store = configureStore({
        reducer: {
          selectedCards: selectedCardsReducer
        },
        preloadedState: {
          selectedCards: { selectCards: ['1'] }
        }
      });
      
      renderWithProviders(<CharacterCard {...mockProps} />, { store });

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
      
      await user.click(checkbox);
      
      expect(store.getState().selectedCards.selectCards).not.toContain('1');
    });
  });

  describe('Different character data', () => {
    test('Renders with different character', () => {
      const differentCharacter = {
        name: 'Sam Winchester',
        img: 'https://example.com/sam.jpg',
        actor: ['Jared Padalecki'],
        id: '2',
        setId: mockSetId
      };
      
      renderWithProviders(<CharacterCard {...differentCharacter} />);

      expect(screen.getByText('Sam Winchester')).toBeInTheDocument();
      expect(screen.getByText('Actor: Jared Padalecki')).toBeInTheDocument();
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', differentCharacter.img);
      expect(image).toHaveAttribute('alt', differentCharacter.name);
    });

    test('Handles long actor list', () => {
      const propsWithManyActors = {
        ...mockProps,
        actor: ['Actor 1', 'Actor 2', 'Actor 3', 'Actor 4']
      };
      
      renderWithProviders(<CharacterCard {...propsWithManyActors} />);

      expect(screen.getByText('Actor: Actor 1, Actor 2, Actor 3, Actor 4')).toBeInTheDocument();
    });
  });
});