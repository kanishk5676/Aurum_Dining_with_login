import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const UserRegistration = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(''); // Added email field
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      // Fix endpoint to match server.js
      const response = await axios.post('http://localhost:5001/api/register', {
        fullName,
        phone,
        email,
        password
      });
      
      if (response.data.success) {
        // Auto login after successful registration
        const loginResponse = await axios.post('http://localhost:5001/api/login', {
          phone,
          password
        });
        
        if (loginResponse.data.success) {
          localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
          navigate('/profile');
        } else {
          setError('Registration successful. Please log in.');
          navigate('/login');
        }
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'An error occurred while registering.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-start min-h-screen">
      {/* Left Side - Registration Form */}
      <div className="flex flex-col w-full sm:w-1/2 mb-8 sm:mb-0">
        <h1 className="text-5xl font-bold mb-6 text-white">Create Account</h1>
        
        {error && (
          <div className="bg-red-500 text-white p-4 mb-4 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="flex flex-col">
          <label className="text-white text-xl mb-2">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-3 border rounded-md mb-4 w-full sm:w-96 text-lg bg-black text-white"
            placeholder="Enter your full name"
            required
          />
          
          <label className="text-white text-xl mb-2">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 border rounded-md mb-4 w-full sm:w-96 text-lg bg-black text-white"
            placeholder="Enter your phone number"
            required
          />
          
          <label className="text-white text-xl mb-2">Email (Optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded-md mb-4 w-full sm:w-96 text-lg bg-black text-white"
            placeholder="Enter your email address"
          />
          
          <label className="text-white text-xl mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-md mb-4 w-full sm:w-96 text-lg bg-black text-white"
            placeholder="Create a password"
            required
          />
          
          <label className="text-white text-xl mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 border rounded-md mb-4 w-full sm:w-96 text-lg bg-black text-white"
            placeholder="Confirm your password"
            required
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 p-3 bg-yellow-500 text-black text-xl rounded-md w-full sm:w-96 hover:bg-yellow-600 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>
          
          <div className="mt-4 text-white">
            Already have an account? 
            <Link to="/login" className="text-yellow-500 hover:text-yellow-400 ml-2">
              Sign In
            </Link>
          </div>
        </form>
      </div>
      
      {/* Right Side - Decorative Image with Overlay */}
      <div className="flex flex-col items-center justify-center w-full sm:w-1/2 relative min-h-[500px]">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(/images/food2.jpg)` }}
        >
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-50 text-white p-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Join Us Today</h2>
            <p className="text-lg">Create an account to manage your orders and reservations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;