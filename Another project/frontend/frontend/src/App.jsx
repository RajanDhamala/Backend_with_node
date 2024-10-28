import { useState } from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './componnets/Dashboard';
import RegisterUser from './componnets/RegisterUser';
import UploadImg from './componnets/UploadImg';
import LoginForm from './componnets/LoginForm';
import UploadVideoPhoto from './componnets/UploadVideoPhoto';
import VideoGallery from './componnets/videoGallary';
import DoTwitterPost from './componnets/DotwitterPost';
import GetTweets from './componnets/GetTweets';

function App() {
  const handleLogout = async () => {
    const response = await fetch('http://localhost:8000/users/logout', {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      console.log("Logged out successfully");
      window.location.href = '/login';
    } else {
      console.error("Failed to logout");
    }
  };

  return (
    <Router>
      <div>
        <div className="flex gap-3 justify-between mx-10 mt-5">
          <Link to="/register" className='hover:underline'>Register User</Link>
          <Link to="/upload" className='hover:underline'>Upload Profile Pic</Link>
          <Link to="/login" className='hover:underline'>Login</Link>
          <Link to="/dashboard" className='hover:underline'>Dashboard</Link>
          <Link to="/uploadVideoPhoto" className='hover:underline'>Upload Video/Photo</Link>
          <Link to="/videos" className='hover:underline'>User Uploads</Link>
          <Link to="/doTwitterPost" className='hover:underline'>Do Twitter Post</Link>
          <Link to="/tweets" className='hover:underline'>Get Tweets</Link>
          <button
            onClick={handleLogout}
            className='bg-red-500 text-white h-5 w-16 px-2 flex items-center  rounded hover:bg-red-600'
          >
            Logout
          </button>
        </div>
        <Routes>
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/upload" element={<UploadImg />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/uploadVideoPhoto" element={<UploadVideoPhoto />} />
          <Route path="/videos" element={<VideoGallery />} />
          <Route path="/doTwitterPost" element={<DoTwitterPost />} />
          <Route path="/tweets" element={<GetTweets />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
