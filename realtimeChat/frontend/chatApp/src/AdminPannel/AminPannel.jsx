import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Menu, Users, Box, Bell, Settings, LogOut, ChevronLeft, 
  ChevronRight, Activity, DollarSign, ShoppingCart, UserPlus 
} from 'lucide-react';
import axios from 'axios';

// Alert Component
const Alert = ({ type, title, message, onClose, autoClose = true, duration = 5000 }) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const colors = {
    success: 'bg-green-100 border-green-500 text-green-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    error: 'bg-red-100 border-red-500 text-red-700'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 p-4 rounded-lg border ${colors[type]} shadow-lg max-w-md z-50`}
    >
      <h4 className="font-bold mb-1">{title}</h4>
      <p>{message}</p>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    </motion.div>
  );
};

// Login Component
const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleLogin = async () => {
    const payload = { email, password };
    
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/login`,
        payload,
        { withCredentials: true }
      );
      
      if (res.status === 200) {
        setAlert({
          type: 'success',
          title: 'Success',
          message: 'Login successful!'
        });
        setTimeout(() => onLoginSuccess(), 1000);
      }
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Login failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gray-100"
    >
      <AnimatePresence>
        {alert && (
          <Alert {...alert} onClose={() => setAlert(null)} />
        )}
      </AnimatePresence>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block mr-2"
                />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Main Dashboard Component
const Dashboard = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications] = useState([
    { id: 1, text: 'New user registration', time: '5m ago', type: 'info' },
    { id: 2, text: 'Server update completed', time: '1h ago', type: 'success' },
    { id: 3, text: 'Payment processed', time: '2h ago', type: 'success' },
  ]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Box },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color} bg-opacity-10 mr-4`}>
            <Icon className={color.replace('bg-', 'text-')} size={24} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">{label}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
        {trend && (
          <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/logout`, 
        { withCredentials: true }
      );
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div 
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 80 }}
        className="bg-white shadow-lg z-20"
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold"
            >
              Admin Panel
            </motion.h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-4 hover:bg-gray-50 transition-colors ${
                activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-4"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-4 w-full flex items-center p-4 text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          {sidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-4"
            >
              Logout
            </motion.span>
          )}
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h2>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  icon={Users} 
                  label="Total Users" 
                  value="1,234" 
                  trend={12} 
                  color="bg-blue-500"
                />
                <StatCard 
                  icon={DollarSign} 
                  label="Revenue" 
                  value="$45,678" 
                  trend={8} 
                  color="bg-green-500"
                />
                <StatCard 
                  icon={ShoppingCart} 
                  label="Orders" 
                  value="892" 
                  trend={-3} 
                  color="bg-purple-500"
                />
                <StatCard 
                  icon={UserPlus} 
                  label="New Users" 
                  value="38" 
                  trend={24} 
                  color="bg-yellow-500"
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-gray-800">{notification.text}</p>
                        <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {notification.type}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">User Management</h3>
              {/* Add user management content here */}
            </div>
          )}

          {/* Add other tab contents similarly */}
        </main>
      </div>
    </div>
  );
};

// Main App Component
const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="h-screen">
      {!isLoggedIn ? (
        <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <Dashboard onLogout={() => setIsLoggedIn(false)} />
      )}
    </div>
  );
};

export default AdminPanel;