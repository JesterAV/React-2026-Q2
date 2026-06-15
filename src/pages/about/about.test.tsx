import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import AboutPage from './about';
import logo from '../../assets/supernatural_logo.png';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockNavigate = vi.fn();

describe('AboutPage component', () => {
  const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Correctly render', () => {
    test('Displays logo image', () => {
      renderWithRouter(<AboutPage />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', logo);
      expect(image).toHaveAttribute('alt', 'supernatural logo');
    });

    test('Displays application description', () => {
      renderWithRouter(<AboutPage />);

      expect(screen.getByText('This application offers a search engine in which you can find characters from the Supernatural series.')).toBeInTheDocument();
    });

    test('Displays author information', () => {
      renderWithRouter(<AboutPage />);

      expect(screen.getByText('Author:')).toBeInTheDocument();
      expect(screen.getByText('JesterAV')).toBeInTheDocument();
    });

    test('Displays link to GitHub profile', () => {
      renderWithRouter(<AboutPage />);

      const link = screen.getByRole('link', { name: 'JesterAV' });
      expect(link).toHaveAttribute('href', 'https://github.com/JesterAV');
      expect(link).toHaveAttribute('target', '_blank');
    });

    test('Displays Go to main page button', () => {
      renderWithRouter(<AboutPage />);

      expect(screen.getByRole('button', { name: 'Go to main page' })).toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    test('Clicking Go to main page button navigates to main page', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(<AboutPage />);

      const button = screen.getByRole('button', { name: 'Go to main page' });
      await user.click(button);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });
});