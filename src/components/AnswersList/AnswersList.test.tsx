import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { useSelector } from 'react-redux';
import AnswersList from './AnswersList';

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}));

vi.mock('../Answer/Answer', () => ({
  default: ({ name, country }: { name: string; country: string }) => (
    <div data-testid="mock-answer">
      <span>{name}</span>
      <span>{country}</span>
    </div>
  ),
}));

describe('AnswersList component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Correctly render', () => {
    test('renders an empty list when there are no answers', () => {
      const mockSelector = vi.mocked(useSelector);
      mockSelector.mockReturnValue([]);

      render(<AnswersList />);

      expect(screen.queryByTestId('mock-answer')).not.toBeInTheDocument();
    });

    test('renders correct number of Answer components with appropriate data', () => {
      const mockAnswers = [
        {
          id: '1',
          name: 'Sam Winchester',
          age: '41',
          email: 'sam@impala.com',
          gender: 'male',
          country: 'USA',
          acceptTerms: true,
          password: '123',
          img: 'sam.jpg',
        },
        {
          id: '2',
          name: 'Castiel',
          age: 'infinite',
          email: 'cas@heaven.com',
          gender: 'male',
          country: 'USA',
          acceptTerms: true,
          password: '456',
          img: 'cas.jpg',
        },
      ];

      const mockSelector = vi.mocked(useSelector);
      mockSelector.mockReturnValue(mockAnswers);

      render(<AnswersList />);

      const answerElements = screen.getAllByTestId('mock-answer');

      expect(answerElements).toHaveLength(2);
      expect(screen.getByText('Sam Winchester')).toBeInTheDocument();
      expect(screen.getByText('Castiel')).toBeInTheDocument();
    });

    test('passes correct props to the Answer component', () => {
      const mockAnswers = [
        {
          id: '3',
          name: 'Dean Winchester',
          age: '45',
          email: 'dean@impala.com',
          gender: 'male',
          country: 'Canada',
          acceptTerms: true,
          password: '789',
          img: 'dean.jpg',
        },
      ];

      const mockSelector = vi.mocked(useSelector);
      mockSelector.mockReturnValue(mockAnswers);

      render(<AnswersList />);

      expect(screen.getByText('Dean Winchester')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });
  });
});
