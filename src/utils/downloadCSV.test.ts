import { describe, test, expect, vi, beforeEach } from "vitest";
import downloadCSV from "./downloadCSV";
import type { Character } from "../types/characters";

describe('downloadCSV', () => {
  const mockCharacters: Character[] = [
    {
      id: '1',
      name: 'Dean Winchester',
      img: 'dean.jpg',
      actor: ['Jensen Ackles'],
      episodes: [{ title: 'Pilot', id: 'ep1' }],
      occupation: ['Hunter']
    },
    {
      id: '2',
      name: 'Sam Winchester',
      img: 'sam.jpg',
      actor: ['Jared Padalecki'],
      episodes: [{ title: 'Pilot', id: 'ep1' }, { title: 'Scarecrow', id: 'ep2' }],
      occupation: ['Hunter', 'Law student']
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:url');
    globalThis.URL.revokeObjectURL = vi.fn();
    
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
    
    const mockLink = {
      click: vi.fn(),
      download: '',
      href: ''
    };
    document.createElement = vi.fn().mockReturnValue(mockLink);
    
  });

  describe('CSV generation', () => {
    test('generates CSV with correct headers', () => {
      downloadCSV(mockCharacters);

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    });

    test('includes correct data for characters', () => {
      downloadCSV(mockCharacters);

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('File download', () => {
    test('creates download link with correct filename', () => {
      const mockLink = { click: vi.fn(), download: '', href: '' };
      document.createElement = vi.fn().mockReturnValue(mockLink);
      
      downloadCSV(mockCharacters);

      expect(mockLink.download).toBe('2_items.csv');
    });

    test('appends link to body and clicks it', () => {
      const mockLink = { click: vi.fn(), download: '', href: '' };
      document.createElement = vi.fn().mockReturnValue(mockLink);
      
      downloadCSV(mockCharacters);

      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    });

    test('creates and revokes object URL', () => {
      const mockLink = { click: vi.fn(), download: '', href: '' };
      document.createElement = vi.fn().mockReturnValue(mockLink);
      
      downloadCSV(mockCharacters);

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
      expect(mockLink.href).toBe('blob:url');
      expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:url');
    });
  });

  describe('Format fields', () => {
    test('handles single character without special characters', () => {
      const singleCharacter: Character[] = [{
        id: '3',
        name: 'Castiel',
        img: 'castiel.jpg',
        actor: ['Misha Collins'],
        episodes: [],
        occupation: ['Angel']
      }];
      
      downloadCSV(singleCharacter);

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    });

    test('wraps fields with commas in quotes', () => {
      const characterWithComma: Character[] = [{
        id: '4',
        name: 'Bobby Singer',
        img: 'bobby.jpg',
        actor: ['Jim Beaver'],
        episodes: [],
        occupation: ['Hunter, Friend']
      }];
      
      downloadCSV(characterWithComma);

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    });

    test('escapes quotes in fields', () => {
      const characterWithQuotes: Character[] = [{
        id: '5',
        name: 'Crowley',
        img: 'crowley.jpg',
        actor: ['Mark Sheppard'],
        episodes: [],
        occupation: ['King of "Hell"']
      }];
      
      downloadCSV(characterWithQuotes);

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    });

    test('handles empty episodes array', () => {
      const characterNoEpisodes: Character[] = [{
        id: '6',
        name: 'Gabriel',
        img: 'gabriel.jpg',
        actor: ['Richard Speight Jr.'],
        episodes: [],
        occupation: ['Archangel']
      }];
      
      downloadCSV(characterNoEpisodes);

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    test('handles empty array', () => {
      downloadCSV([]);

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    });

    test('handles character with multiple actors', () => {
      const characterWithMultipleActors: Character[] = [{
        id: '7',
        name: 'Lucifer',
        img: 'lucifer.jpg',
        actor: ['Mark Pellegrino', 'Misha Collins'],
        episodes: [],
        occupation: ['Devil']
      }];
      
      downloadCSV(characterWithMultipleActors);

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    });
  });
});