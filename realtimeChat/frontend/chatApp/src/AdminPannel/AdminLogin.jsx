import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; 
import Alert from '../AiComps/Alert'; // Assuming you have an Alert component

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handelLogin = async () => {
    const payload = { email, password };

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/login`, 
        payload,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setMessage("Login successful!");
        setAlert({
          type: 'success',
          title: 'Success',
          message: res.data.message || 'Login successful!',
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "An error occurred");
        setAlert({
          type: 'warning',
          title: 'Warning',
          message: error.response.data.message || "An error occurred",
        });
      } else {
        setMessage("Something went wrong!");
        setAlert({
          type: 'error',
          title: 'Error',
          message: 'Something went wrong!',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen flex items-center justify-center bg-gray-100"
    >
      <AnimatePresence>
        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
            autoClose={true}
            duration={5000}
          />
        )}
      </AnimatePresence>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Panel Login</h2>

        <motion.input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <motion.input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full p-3 mb-6 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <motion.button
          onClick={handelLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200"
        >
          {loading ? "Loading..." : "Login"}
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`mt-4 text-center text-sm font-medium ${message.includes("failed") ? "text-red-500" : "text-green-500"}`}
        >
          {message}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;
