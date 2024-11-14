import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import otpRequest from './otp/otpRequest'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
