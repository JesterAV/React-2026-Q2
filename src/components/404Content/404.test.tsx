import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import NotFoundPage from './404Content';
import logo from '../../assets/supernatural_logo.png';

describe('NotFoundPage component', () => {
  const renderComponent = (component: React.ReactNode) => {
    return render(component);
  };

  describe('Correctly render', () => {
    test('Displays 404 title', () => {
      renderComponent(<NotFoundPage />);

      expect(screen.getByText('404')).toBeInTheDocument();
    });

    test('Displays error message', () => {
      renderComponent(<NotFoundPage />);

      expect(screen.getByText('Ooops! Page not found :(')).toBeInTheDocument();
    });

    test('Displays logo image', () => {
      renderComponent(<NotFoundPage />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', logo);
      expect(image).toHaveAttribute('alt', 'supernatural logo');
    });

    test('Displays Go to home button', () => {
      renderComponent(<NotFoundPage />);

      expect(screen.getByRole('button', { name: 'Go to home' })).toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    test('Clicking Go to home button works', async () => {
      const user = userEvent.setup();
      
      renderComponent(<NotFoundPage />);

      const button = screen.getByRole('button', { name: 'Go to home' });
      await user.click(button);
    });
  });
});