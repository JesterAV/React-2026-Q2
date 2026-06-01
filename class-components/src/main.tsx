import './styles/reset.css'
import './styles/globals.css'
import './styles/variables.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import AppRouter from './router/router'
import { Provider } from 'react-redux';
import { store } from './store/store'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)