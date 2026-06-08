import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button component', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Correctly render', () => {
    test('renders with correct text and type attributes', () => {
      render(<Button text="Click me" type="button" onClick={mockOnClick} />);

      const button = screen.getByRole('button', { name: 'Click me' });

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveClass('button');
    });

    test('renders as submit type', () => {
      render(<Button text="Submit form" type="submit" />);

      const button = screen.getByRole('button', { name: 'Submit form' });

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('User interactions', () => {
    test('calls onClick handler when clicked', async () => {
      const user = userEvent.setup();
      render(<Button text="Click me" type="button" onClick={mockOnClick} />);

      const button = screen.getByRole('button', { name: 'Click me' });
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('does not throw error if onClick is not provided', async () => {
      const user = userEvent.setup();
      render(<Button text="No click" type="button" />);

      const button = screen.getByRole('button', { name: 'No click' });

      await expect(user.click(button)).resolves.not.toThrow();
    });
  });
});
