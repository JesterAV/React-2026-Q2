import { screen } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import Header from "./Header";
import logo from '../../assets/supernatural_logo.png';
import { localStorageService } from "../../services/localStorage";
import { searchKey } from "../../config/localStorage";
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../tests/test-utils';

vi.mock('../../services/localStorage', () => ({
  localStorageService: {
    get: vi.fn(),
    set: vi.fn()
  }
}));

describe('Header component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const mockGet = vi.mocked(localStorageService.get);
    mockGet.mockReturnValue('');
  });

  describe('Correctly render', () => {
    test('Logo and image', () => {
      renderWithProviders(<Header onSearch={mockOnSearch} />);

      expect(screen.getByText('Hunterpedia')).toBeInTheDocument();

      const img = screen.getByRole('img');

      expect(img).toHaveAttribute('src', logo);
      expect(img).toHaveAttribute('alt', 'supernatural logo');
    });

    test('Input and Button', () => {
      renderWithProviders(<Header onSearch={mockOnSearch} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Test Error' })).toBeInTheDocument();
    });
  });

  describe('localStorage', () => {
    test('load saved search', () => {
      const savedSearch = 'Dean';
      const mockGet = vi.mocked(localStorageService.get);
      mockGet.mockReturnValue(savedSearch);

      renderWithProviders(<Header onSearch={mockOnSearch} />);

      expect(localStorageService.get).toHaveBeenCalledWith(searchKey);
      expect(screen.getByRole('textbox')).toHaveValue(savedSearch);
    });
  });

  describe('User interactions', () => {
    test('updates input on type', async () => {
      const user = userEvent.setup();

      renderWithProviders(<Header onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');

      await user.type(input, 'Sam');

      expect(input).toHaveValue('Sam');
    });

    test('Submit form', async () => {
      const user = userEvent.setup();

      renderWithProviders(<Header onSearch={mockOnSearch} />);

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
      renderWithProviders(<Header onSearch={mockOnSearch} />);
      
      const button = screen.getByRole('button', { name: 'Search' });
      await user.click(button);
      
      expect(mockOnSearch).not.toHaveBeenCalled();
      expect(localStorageService.set).toHaveBeenCalledWith(searchKey, 'Castiel');
    });

    test('Search with different empty states', async () => {
      const user = userEvent.setup();
      const mockGet = vi.mocked(localStorageService.get);
      mockGet.mockReturnValue('old');
      
      renderWithProviders(<Header onSearch={mockOnSearch} />);
      
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: 'Search' });
      
      await user.clear(input);
      await user.click(button);
      
      expect(mockOnSearch).toHaveBeenCalledWith('');
      expect(localStorageService.set).toHaveBeenCalledWith(searchKey, '');
    });

    test('Navigate to about page', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(<Header onSearch={mockOnSearch} />);
      
      const aboutButton = screen.getByRole('button', { name: 'About' });
      await user.click(aboutButton);
      
      expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    test('Throws error when Test Error button is clicked', async () => {
      const user = userEvent.setup();
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      renderWithProviders(<Header onSearch={mockOnSearch} />);
      
      const errorButton = screen.getByRole('button', { name: 'Test Error' });
      
      await expect(async () => {
        await user.click(errorButton);
      }).rejects.toThrow('Test Error');
      
      consoleSpy.mockRestore();
    });
  });
});