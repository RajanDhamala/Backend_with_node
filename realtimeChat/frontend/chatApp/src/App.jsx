import { BrowserRouter, Route, Routes, Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import UserLogin from "./componnets/UserLogin";
import UserRegister from "./componnets/UserRegister";
import OtpComponent from "./componnets/OtpComponent";
import ChatApp from "./componnets/ChatApp";
import AiAnalysis from "./Shocket/AiAnalysis";
import SendFriendRequest from "./componnets/SendFriendRequest";
import SearchUser from './componnets/SearchUser';
import UserProfileCard from "./profile/UserProfileCard";

function AppContent() {
  const navigate = useNavigate(); 

  const LogoutUser = () => {
    axios
      .get("http://localhost:8000/api/logout", { withCredentials: true })
      .then((response) => {
        alert(response.data.message);
        navigate("/login");
      })
      .catch((err) => {
        alert(err.response?.data?.message || "An error occurred.");
      });
  };

  return (
    <div>
      <div className="flex space-x-4 p-4 bg-gray-200 justify-center text-lg flex-wrap">
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
        <Link to="/register" className="text-blue-500 hover:underline">
          Register
        </Link>
        <Link to="/UserProfile" className="text-blue-500 hover:underline">
          Profile
        </Link>
        <Link to="/Otp" className="text-blue-500 hover:underline">
          Otp
        </Link>
        <Link to="/ChatApp" className="text-blue-500 hover:underline">
          ChatShocket
        </Link>
        <Link to="/aiAnalysis" className="text-blue-500 hover:underline">
          Ai Analysis
        </Link>
        <Link to="/Sendrequest" className="text-blue-500 hover:underline">
          Send Req
        </Link>
        <Link to="/searchUser" className="text-blue-500 hover:underline">
          Get Users
        </Link>

        <button
          onClick={LogoutUser}
          className="bg-red-500 text-white rounded-md px-2 hover:bg-red-600 hover:scale-105"
        >
          Logout
        </button>
      </div>
      <Routes>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/UserProfile" element={<UserProfileCard />} />
        <Route path="/Otp" element={<OtpComponent />} />
        <Route path="/ChatApp" element={<ChatApp />} />
        <Route path="/Sendrequest" element={<SendFriendRequest />} />
        <Route path="/aiAnalysis" element={<AiAnalysis />} />
        <Route path="/searchUser" element={<SearchUser />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
