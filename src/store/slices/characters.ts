import { createSlice } from "@reduxjs/toolkit";
import { SelectedCharacters } from "../../types/state";

const initialState: SelectedCharacters = {
    selectedCharacters: []
}

const selectedCharactersSlice = createSlice({
  name: 'selectedCharacters',
  initialState,
  reducers: {
      toggleSelectCharacter: (state, action) => {
        const exists = state.selectedCharacters.some(character => character.id === action.payload.id);
      
        if (exists) {
          state.selectedCharacters = state.selectedCharacters.filter(character => character.id !== action.payload.id);
        } else {
          state.selectedCharacters.push(action.payload);
        }
      },

      clearSelectedCharacters: (state) => {
        state.selectedCharacters = [];
      }
  }
})

export const {toggleSelectCharacter, clearSelectedCharacters} = selectedCharactersSlice.actions;

export default selectedCharactersSlice.reducer;