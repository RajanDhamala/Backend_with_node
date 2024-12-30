import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  className = '', 
  onClose, 
  autoClose = true, 
  duration = 5000 // 5 seconds
}) => {
  const alertStyles = {
    success: 'bg-green-600 text-white shadow-lg shadow-green-500/20',
    error: 'bg-red-600 text-white shadow-lg shadow-red-500/20',
    warning: 'bg-amber-500 text-white shadow-lg shadow-amber-500/20',
    info: 'bg-blue-600 text-white shadow-lg shadow-blue-500/20',
  };

  const icons = {
    success: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    error: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    warning: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    info: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  };

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [autoClose, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 200, damping: 20 }}
      className={`fixed top-4 right-4 z-50 w-96 ${className}`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`rounded-lg p-4 ${alertStyles[type]}`}
      >
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            {icons[type]}
          </motion.div>
          <div className="flex-1 min-w-0">
            {title && (
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-base font-semibold mb-1"
              >
                {title}
              </motion.h3>
            )}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm opacity-90"
            >
              {message}
            </motion.p>
          </div>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Alert;
