import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import bgImage from "/images/hk-background.png"; // Use existing background image

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin-dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };
  
  return (
    <div
      className="flex flex-col sm:flex-row items-start min-h-screen bg-repeat bg-[length:100px_100px] bg-center px-8 pt-24"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Left Side - Login Form */}
      <div className="flex flex-col w-full sm:w-1/2 mb-8 sm:mb-0">
        <h1 className="text-7xl font-bold mb-8 text-white">Admin Login</h1>
        
        {error && (
          <div className="bg-red-500 text-white p-4 mb-4 rounded-md text-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="flex flex-col">
          <label className="text-white text-3xl mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-4 border rounded-md mb-6 w-full sm:w-96 text-xl bg-black text-white"
            required
          />
          
          <label className="text-white text-3xl mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 border rounded-md mb-6 w-full sm:w-96 text-xl bg-black text-white"
            required
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 p-4 bg-yellow-500 text-black text-2xl rounded-md w-full sm:w-96 hover:bg-yellow-600"
            type="submit"
          >
            Sign In
          </motion.button>
        </form>
      </div>
      
      {/* Right Side - Decorative Image with Overlay */}
      <div className="flex flex-col items-center justify-center w-full sm:w-1/2 relative min-h-[500px]">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(/images/food1.jpg)` }}
        >
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-50 text-white p-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Admin Access</h2>
            <p className="text-lg">Manage reservations, orders, and more.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
