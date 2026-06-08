import './styles/reset.css';
import './styles/global.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import MainPage from './pages/Main/main';
import { store } from './stores/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <MainPage />
    </Provider>
  </StrictMode>
);
