import { configureStore } from '@reduxjs/toolkit';
import selectedCardsReducer from './slices/selectCards';
import { supernaturalApi } from './api/supernaturalApi';

export const store = configureStore({
  reducer: {
    selectedCards: selectedCardsReducer,
    [supernaturalApi.reducerPath]: supernaturalApi.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(supernaturalApi.middleware)
  },
})