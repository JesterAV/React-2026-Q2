import { createSlice } from "@reduxjs/toolkit";
import type { InitialState } from "../../types/state";

const initialState: InitialState = {
  selectCards: []
}

const selectCardsSlice = createSlice({
  name: 'selectCards',
  initialState,
  reducers: {
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

export const { toggleSelectCard, clearSelected } = selectCardsSlice.actions;

export default selectCardsSlice.reducer;