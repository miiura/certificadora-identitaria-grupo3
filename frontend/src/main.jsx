import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './portal-ellp.css'
import App from './portal-ellp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
