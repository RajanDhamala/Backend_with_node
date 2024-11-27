import ChatUi from './componnets/ChatUi';
import UserLogin from './componnets/UserLogin';
import UserRegister from './componnets/UserRegister';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import  UserProfile from './componnets/UserProfile';
import axios from 'axios';
import OtpComponent from './componnets/OtpComponent';
import ChatApp from './componnets/ChatApp';
import AiAnalysis from './Shocket/AiAnalysis'

function App() {
  const LogoutUser=()=>{
    axios.get('http://localhost:8000/api/logout',{withCredentials:true}).then((response)=>{
      alert(response.data.message)
    }).catch((err)=>{
      alert(err.response?.data?.message || "An error occurred.")
    })
  }
  return (
    <>
      <BrowserRouter>
        <div className="flex space-x-4 p-4 bg-gray-200 justify-center text-lg">
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
          <Link to="/chat" className="text-blue-500 hover:underline">
            Chat
          </Link>
          <Link to="/register" className='text-blue-500 hover:underline'>
          Register</Link>
          <Link to={'/UserProfile'} className='text-blue-500 hover:underline'>Profile</Link>
          <Link to={'/Otp'} className='text-blue-500 hover:underline'>Otp</Link>
          <Link to={'/ChatApp'} className='text-blue-500 hover:underline'>ChatShocket</Link>
          <Link to={'/aiAnalysis'} className='text-blue-500 hover:underline'>Ai Analysis</Link>
          <button onClick={(e)=>LogoutUser()} className='bg-red-500 text-white rounded-md px-2 hover:bg-red-600 hover:scale-105'>Logout</button>
         

        </div>
        <Routes>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/chat" element={<ChatUi />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path='/UserProfile' element={<UserProfile/>}></Route>
          <Route path='/Otp' element={<OtpComponent/>}></Route>
          <Route path='/ChatApp' element={<ChatApp/>}></Route>
          <Route path='/aiAnalysis' element={<AiAnalysis/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
