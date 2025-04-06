import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import bgImage from "/images/hk-background.png";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to profile
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Handle login
        const response = await axios.post('http://localhost:5001/api/login', {
          phone,
          password
        });

        if (response.data.success) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          navigate('/profile');
        } else {
          setError(response.data.message || 'Login failed');
        }
      } else {
        // Handle signup
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
            setError('Registration successful. Please login.');
            setIsLogin(true);
          }
        } else {
          setError(response.data.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-start min-h-screen bg-repeat bg-[length:100px_100px] bg-center px-8 pt-24"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Left Side - Login/Signup Form */}
      <div className="flex flex-col w-full sm:w-1/2 mb-8 sm:mb-0">
        <h1 className="text-7xl font-bold mb-8 text-white">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        
        {error && (
          <div className="bg-red-500 text-white p-4 mb-4 rounded-md text-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          {!isLogin && (
            <>
              <label className="text-white text-3xl mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="p-4 border rounded-md mb-6 w-full sm:w-96 text-xl bg-black text-white"
                required={!isLogin}
              />
            </>
          )}
          
          <label className="text-white text-3xl mb-2">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-4 border rounded-md mb-6 w-full sm:w-96 text-xl bg-black text-white"
            required
          />
          
          {!isLogin && (
            <>
              <label className="text-white text-3xl mb-2">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-4 border rounded-md mb-6 w-full sm:w-96 text-xl bg-black text-white"
              />
            </>
          )}
          
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
            disabled={loading}
            className={`mt-4 p-4 bg-yellow-500 text-black text-2xl rounded-md w-full sm:w-96 hover:bg-yellow-600 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            type="submit"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </motion.button>
          
          <div className="mt-4 text-white text-lg flex justify-between items-center w-full sm:w-96">
            <button
              type="button"
              onClick={toggleForm}
              className="text-yellow-500 hover:text-yellow-400 underline"
            >
              {isLogin ? 'Create an account' : 'Already have an account?'}
            </button>
            
            {isLogin && (
              <a 
                href="/admin-login" 
                className="text-gray-400 hover:text-gray-300 text-sm"
              >
                Admin Login
              </a>
            )}
          </div>
        </form>
      </div>
      
      {/* Right Side - Decorative Image with Overlay */}
      <div className="flex flex-col items-center justify-center w-full sm:w-1/2 relative min-h-[500px]">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(/images/food1.jpg)` }}
        >
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-50 text-white p-8 text-center">
            <h2 className="text-4xl font-bold mb-4">
              {isLogin ? 'Welcome Back!' : 'Join Aurum Dining'}
            </h2>
            <p className="text-lg">
              {isLogin 
                ? 'Sign in to access your reservations and orders.' 
                : 'Create an account to easily manage your reservations and orders.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;