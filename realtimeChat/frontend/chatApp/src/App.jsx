import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import Navbar from "./componnets/Navbar";
import UserLogin from './componnets/UserLogin';

import UserRegister from "./componnets/UserRegister";
import OtpComponent from "./componnets/OtpComponent";

import ChatApp from "./componnets/ChatApp";

import AiAnalysis from "./Shocket/AiAnalysis";
import SendFriendRequest from "./componnets/SendFriendRequest";
import SearchUser from "./componnets/SearchUser";
import UserProfileCard from "./profile/UserProfileCard";
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="min-h-screen bg-gray-100">
      <Navbar LogoutUser={LogoutUser} />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="container mx-auto mt-8 p-4"
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/UserProfile" element={<UserProfileCard />} />
            <Route path="/Otp" element={<OtpComponent />} />
            <Route path="/ChatApp" element={<ChatApp />} />
            <Route path="/Sendrequest" element={<SendFriendRequest />} />
            <Route path="/aiAnalysis" element={<AiAnalysis />} />
            <Route path="/searchUser" element={<SearchUser />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
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

