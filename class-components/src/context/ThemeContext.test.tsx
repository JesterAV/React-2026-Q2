import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { ThemeProvider, ThemeContext } from "./ThemeContext";

describe('ThemeContext', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark-theme');
    vi.clearAllMocks();
  });

  describe('Correctly render', () => {
    test('Provider provides default light theme', () => {
      let themeValue = '';
      
      render(
        <ThemeProvider>
          <ThemeContext.Consumer>
            {(context) => {
              themeValue = context?.theme || '';
              return <div data-testid="theme-display">{themeValue}</div>;
            }}
          </ThemeContext.Consumer>
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-display')).toHaveTextContent('light');
      expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
    });

    test('Context renders children correctly', () => {
      render(
        <ThemeProvider>
          <div>Child Component</div>
        </ThemeProvider>
      );

      expect(screen.getByText('Child Component')).toBeInTheDocument();
    });
  });

  describe('Toggle theme functionality', () => {
    test('toggleTheme changes theme from light to dark', async () => {
      const user = userEvent.setup();
      let currentTheme = '';
      let toggleFn = () => {};
      
      render(
        <ThemeProvider>
          <ThemeContext.Consumer>
            {(context) => {
              currentTheme = context?.theme || '';
              toggleFn = context?.toggleTheme || (() => {});
              return (
                <div>
                  <div data-testid="theme-value">{currentTheme}</div>
                  <button onClick={toggleFn}>Toggle</button>
                </div>
              );
            }}
          </ThemeContext.Consumer>
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
      
      await user.click(screen.getByRole('button', { name: 'Toggle' }));
      
      expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
      expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    });
  });
});