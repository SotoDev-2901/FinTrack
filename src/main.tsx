import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { FinTrackApp } from './FinTrackApp'
import { AuthProvider } from './authentication/context/AuthProvider'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <FinTrackApp />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
