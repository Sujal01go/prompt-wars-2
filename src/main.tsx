import React from 'react'
import ReactDOM from 'react-dom/client'
import { AeroProvider } from './context/AeroContext.tsx'
import { App } from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AeroProvider>
        <App />
      </AeroProvider>
    </React.StrictMode>
  )
}
