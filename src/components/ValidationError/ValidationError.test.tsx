import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import ValidationError from './ValidationError';

describe('ValidationError component', () => {
  describe('Correctly render', () => {
    test('renders error message and correct class name', () => {
      const errorText = 'Field is required';
      render(<ValidationError errorText={errorText} />);

      const textElement = screen.getByText(errorText);

      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveClass('validation-error');
    });
  });
});
