import { configureStore } from '@reduxjs/toolkit';
import selectedCardsReducer from './slices/selectCards';
import { supernaturalApi } from './api/supernaturalApi';
import selectedCharactsReducer from './slices/characters';

export const store = configureStore({
  reducer: {
    selectedCards: selectedCardsReducer,
    [supernaturalApi.reducerPath]: supernaturalApi.reducer,
    selectedCharacters: selectedCharactsReducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(supernaturalApi.middleware)
  },
})