import { apiConfig } from "../config/api"
import type { Character } from "../types/characters";

export const supernaturalApi = {
  fetchAllCharacters: async (page: number = 1) => {
    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.characters}?page=${page}&size=${apiConfig.defaultPageSize}`);
    
    if (!response.ok) throw new Error ('Failed to fetch all users');
    
    return response.json();
  },

  searchCharacter: async (query: string, page: number = 1) => { 
    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.characters}?name=${query.trim()}&page=${page}&size=${apiConfig.defaultPageSize}`);

    if (!response.ok) throw new Error ('Failed to search');

    return response.json();
  },

  getCharacterById: async (id: string): Promise<Character> => {
    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.characters}/${id}`);
    
    return response.json();
  }
}