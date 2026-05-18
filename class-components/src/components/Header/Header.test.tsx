import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router";
import Header from "./Header";
import logo from '../../assets/supernatural_logo.png';
import { localStorageService } from "../../services/localStorage";
import { searchKey } from "../../config/localStorage";
import userEvent from '@testing-library/user-event'
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import { buttonMock } from "../../tests/mocks/buttonMock";

buttonMock();

vi.mock('../../services/localStorage', () => ({
  localStorageService: {
    get: vi.fn(),
    set: vi.fn()
  }
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Header component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const mockGet = vi.mocked(localStorageService.get);
    mockGet.mockReturnValue('');
  });

  const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe('Correctly render', () => {
    test('Logo and image', () => {
      renderWithRouter(<Header onSearch={mockOnSearch} />);

      expect(screen.getByText('Hunterpedia')).toBeInTheDocument();

      const img = screen.getByRole('img');

      expect(img).toHaveAttribute('src', logo);
      expect(img).toHaveAttribute('alt', 'supernatural logo');
    });

    test('Input and Button', () => {
      renderWithRouter(<Header onSearch={mockOnSearch} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Test Error' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
    })
  });

  describe('localStorage', () => {
    test('load saved search', () => {
      const savedSearch = 'Dean';
      const mockGet = vi.mocked(localStorageService.get);
      mockGet.mockReturnValue(savedSearch);

      renderWithRouter(<Header onSearch={mockOnSearch} />);

      expect(localStorageService.get).toHaveBeenCalledWith(searchKey);
      expect(screen.getByRole('textbox')).toHaveValue(savedSearch);
    });
  });

  describe('User interactions', () => {
    test('updates input on type', async () => {
      const user = userEvent.setup();

      renderWithRouter(<Header onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');

      await user.type(input, 'Sam');

      expect(input).toHaveValue('Sam');
    });

    test('Submit form', async () => {
      const user = userEvent.setup();

      renderWithRouter(<Header onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: 'Search' });
      
      await user.type(input, 'Crowley');
      await user.click(button);
      
      expect(mockOnSearch).toHaveBeenCalledWith('Crowley');
      expect(localStorageService.set).toHaveBeenCalledWith(searchKey, 'Crowley');
    });

    test('The search query has not changed', async () => {
      const mockGet = vi.mocked(localStorageService.get);
      mockGet.mockReturnValue('Castiel');
      
      const user = userEvent.setup();
      renderWithRouter(<Header onSearch={mockOnSearch} />);
      
      const button = screen.getByRole('button', { name: 'Search' });
      await user.click(button);
      
      expect(mockOnSearch).not.toHaveBeenCalled();
      expect(localStorageService.set).toHaveBeenCalledWith(searchKey, 'Castiel');
    });

    test('error button click', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      renderWithRouter(
        <ErrorBoundary>
          <Header onSearch={mockOnSearch} />
        </ErrorBoundary>
      );

      const errorButton = screen.getByRole('button', { name: 'Test Error' });
      errorButton.click();

      expect(screen.getByText(/error|something went wrong/i)).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});