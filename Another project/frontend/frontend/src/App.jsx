import { useState } from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './componnets/Dashboard';

import RegisterUser from './componnets/RegisterUser';
import UploadImg from './componnets/UploadImg';
import LoginForm from './componnets/LoginForm';

function App() {
  return (
    <Router>
      <div>
        <div className="flex gap-3 justify-between mx-10 mt-5">
          <Link to="/register" className='hover:underline'>Register User</Link>
          <Link to="/upload" className='hover:underline'>Upload Profile Pic</Link>
          <Link to="/login" className='hover:underline'>Login</Link>
          <Link to="/dashboard" className='hover:underline'>dashboard</Link>
        </div>
        <Routes>
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/upload" element={<UploadImg />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
