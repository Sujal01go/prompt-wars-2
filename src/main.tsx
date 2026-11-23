import React from 'react'
import ReactDOM from 'react-dom/client'
import { AeroProvider } from './context/AeroContext.tsx'
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx'
import { App } from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <AeroProvider>
          <App />
        </AeroProvider>
      </ErrorBoundary>
    </React.StrictMode>
  )
}
