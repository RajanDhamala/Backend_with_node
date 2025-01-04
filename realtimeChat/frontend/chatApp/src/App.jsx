import { BrowserRouter, Route, Routes, useLocation, useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LogIn, UserPlus, User, MessageSquare, Brain, Search, LogOut, Home } from "lucide-react";
import axios from "axios";
import UserLogin from "./componnets/UserLogin";
import UserRegister from "./componnets/UserRegister";
import OtpComponent from "./componnets/OtpComponent";
import ChatApp from "./componnets/ChatApp";
import AiAnalysis from "./Shocket/AiAnalysis";
import SearchUser from "./componnets/SearchUser";
import UserProfileCard from "./profile/UserProfileCard";
import { useState } from "react";

function MobileMenu({ isOpen, onClose, LogoutUser, navigate }) {
  const menuItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Login", path: "/login", icon: LogIn },
    { name: "Register", path: "/register", icon: UserPlus },
    { name: "Profile", path: "/UserProfile", icon: User },
    { name: "Chat", path: "/ChatApp", icon: MessageSquare },
    { name: "AI Analysis", path: "/aiAnalysis", icon: Brain },
    { name: "Search Users", path: "/searchUser", icon: Search },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          />

          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              duration: 0.3,
            }}
            className="fixed right-0 top-0 h-full w-72 bg-white shadow-2xl z-50 md:hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Dashboard</h2>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full p-2"
                >
                  <X size={24} />
                </motion.button>
              </div>
            </div>

            <nav className="py-4">
              {menuItems.map((item) => (
                <motion.button
                  key={item.path}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className="w-full text-left px-6 py-4 hover:bg-blue-50 transition-all duration-200 flex items-center space-x-4 group"
                >
                  <item.icon
                    size={20}
                    className="text-blue-600 group-hover:scale-110 transition-transform duration-200"
                  />
                  <span className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                    {item.name}
                  </span>
                </motion.button>
              ))}

              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  LogoutUser();
                  onClose();
                }}
                className="w-full text-left px-6 py-4 hover:bg-red-50 transition-all duration-200 flex items-center space-x-4 group mt-4 border-t border-gray-100"
              >
                <LogOut
                  size={20}
                  className="text-red-600 group-hover:scale-110 transition-transform duration-200"
                />
                <span className="text-red-600 group-hover:text-red-700 transition-colors duration-200">
                  Logout
                </span>
              </motion.button>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
    { name: "Profile", path: "/UserProfile" },
    { name: "Chat", path: "/ChatApp" },
    { name: "AI Analysis", path: "/aiAnalysis" },
    { name: "Search Users", path: "/searchUser" },
  ];

  const LogoutUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/logout", {
        withCredentials: true,
      });
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                ChatVerse
              </h1>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    className="relative px-5 py-2"
                    whileHover="hover"
                    initial="initial"
                  >
                    <span className={`relative z-10 ${
                      location.pathname === item.path 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-600'
                    }`}>
                      {item.name}
                    </span>
                    
                    {/* Hover background */}
                    <motion.div
                      className="absolute inset-0 bg-blue-50 rounded-lg -z-0"
                      initial={{ opacity: 0, scale: 0.95 }}
                      variants={{
                        hover: { opacity: 1, scale: 1 },
                        initial: { opacity: 0, scale: 0.95 }
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    
                    {/* Underline effect */}
                    <motion.div
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: location.pathname === item.path ? 1 : 0 }}
                      variants={{
                        hover: { scaleX: 1 },
                        initial: { scaleX: 0 }
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                </Link>
              ))}

              <motion.button
                onClick={LogoutUser}
                className="relative px-5 py-2 text-red-600"
                whileHover="hover"
                initial="initial"
              >
                <span className="relative z-10">Logout</span>
                <motion.div
                  className="absolute inset-0 bg-red-50 rounded-lg -z-0"
                  initial={{ opacity: 0, scale: 0.95 }}
                  variants={{
                    hover: { opacity: 1, scale: 1 },
                    initial: { opacity: 0, scale: 0.95 }
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            </nav>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu size={24} className="text-blue-600" />
            </motion.button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        LogoutUser={LogoutUser}
        navigate={navigate}
      />

      <main className="">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/register" element={<UserRegister />} />
              <Route path="/UserProfile" element={<UserProfileCard />} />
              <Route path="/Otp" element={<OtpComponent />} />
              <Route path="/ChatApp" element={<ChatApp />} />
              <Route path="/aiAnalysis" element={<AiAnalysis />} />
              <Route path="/searchUser" element={<SearchUser />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
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