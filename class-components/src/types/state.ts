import { store } from '../store/store';

type CardId = string;

export interface InitialState {
  selectCards: CardId[];
}

export type RootState = ReturnType<typeof store.getState>;