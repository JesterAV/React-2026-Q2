import { createSlice } from "@reduxjs/toolkit";
import type { InitialState } from "../../types/state";

const initialState: InitialState = {
  selectCards: []
}

const selectCardsSlice = createSlice({
  name: 'selectCards',
  initialState,
  reducers: {
    selectCard: (state, action) => {
      const id = action.payload;
      if (!state.selectCards.includes(id)) state.selectCards.push(id);
    },

    deselectCard: (state, action) => {
      const id = action.payload;
      state.selectCards = state.selectCards.filter(selectedCard => selectedCard !== id);
    },

    toggleSelectCard: (state, action) => {
      const id = action.payload;
      const exists = state.selectCards.includes(id);
      if (exists) {
        state.selectCards = state.selectCards.filter(selectCard => selectCard !== id);
      } else {
        state.selectCards.push(id);
      }
    },

    clearSelected: (state) => {
      state.selectCards = [];
    }
  }
})

export const { selectCard, deselectCard, toggleSelectCard, clearSelected } = selectCardsSlice.actions;

export default selectCardsSlice.reducer;