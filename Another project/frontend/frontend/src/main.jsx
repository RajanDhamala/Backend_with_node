import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './Login'
import Getdata from './Getdata'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Getdata />
  </StrictMode>,
)
