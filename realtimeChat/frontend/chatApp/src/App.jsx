import ChatUi from './componnets/ChatUi';
import UserLogin from './componnets/UserLogin';
import UserRegister from './componnets/UserRegister';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import axios from 'axios';
import OtpComponent from './componnets/OtpComponent';
import ChatApp from './componnets/ChatApp';
import AiAnalysis from './Shocket/AiAnalysis'
import SendFriendRequest from './componnets/SendFriendRequest';
import SearchUser from './componnets/SearchUser';
import UserProfileCard from './profile/UserProfileCard';



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
        <div className="flex space-x-4 p-4 bg-gray-200 justify-center text-lg flex-wrap">
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
          <Link to="/chat" className="text-blue-500 hover:underline">
            Chat
          </Link>
          <Link to="/" className='text-blue-500 hover:underline'>
          Register</Link>
          <Link to={'/UserProfile'} className='text-blue-500 hover:underline'>Profile</Link>
          <Link to={'/Otp'} className='text-blue-500 hover:underline'>Otp</Link>
          <Link to={'/ChatApp'} className='text-blue-500 hover:underline'>ChatShocket</Link>
          <Link to={'/aiAnalysis'} className='text-blue-500 hover:underline'>Ai Analysis</Link>
          <Link to={'/Sendrequest'} className='text-blue-500 hover:underline'>Send Req</Link>
          <Link to={'/searchUser'} className='text-blue-500 hover:underline'>Get usrs</Link>
         
          <button onClick={(e)=>LogoutUser()} className='bg-red-500 text-white rounded-md px-2 hover:bg-red-600 hover:scale-105'>Logout</button>
      

        </div>
        <Routes>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/chat" element={<ChatUi />} />
          <Route path="/" element={<UserRegister />} />
          <Route path='/UserProfile' element={<UserProfileCard/>}></Route>
          <Route path='/Otp' element={<OtpComponent/>}></Route>
          <Route path='/ChatApp' element={<ChatApp/>}></Route>
          <Route path='/Sendrequest' element={<SendFriendRequest/>}></Route>
          <Route path='/aiAnalysis' element={<AiAnalysis/>}></Route>
          <Route path='/searchUser' element={<SearchUser/>}></Route>
      
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
