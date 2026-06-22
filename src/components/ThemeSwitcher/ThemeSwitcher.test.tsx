import { screen } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import userEvent from '@testing-library/user-event';
import ThemeSwitcher from "./ThemeSwitcher";
import { renderWithProviders } from '../../tests/test-utils';
import { useTheme } from "../../hooks/useTheme";

vi.mock("../../hooks/useTheme", () => ({
  useTheme: vi.fn(),
}));

describe('ThemeSwitcher component', () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Correctly render', () => {
    test('shows moon icon when theme is light', () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
      });

      renderWithProviders(<ThemeSwitcher />);

      expect(screen.getByRole('button')).toHaveTextContent('🌙');
    });

    test('shows sun icon when theme is dark', () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
      });

      renderWithProviders(<ThemeSwitcher />);

      expect(screen.getByRole('button')).toHaveTextContent('🌞');
    });
  });

  describe('User interactions', () => {
    test('calls toggleTheme when button is clicked', async () => {
      const user = userEvent.setup();
      
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        toggleTheme: mockToggleTheme,
      });

      renderWithProviders(<ThemeSwitcher />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    test('toggles from light to dark', async () => {
      const user = userEvent.setup();
      let theme: 'light' | 'dark' = 'light';
      
      vi.mocked(useTheme).mockReturnValue({
        theme,
        toggleTheme: () => {
          theme = theme === 'light' ? 'dark' : 'light';
        },
      });

      const { rerender } = renderWithProviders(<ThemeSwitcher />);
      
      expect(screen.getByRole('button')).toHaveTextContent('🌙');

      const button = screen.getByRole('button');
      await user.click(button);

      vi.mocked(useTheme).mockReturnValue({
        theme: 'dark',
        toggleTheme: () => {},
      });

      rerender(<ThemeSwitcher />);

      expect(screen.getByRole('button')).toHaveTextContent('🌞');
    });
  });
});