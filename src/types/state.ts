import { store } from '../store/store';
import { Character } from './characters';

type CardId = string;

export interface InitialState {
  selectCards: CardId[];
}

export type RootState = ReturnType<typeof store.getState>;

export interface SelectedCharacters {
  selectedCharacters: Character[];
}