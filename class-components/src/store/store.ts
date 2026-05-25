import { configureStore } from '@reduxjs/toolkit';
import selectedCardsReducer from './slices/selectCards';

export const store = configureStore({
  reducer: {
    selectedCards: selectedCardsReducer
  }
})