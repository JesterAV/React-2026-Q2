import { screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import MainPage from './MainPageContent';
import { renderWithProviders } from '../../tests/test-utils';
import { useGetAllCharactersQuery, useSearchCharactersQuery } from '../../store/api/supernaturalApi';

vi.mock('../../store/api/supernaturalApi', () => ({
  useGetAllCharactersQuery: vi.fn(),
  useSearchCharactersQuery: vi.fn(),
}));

vi.mock('../../services/localStorage', () => ({
  localStorageService: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock('../../components/Header/Header', () => ({
  default: ({ onSearch, onClearCache }: { onSearch: (query: string) => void; onClearCache: () => void }) => (
    <div data-testid="header">
      <button onClick={() => onSearch('test')} data-testid="search-button">Search</button>
      <button onClick={() => onClearCache()} data-testid="clear-cache">Clear Cache</button>
    </div>
  ),
}));

vi.mock('../../components/ResultContainer/ResultContainer', () => ({
  default: ({ setId, characters }: { setId: (id: string) => void; characters: any[] }) => (
    <div data-testid="result-container">
      {characters.map((char: any) => (
        <button 
          key={char.id} 
          onClick={() => setId(char.id)} 
          data-testid={`character-button-${char.id}`}
        >
          {char.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('../../components/PaginationControllers/PaginationControllers', () => ({
  default: ({ onChangePage, hasNext, currentPage }: { onChangePage: (page: number) => void; hasNext: boolean; currentPage: number }) => (
    <div data-testid="pagination">
      <button 
        onClick={() => onChangePage(currentPage + 1)} 
        data-testid="next-button"
        disabled={!hasNext}
      >
        Next
      </button>
      <button 
        onClick={() => onChangePage(currentPage - 1)} 
        data-testid="prev-button"
        disabled={currentPage === 1}
      >
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
  default: ({ id, handleSetCard }: { id: string; handleSetCard: (id: string | null) => void }) => (
    <div data-testid="detail-card">
      <span>Detail for {id}</span>
      <button onClick={() => handleSetCard(null)} data-testid="close-button">Close</button>
    </div>
  ),
}));

vi.mock('../../components/ErrorMessage/ErrorMessage', () => ({
  default: ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div data-testid="error-message">
      {message}
      <button onClick={onClose}>Close Error</button>
    </div>
  ),
}));

vi.mock('../../components/SelectedItems/SelectedItems', () => ({
  default: () => <div data-testid="selected-items">Selected Items</div>,
}));

vi.mock('../../hooks/useCharacterDetail', () => ({
  useCharacterDetail: () => ({
    openDetails: vi.fn(),
    closeDetails: vi.fn(),
  }),
}));

describe('MainPage component', () => {
  const mockCharacters = {
    data: [
      { id: '1', name: 'Dean Winchester' },
      { id: '2', name: 'Sam Winchester' }
    ],
    count: 2,
    next: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useGetAllCharactersQuery as any).mockReturnValue({
      data: mockCharacters,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    
    (useSearchCharactersQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  describe('Correctly render', () => {
    test('Shows loader when loading', () => {
      (useGetAllCharactersQuery as any).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });
      
      renderWithProviders(<MainPage />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    test('Shows header component', () => {
      renderWithProviders(<MainPage />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    test('Shows result container after loading', async () => {
      renderWithProviders(<MainPage />);

      expect(await screen.findByTestId('result-container')).toBeInTheDocument();
    });

    test('Shows pagination after loading', async () => {
      renderWithProviders(<MainPage />);

      expect(await screen.findByTestId('pagination')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    test('Changes page when clicking next', async () => {
      const user = userEvent.setup();
      (useGetAllCharactersQuery as any).mockReturnValue({
        data: { ...mockCharacters, next: 'next-page-url' },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });
      
      renderWithProviders(<MainPage />);
      
      await screen.findByTestId('pagination');
      
      const nextButton = screen.getByTestId('next-button');
      await user.click(nextButton);
      
      await waitFor(() => {
        expect(useGetAllCharactersQuery).toHaveBeenCalledWith(2, { skip: false });
      });
    });
  });

  describe('Search', () => {
    test('Performs search when query changes', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MainPage />);
      
      const searchButton = screen.getByTestId('search-button');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(useSearchCharactersQuery).toHaveBeenCalled();
      });
    });
  });

  describe('Character details', () => {
    test('Opens detail card when character is selected', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MainPage />);
      
      await screen.findByTestId('result-container');
      
      const characterButton = screen.getByTestId('character-button-1');
      await user.click(characterButton);
      
      expect(await screen.findByTestId('detail-card')).toBeInTheDocument();
    });

    test('Closes detail card when close button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MainPage />);
      
      await screen.findByTestId('result-container');
      
      const characterButton = screen.getByTestId('character-button-1');
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
      (useGetAllCharactersQuery as any).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('API Error'),
        refetch: vi.fn(),
      });
      
      renderWithProviders(<MainPage />);

      expect(await screen.findByTestId('error-message')).toBeInTheDocument();
    });
  });

  describe('Clear cache', () => {
    test('Calls refetch when clear cache button is clicked', async () => {
      const mockRefetch = vi.fn();
      (useGetAllCharactersQuery as any).mockReturnValue({
        data: mockCharacters,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });
      
      const user = userEvent.setup();
      renderWithProviders(<MainPage />);
      
      const clearCacheButton = screen.getByTestId('clear-cache');
      await user.click(clearCacheButton);
      
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});