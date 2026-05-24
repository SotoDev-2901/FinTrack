import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import { FinTrackApp } from './FinTrackApp'
import { AuthProvider } from './authentication/context/AuthProvider'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <HashRouter>
        <FinTrackApp />
      </HashRouter>
    </AuthProvider>
  </StrictMode>,
)
