import { describe, test, expect, vi, beforeEach } from "vitest";
import { supernaturalApi } from "./supernaturalApi";
import { apiConfig } from "../config/api";

describe('supernaturalApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  describe('fetchAllCharacters', () => {
    test('fetches characters with default page', async () => {
      const mockResponse = { results: [] };
      const mockFetch = vi.mocked(globalThis.fetch);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      } as Response);

      await supernaturalApi.fetchAllCharacters();

      expect(mockFetch).toHaveBeenCalledWith(
        `${apiConfig.baseUrl}${apiConfig.endpoints.characters}?page=1&size=${apiConfig.defaultPageSize}`
      );
    });

    test('throws error when fetch fails', async () => {
      const mockFetch = vi.mocked(globalThis.fetch);
      mockFetch.mockResolvedValue({
        ok: false
      } as Response);

      await expect(supernaturalApi.fetchAllCharacters()).rejects.toThrow('Failed to fetch all users');
    });
  });

  describe('searchCharacter', () => {
    test('searches characters with query', async () => {
      const mockResponse = { results: [] };
      const mockFetch = vi.mocked(globalThis.fetch);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      } as Response);

      await supernaturalApi.searchCharacter('Dean');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('name=Dean')
      );
    });

    test('throws error when search fails', async () => {
      const mockFetch = vi.mocked(globalThis.fetch);
      mockFetch.mockResolvedValue({
        ok: false
      } as Response);

      await expect(supernaturalApi.searchCharacter('Dean')).rejects.toThrow('Failed to search');
    });
  });

  describe('getCharacterById', () => {
    test('fetches character by id', async () => {
      const mockCharacter = { id: '1', name: 'Dean' };
      const mockFetch = vi.mocked(globalThis.fetch);
      mockFetch.mockResolvedValue({
        json: async () => mockCharacter
      } as Response);

      const result = await supernaturalApi.getCharacterById('1');

      expect(mockFetch).toHaveBeenCalledWith(
        `${apiConfig.baseUrl}${apiConfig.endpoints.characters}/1`
      );
      expect(result).toEqual(mockCharacter);
    });
  });
});