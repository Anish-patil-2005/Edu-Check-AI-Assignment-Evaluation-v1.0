import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'
import App from './App.jsx'


export const server = 'http://localhost:8080';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
      <App />
      </AuthProvider>

  </StrictMode>
)
