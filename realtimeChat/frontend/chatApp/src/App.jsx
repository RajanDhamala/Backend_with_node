import ChatUi from './componnets/ChatUi';
import UserLogin from './componnets/UserLogin';
import UserRegister from './componnets/UserRegister';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

function App() {
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
        </div>
        <Routes>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/chat" element={<ChatUi />} />
          <Route path="/register" element={<UserRegister />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
