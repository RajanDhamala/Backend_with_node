import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, Loader2, LogIn, Key, UserPlus, User } from "lucide-react";
import Alert from '../AiComps/Alert';
import { useNavigate } from "react-router-dom";

function UserLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/login`,
        formData,
        { withCredentials: true }
      );
      if (response.data.statusCode === 200) {
        setAlert({
          type: "success",
          title: "Success!",
          message: response.data.message,
        });
        setIsSuccess(true);
      } else {
        setAlert({
          type: "error",
          title: "Login Failed",
          message: response.data.message || "An error occurred",
        });
        setIsSuccess(false);
      }
    } catch (err) {
      setAlert({
        type: "error",
        title: "Login Failed",
        message: err.response?.data?.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/UserProfile");
      }, 2000);

      return () => clearTimeout(timer); 
    }
  }, [isSuccess, navigate]);

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-blue-500"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="text-center text-white p-8 rounded-2xl bg-white/10"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{ duration: 1.5 }}
            className="mb-6"
          >
            <User className="w-20 h-20 mx-auto text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-lg text-white/80">Redirecting you to dashboard...</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/10"
        >
          <motion.div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="mb-4"
            >
              <LogIn className="w-16 h-16 mx-auto text-blue-400" />
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-300">Sign in to continue</p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="relative group"
              >
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 transition-colors group-focus-within:text-blue-300" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="relative group"
              >
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 transition-colors group-focus-within:text-blue-300" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </motion.div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-0 bg-white/5 text-blue-500 focus:ring-blue-500"
                />
                <span>Remember me</span>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center">
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign in
                </span>
              )}
            </motion.button>

            <div className="flex items-center justify-between text-sm text-gray-300">
              <Link to="/forgot-password" className="flex items-center hover:text-blue-400 transition-colors">
                <Key className="w-4 h-4 mr-1" />
                Forgot password?
              </Link>
              <Link to="/register" className="flex items-center hover:text-blue-400 transition-colors">
                <UserPlus className="w-4 h-4 mr-1" />
                Create account
              </Link>
            </div>
          </form>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserLogin;
