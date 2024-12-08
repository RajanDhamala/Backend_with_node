import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TrialUi from './componnets/TrialUi.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TrialUi />
  </StrictMode>,
)
