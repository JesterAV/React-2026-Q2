import { apiConfig } from "../config/api"

export const supernaturalApi = {
  fetchAllCharacters: async () => {
    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.characters}?page=1&size=30`);
    
    if (!response.ok) throw new Error ('Failed to fetch all users');
    
    return response.json();
  },

  searchCharacter: async (query: string) => { 
    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.characters}?name=${query.trim()}`);

    if (!response.ok) throw new Error ('Failed to search');

    return response.json();
  }
}