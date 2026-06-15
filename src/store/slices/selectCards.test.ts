import { describe, test, expect } from "vitest";
import selectCardsReducer, { toggleSelectCard, clearSelected } from "./selectCards";
import type { InitialState } from "../../types/state";

describe('selectCards slice', () => {
  const initialState: InitialState = {
    selectCards: []
  };

  describe('toggleSelectCard', () => {
    test('adds id to selectCards when id does not exist', () => {
      const action = toggleSelectCard('1');
      const newState = selectCardsReducer(initialState, action);

      expect(newState.selectCards).toEqual(['1']);
    });

    test('adds multiple ids to selectCards', () => {
      let state = selectCardsReducer(initialState, toggleSelectCard('1'));
      state = selectCardsReducer(state, toggleSelectCard('2'));
      state = selectCardsReducer(state, toggleSelectCard('3'));

      expect(state.selectCards).toEqual(['1', '2', '3']);
    });

    test('removes id from selectCards when id already exists', () => {
      const stateWithId: InitialState = {
        selectCards: ['1', '2', '3']
      };
      
      const action = toggleSelectCard('2');
      const newState = selectCardsReducer(stateWithId, action);

      expect(newState.selectCards).toEqual(['1', '3']);
    });

    test('toggles same id back and forth correctly', () => {
      let state = selectCardsReducer(initialState, toggleSelectCard('1'));
      expect(state.selectCards).toEqual(['1']);
      
      state = selectCardsReducer(state, toggleSelectCard('1'));
      expect(state.selectCards).toEqual([]);
      
      state = selectCardsReducer(state, toggleSelectCard('1'));
      expect(state.selectCards).toEqual(['1']);
    });

    test('handles non-existent id removal gracefully', () => {
      const stateWithId: InitialState = {
        selectCards: ['1', '2']
      };
      
      const action = toggleSelectCard('3');
      const newState = selectCardsReducer(stateWithId, action);

      expect(newState.selectCards).toEqual(['1', '2', '3']);
    });
  });

  describe('clearSelected', () => {
    test('clears all selected cards', () => {
      const stateWithIds: InitialState = {
        selectCards: ['1', '2', '3', '4', '5']
      };
      
      const action = clearSelected();
      const newState = selectCardsReducer(stateWithIds, action);

      expect(newState.selectCards).toEqual([]);
    });

    test('clears empty array does nothing', () => {
      const action = clearSelected();
      const newState = selectCardsReducer(initialState, action);

      expect(newState.selectCards).toEqual([]);
    });

    test('clears after multiple toggles', () => {
      let state = selectCardsReducer(initialState, toggleSelectCard('1'));
      state = selectCardsReducer(state, toggleSelectCard('2'));
      state = selectCardsReducer(state, toggleSelectCard('3'));
      
      expect(state.selectCards).toEqual(['1', '2', '3']);
      
      state = selectCardsReducer(state, clearSelected());
      
      expect(state.selectCards).toEqual([]);
    });
  });

  describe('Initial state', () => {
    test('returns initial state when action type is unknown', () => {
      const unknownAction = { type: 'unknown/action' };
      const state = selectCardsReducer(undefined, unknownAction);

      expect(state).toEqual(initialState);
      expect(state.selectCards).toEqual([]);
    });

    test('initial state has empty selectCards array', () => {
      expect(initialState.selectCards).toEqual([]);
      expect(initialState.selectCards.length).toBe(0);
    });
  });

  describe('Edge cases', () => {
    test('handles undefined payload gracefully', () => {
      const action = toggleSelectCard(undefined);
      const newState = selectCardsReducer(initialState, action);

      expect(newState.selectCards).toEqual([undefined]);
    });
  });
});