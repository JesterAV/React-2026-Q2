import type { FormAnswerToStore } from '../../types/form';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FormAnswersState {
  answers: FormAnswerToStore[];
}

const initialState: FormAnswersState = {
  answers: [],
};

const answersSlice = createSlice({
  name: 'answers',
  initialState,
  reducers: {
    saveAnswer: (
      state: FormAnswersState,
      action: PayloadAction<FormAnswerToStore>
    ) => {
      state.answers.push(action.payload);
    },
  },
});

export const { saveAnswer } = answersSlice.actions;
export default answersSlice.reducer;
