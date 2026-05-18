import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ResultContainer from './ResultContainer';
import type { Character } from '../../types/characters';

describe('ResultContainer', () => {
  const mockSetId = vi.fn();
  
  const charactersMock: Character[] = [
    {
      id: '1',
      name: 'Dean Winchester',
      img: 'dean.jpg',
      actor: ['Jensen Ackles'],
      occupation: ['Hunter'],
      episodes: [],
    },
    {
      id: '2',
      name: 'Sam Winchester',
      img: 'sam.jpg',
      actor: ['Jared Padalecki'],
      occupation: ['Hunter'],
      episodes: [],
    },
  ];

  test('renders list of characters', () => {
    render(<ResultContainer characters={charactersMock} setId={mockSetId} />);
    
    expect(screen.getByText('Dean Winchester')).toBeInTheDocument();
    expect(screen.getByText('Sam Winchester')).toBeInTheDocument();
  });

  test('renders empty state when no characters', () => {
    render(<ResultContainer characters={[]} setId={mockSetId} />);
    
    expect(screen.getByText(/No characters found/i)).toBeInTheDocument();
  });

  test('renders correctly with character without id', () => {
    const mockWithoutId = [
      { ...charactersMock[0], id: '' },
    ] as Character[];
    
    render(<ResultContainer characters={mockWithoutId} setId={mockSetId} />);
    
    expect(screen.getByText('Dean Winchester')).toBeInTheDocument();
  });
});