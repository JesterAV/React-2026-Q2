import { screen } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import userEvent from '@testing-library/user-event';
import ErrorMessage from "./ErrorMessage";
import { renderWithProviders } from '../../tests/test-utils';

describe('ErrorMessage component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Correctly render', () => {
    test('renders with message, icon and close button', () => {
      renderWithProviders(
        <ErrorMessage message="Test error" onClose={mockOnClose} />
      );

      expect(screen.getByText('Test error')).toBeInTheDocument();
      expect(screen.getByText('⚠️')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('×')).toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    test('closes when close button is clicked', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <ErrorMessage message="Click to close" onClose={mockOnClose} />
      );

      const closeButton = screen.getByRole('button');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});