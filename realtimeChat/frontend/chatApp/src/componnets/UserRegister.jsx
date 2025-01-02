import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Mail, Lock, User, Calendar, ArrowRight, CheckCircle } from "lucide-react";
import Alert from '../AiComps/Alert';


function RegisterForm() {
  useEffect(()=>{
    
  },[])
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    birthDate: "",
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/register`,
        formData,
        { withCredentials: true }
      );
      console.log(response.data)

      if(response.data.statusCode===200){
        setAlert({
          type: 'success',
          title: 'Success!',
          message: 'Registration successful!'
        });
        setIsSuccess(true);
      }else{
        setAlert({
          type: 'error',
          title: 'Registration Failed',
          message: response.data.message || "An error occurred"
        })
      }
    } catch (err) {
      setAlert({
        type: 'error',
        title: 'Registration Failed',
        message: err.response?.data?.message || "An error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

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
          className="text-center text-white p-8 rounded-2xl"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ duration: 1.5 }}
            className="mb-6"
          >
            <CheckCircle className="w-20 h-20 mx-auto text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-4">Welcome Aboard!</h2>
          <p className="text-lg text-white/80">Your account has been created successfully.</p>
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
        <motion.div className="bg-white/5 rounded-2xl shadow-2xl p-8 border border-white/10">
          <motion.div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-4"
            >
              <User className="w-16 h-16 mx-auto text-blue-400" />
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="mt-2 text-gray-300">Join our community today</p>
          </motion.div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              {[
                { icon: User, type: "text", placeholder: "Username", name: "username" },
                { icon: Mail, type: "email", placeholder: "Email", name: "email" },
                { icon: Lock, type: "password", placeholder: "Password", name: "password" },
                { icon: Calendar, type: "date", placeholder: "Birth Date", name: "birthDate" }
              ].map((field, index) => (
                <motion.div 
                  key={field.name}
                  initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 transition-colors group-focus-within:text-blue-300" />
                  <input
                    type={field.type}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={field.placeholder}
                  />
                </motion.div>
              ))}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                <span className="flex items-center justify-center">
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              )}
            </motion.button>
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

export default RegisterForm;