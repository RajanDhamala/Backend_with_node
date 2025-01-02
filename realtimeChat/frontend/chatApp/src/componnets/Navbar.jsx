import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
  { to: '/UserProfile', label: 'Profile' },
  { to: '/Otp', label: 'OTP' },
  { to: '/ChatApp', label: 'ChatShocket' },
  { to: '/aiAnalysis', label: 'AI Analysis' },
  { to: '/Sendrequest', label: 'Send Req' },
  { to: '/searchUser', label: 'Get Users' },
];

const NavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className="relative group">
      <span className={`${isActive ? 'text-blue-400' : 'text-white'} hover:text-blue-300 transition-colors duration-200`}>
        {label}
      </span>
      <motion.span
        className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400"
        initial={false}
        animate={{ scale: isActive ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </Link>
  );
};

const Navbar = ({ LogoutUser }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          MyApp
        </Link>
        <div className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} label={item.label} />
          ))}
          <button
            onClick={LogoutUser}
            className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="flex flex-col space-y-2 mt-4">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} label={item.label} />
              ))}
              <button
                onClick={LogoutUser}
                className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
