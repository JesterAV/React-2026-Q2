import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import MainPage from './main';
import { supernaturalApi } from '../../services/supernaturalApi';
import { localStorageService } from '../../services/localStorage';

vi.mock('../../services/supernaturalApi', () => ({
  supernaturalApi: {
    fetchAllCharacters: vi.fn(),
    searchCharacter: vi.fn(),
  },
}));

vi.mock('../../services/localStorage', () => ({
  localStorageService: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock('../../components/Header/Header', () => ({
  default: ({ onSearch }: { onSearch: (query: string) => void }) => (
    <div data-testid="header">
      <button onClick={() => onSearch('test')}>Search</button>
    </div>
  ),
}));

vi.mock('../../components/ResultContainer/ResultContainer', () => ({
  default: ({ setId }: { setId: (id: string) => void }) => (
    <div data-testid="result-container">
      <button onClick={() => setId('1')} data-testid="character-button">
        Dean Winchester
      </button>
    </div>
  ),
}));

vi.mock('../../components/PaginationControllers/PaginationControllers', () => ({
  default: ({ onChangePage, hasNext }: { onChangePage: (page: number) => void; hasNext: boolean }) => (
    <div data-testid="pagination">
      <button onClick={() => onChangePage(2)} data-testid="next-button">
        Next
      </button>
      <button onClick={() => onChangePage(0)} data-testid="prev-button">
        Prev
      </button>
      <span data-testid="has-next">{String(hasNext)}</span>
    </div>
  ),
}));

vi.mock('../../components/Loader/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('../../components/DetailCard/DetailCard', () => ({
  default: ({ handleSetCard }: { handleSetCard: (id: string | null) => void }) => (
    <div data-testid="detail-card">
      <button onClick={() => handleSetCard(null)} data-testid="close-button">Close</button>
    </div>
  ),
}));

vi.mock('../../hooks/useCharacterDetail', () => ({
  useCharacterDetail: () => ({
    openDetails: vi.fn(),
    closeDetails: vi.fn(),
  }),
}));

describe('MainPage component', () => {
  const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supernaturalApi.fetchAllCharacters).mockResolvedValue({
      data: [],
      count: 0,
      resultCount: 0,
      next: null,
    });
    vi.mocked(localStorageService.get).mockReturnValue('');
  });

  describe('Correctly render', () => {
    test('Shows loader when loading', () => {
      vi.mocked(supernaturalApi.fetchAllCharacters).mockImplementation(() => new Promise(() => {}));
      
      renderWithRouter(<MainPage />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    test('Shows header component', () => {
      renderWithRouter(<MainPage />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    test('Shows result container after loading', async () => {
      renderWithRouter(<MainPage />);

      expect(await screen.findByTestId('result-container')).toBeInTheDocument();
    });

    test('Shows pagination after loading', async () => {
      renderWithRouter(<MainPage />);

      expect(await screen.findByTestId('pagination')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    test('Changes page when clicking next', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MainPage />);
      
      await screen.findByTestId('pagination');
      
      const nextButton = screen.getByTestId('next-button');
      await user.click(nextButton);
      
      expect(supernaturalApi.fetchAllCharacters).toHaveBeenCalledWith(2);
    });

    test('Changes page when clicking prev', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MainPage />);
      
      await screen.findByTestId('pagination');
      
      const prevButton = screen.getByTestId('prev-button');
      await user.click(prevButton);
      
      expect(supernaturalApi.fetchAllCharacters).toHaveBeenCalledWith(0);
    });
  });

  describe('Search', () => {
    test('Performs search when query changes', async () => {
      const user = userEvent.setup();
      const mockSearchResults = {
        data: [],
        resultCount: 0,
        next: null,
      };
      vi.mocked(supernaturalApi.searchCharacter).mockResolvedValue(mockSearchResults);
      
      renderWithRouter(<MainPage />);
      
      const searchButton = screen.getByRole('button', { name: 'Search' });
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(supernaturalApi.searchCharacter).toHaveBeenCalledWith('test', 1);
      });
    });
  });

  describe('Character details', () => {
    test('Opens detail card when character is selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MainPage />);
      
      await screen.findByTestId('result-container');
      
      const characterButton = screen.getByTestId('character-button');
      await user.click(characterButton);
      
      expect(await screen.findByTestId('detail-card')).toBeInTheDocument();
    });

    test('Closes detail card when close button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MainPage />);
      
      await screen.findByTestId('result-container');
      
      const characterButton = screen.getByTestId('character-button');
      await user.click(characterButton);
      
      expect(await screen.findByTestId('detail-card')).toBeInTheDocument();
      
      const closeButton = screen.getByTestId('close-button');
      await user.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByTestId('detail-card')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    test('Handles API error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(supernaturalApi.fetchAllCharacters).mockRejectedValue(new Error('API Error'));
      
      renderWithRouter(<MainPage />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });
      
      consoleSpy.mockRestore();
    });
  });
});