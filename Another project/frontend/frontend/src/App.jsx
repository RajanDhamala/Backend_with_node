import { useState } from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import RegisterUser from './componnets/RegisterUser';
import UploadImg from './componnets/UploadImg';

function App() {
  return (
    <Router>
      <div>
        <div className="flex gap-3 justify-between mx-10 mt-5">
          <Link to="/register" className='hover:underline'>Register User</Link>
          <Link to="/upload" className='hover:underline'>Upload Profile Pic</Link>
        </div>
        <Routes>
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/upload" element={<UploadImg />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
