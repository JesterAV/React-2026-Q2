import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectedCardsReducer from '../store/slices/selectCards';
import { ThemeProvider } from '../context/ThemeContext';

export function createTestStore(initialState = { selectedCards: { selectCards: [] } }) {
  return configureStore({
    reducer: {
      selectedCards: selectedCardsReducer
    },
    preloadedState: initialState
  });
}

interface ExtendedRenderOptions extends RenderOptions {
  store?: ReturnType<typeof createTestStore>;
  initialEntries?: string[];
}

export function renderWithProviders(
  ui: ReactElement,
  {
    store = createTestStore(),
    initialEntries = ['/'],
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </Provider>
    );
  }
  
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}