import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import NotFoundPage from './404Content';
import logo from '../../assets/supernatural_logo.png';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockNavigate = vi.fn();

describe('NotFoundPage component', () => {
  const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Correctly render', () => {
    test('Displays 404 title', () => {
      renderWithRouter(<NotFoundPage />);

      expect(screen.getByText('404')).toBeInTheDocument();
    });

    test('Displays error message', () => {
      renderWithRouter(<NotFoundPage />);

      expect(screen.getByText('Ooops! Page not found :(')).toBeInTheDocument();
    });

    test('Displays logo image', () => {
      renderWithRouter(<NotFoundPage />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', logo);
      expect(image).toHaveAttribute('alt', 'supernatural logo');
    });

    test('Displays Go to home button', () => {
      renderWithRouter(<NotFoundPage />);

      expect(screen.getByRole('button', { name: 'Go to home' })).toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    test('Clicking Go to home button navigates to main page', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(<NotFoundPage />);

      const button = screen.getByRole('button', { name: 'Go to home' });
      await user.click(button);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });
});