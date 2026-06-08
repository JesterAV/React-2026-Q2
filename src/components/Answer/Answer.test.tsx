import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Answer from './Answer';
import type { FormAnswer } from '../../types/form';

describe('Answer component', () => {
  const mockProps: FormAnswer = {
    name: 'Dean Winchester',
    age: '45',
    email: 'dean@impala.com',
    gender: 'male',
    country: 'USA',
    acceptTerms: true,
    password: 'Supernatural123!',
    img: 'http://example.com',
  };

  describe('Correctly render', () => {
    test('renders all personal information fields', () => {
      render(<Answer {...mockProps} />);

      expect(screen.getByText('name: Dean Winchester')).toBeInTheDocument();
      expect(screen.getByText('age: 45')).toBeInTheDocument();
      expect(screen.getByText('email: dean@impala.com')).toBeInTheDocument();
      expect(screen.getByText('gender: male')).toBeInTheDocument();
      expect(screen.getByText('country: USA')).toBeInTheDocument();
      expect(screen.getByText('Accept terms: true')).toBeInTheDocument();
    });

    test('renders image with correct source and alt attributes', () => {
      render(<Answer {...mockProps} />);

      const img = screen.getByRole('img');

      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', mockProps.img);
      expect(img).toHaveAttribute('alt', mockProps.name);
      expect(img).toHaveClass('answer__image');
    });

    test('renders correctly with false acceptTerms value', () => {
      const propsWithFalseTerms = { ...mockProps, acceptTerms: false };
      render(<Answer {...propsWithFalseTerms} />);

      expect(screen.getByText('Accept terms: false')).toBeInTheDocument();
    });
  });
});
