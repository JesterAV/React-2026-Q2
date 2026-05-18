import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/reset.css'
import './styles/globals.css'
import './styles/variables.css'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import AppRouter from './router/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  </StrictMode>,
)