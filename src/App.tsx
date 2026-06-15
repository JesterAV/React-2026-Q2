import { StrictMode } from 'react'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import AppRouter from './router/router'
import { Provider } from 'react-redux';
import { store } from './store/store'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        </ThemeProvider>
      </Provider>
    </StrictMode>
  )
}