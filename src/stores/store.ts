import { configureStore } from '@reduxjs/toolkit';
import answersReducer from './slices/formAnswersSlice';
import countryReducer from './slices/countriesSlice';

export const store = configureStore({
  reducer: {
    answers: answersReducer,
    countries: countryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
