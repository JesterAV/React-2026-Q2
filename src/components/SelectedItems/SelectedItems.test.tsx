import { screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import SelectedItems from "./SelectedItems";
import { renderWithProviders } from '../../tests/test-utils';
import * as downloadCSV from '../../utils/downloadCSV';
import { supernaturalApi } from "../../services/supernaturalApi";
import { configureStore } from '@reduxjs/toolkit';
import selectedCardsReducer from '../../store/slices/selectCards';

vi.mock('../../services/supernaturalApi', () => ({
  supernaturalApi: {
    getCharacterById: vi.fn()
  }
}));

vi.mock('../../utils/downloadCSV', () => ({
  default: vi.fn()
}));

describe('SelectedItems component', () => {
  const mockCharacters = [
    { id: '1', name: 'Dean Winchester', img: 'dean.jpg', actor: ['Jensen Ackles'], episodes: [], occupation: ['Hunter'] },
    { id: '2', name: 'Sam Winchester', img: 'sam.jpg', actor: ['Jared Padalecki'], episodes: [], occupation: ['Hunter'] }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    const mockGetCharacterById = vi.mocked(supernaturalApi.getCharacterById);
    mockGetCharacterById.mockResolvedValue(mockCharacters[0]);
  });

  describe('Correctly render', () => {
    test('Render nothing when no items selected', () => {
      const store = configureStore({
        reducer: {
          selectedCards: selectedCardsReducer
        },
        preloadedState: {
          selectedCards: { selectCards: [] }
        }
      });

      renderWithProviders(<SelectedItems />, { store });

      expect(screen.queryByText('Selected:')).not.toBeInTheDocument();
    });

    test('Render counter and buttons when items selected', async () => {
      const mockGetCharacterById = vi.mocked(supernaturalApi.getCharacterById);
      mockGetCharacterById.mockResolvedValueOnce(mockCharacters[0]);
      mockGetCharacterById.mockResolvedValueOnce(mockCharacters[1]);

      const store = configureStore({
        reducer: {
          selectedCards: selectedCardsReducer
        },
        preloadedState: {
          selectedCards: { selectCards: ['1', '2'] }
        }
      });

      renderWithProviders(<SelectedItems />, { store });

      await waitFor(() => {
        expect(screen.getByText('Selected: 2')).toBeInTheDocument();
      });
      
      expect(screen.getByRole('button', { name: 'Deselect all' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
    });
  });

  describe('Loading selected items', () => {
    test('Load characters by ids from API', async () => {
      const mockGetCharacterById = vi.mocked(supernaturalApi.getCharacterById);
      mockGetCharacterById.mockResolvedValueOnce(mockCharacters[0]);
      mockGetCharacterById.mockResolvedValueOnce(mockCharacters[1]);

      const store = configureStore({
        reducer: {
          selectedCards: selectedCardsReducer
        },
        preloadedState: {
          selectedCards: { selectCards: ['1', '2'] }
        }
      });

      renderWithProviders(<SelectedItems />, { store });

      await waitFor(() => {
        expect(mockGetCharacterById).toHaveBeenCalledTimes(2);
      });
      
      expect(mockGetCharacterById).toHaveBeenCalledWith('1');
      expect(mockGetCharacterById).toHaveBeenCalledWith('2');
      
      expect(await screen.findByText('Dean Winchester')).toBeInTheDocument();
      expect(await screen.findByText('Sam Winchester')).toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    test('Click Deselect all button clears selection', async () => {
      const mockGetCharacterById = vi.mocked(supernaturalApi.getCharacterById);
      mockGetCharacterById.mockResolvedValueOnce(mockCharacters[0]);
      mockGetCharacterById.mockResolvedValueOnce(mockCharacters[1]);

      const store = configureStore({
        reducer: {
          selectedCards: selectedCardsReducer
        },
        preloadedState: {
          selectedCards: { selectCards: ['1', '2'] }
        }
      });

      renderWithProviders(<SelectedItems />, { store });

      const deselectButton = await screen.findByRole('button', { name: 'Deselect all' });
      
      expect(store.getState().selectedCards.selectCards).toEqual(['1', '2']);
      
      await deselectButton.click();
      
      expect(store.getState().selectedCards.selectCards).toEqual([]);
    });

    test('Click Download button triggers CSV download', async () => {
      const mockGetCharacterById = vi.mocked(supernaturalApi.getCharacterById);
      mockGetCharacterById.mockResolvedValueOnce(mockCharacters[0]);
      mockGetCharacterById.mockResolvedValueOnce(mockCharacters[1]);

      const store = configureStore({
        reducer: {
          selectedCards: selectedCardsReducer
        },
        preloadedState: {
          selectedCards: { selectCards: ['1', '2'] }
        }
      });

      renderWithProviders(<SelectedItems />, { store });

      const downloadButton = await screen.findByRole('button', { name: 'Download' });
      await downloadButton.click();
      
      await waitFor(() => {
        expect(downloadCSV.default).toHaveBeenCalledTimes(1);
        expect(downloadCSV.default).toHaveBeenCalledWith(mockCharacters);
      });
    });
  });
});