import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import CharacterCard from './CharacterCard';

describe('CharacterCard component', () => {
  const mockSetId = vi.fn();
  const mockProps = {
    name: 'Dean Winchester',
    img: 'https://example.com/dean.jpg',
    actor: ['Jensen Ackles'],
    id: '1',
    setId: mockSetId
  };

  describe('Correctly render', () => {
    test('Displays character name', () => {
      render(<CharacterCard {...mockProps} />);

      expect(screen.getByText('Dean Winchester')).toBeInTheDocument();
    });

    test('Displays actor name', () => {
      render(<CharacterCard {...mockProps} />);

      expect(screen.getByText('Actor: Jensen Ackles')).toBeInTheDocument();
    });

    test('Displays multiple actors correctly', () => {
      const propsWithMultipleActors = {
        ...mockProps,
        actor: ['Jensen Ackles', 'Jared Padalecki']
      };
      
      render(<CharacterCard {...propsWithMultipleActors} />);

      expect(screen.getByText('Actor: Jensen Ackles, Jared Padalecki')).toBeInTheDocument();
    });

    test('Displays character image with correct attributes', () => {
      render(<CharacterCard {...mockProps} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', mockProps.img);
      expect(image).toHaveAttribute('alt', mockProps.name);
    });
  });

  describe('User interactions', () => {
    test('Clicking card calls setId with character id', async () => {
      const user = userEvent.setup();
      
      render(<CharacterCard {...mockProps} />);

      const card = screen.getByText('Dean Winchester').closest('.character-card');
      await user.click(card!);
      
      expect(mockSetId).toHaveBeenCalledWith('1');
      expect(mockSetId).toHaveBeenCalledTimes(1);
    });

    test('Clicking on image calls setId with character id', async () => {
      const user = userEvent.setup();
      
      render(<CharacterCard {...mockProps} />);

      const image = screen.getByRole('img');
      await user.click(image);
      
      expect(mockSetId).toHaveBeenCalledWith('1');
    });

    test('Clicking on name calls setId with character id', async () => {
      const user = userEvent.setup();
      
      render(<CharacterCard {...mockProps} />);

      const name = screen.getByText('Dean Winchester');
      await user.click(name);
      
      expect(mockSetId).toHaveBeenCalledWith('1');
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
      
      render(<CharacterCard {...differentCharacter} />);

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
      
      render(<CharacterCard {...propsWithManyActors} />);

      expect(screen.getByText('Actor: Actor 1, Actor 2, Actor 3, Actor 4')).toBeInTheDocument();
    });
  });
});