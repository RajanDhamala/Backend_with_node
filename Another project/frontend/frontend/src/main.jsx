import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './Login'
import Ui from './Ui'
import GetJokes from './componnets/GetJokes'
import RegisterUser from './componnets/RegisterUser'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RegisterUser />
  </StrictMode>,
)
