import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import bgImage from "/images/hk-background.png";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reservations');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get user data from localStorage (as stored by Login.jsx)
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      navigate('/login');
      return;
    }
    
    try {
      // Parse the user data object
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Fetch orders using the phone from the parsed user object
      if (parsedUser && parsedUser.phone) {
        fetchUserData(parsedUser.phone);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);
  
  const fetchUserData = async (phone) => {
    try {
      const response = await axios.get(`http://localhost:5001/orders-by-phone/${phone}`);
      
      // Separate reservations and takeaway orders
      const fetchedReservations = response.data.filter(order => order.tables);
      const fetchedOrders = response.data.filter(order => order.items);
      
      setReservations(fetchedReservations);
      setOrders(fetchedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const cancelOrder = async (orderId, isReservation) => {
    try {
      await axios.delete(`http://localhost:5001/reservation/${orderId}`);
      
      // Update the local state
      if (isReservation) {
        setReservations(reservations.filter(res => res.orderId !== orderId));
      } else {
        setOrders(orders.filter(order => order.orderId !== orderId));
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-white text-xl">User data not found. Please <a href="/login" className="text-yellow-500 underline">login</a> again.</div>
      </div>
    );
  }
  
  return (
    <div
      className="min-h-screen bg-repeat bg-[length:100px_100px] bg-center px-8 pt-24 pb-12"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-6xl mx-auto">
        {/* User Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">{user.fullName}'s Profile</h1>
            <p className="text-xl text-gray-300">Mobile: {user.phone}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 md:mt-0 px-6 py-3 bg-red-600 text-white text-lg rounded-md hover:bg-red-700"
            onClick={handleLogout}
          >
            Sign Out
          </motion.button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-6 py-3 text-xl font-semibold ${
              activeTab === 'reservations' 
                ? 'text-yellow-500 border-b-2 border-yellow-500' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('reservations')}
          >
            Table Reservations
          </button>
          <button
            className={`px-6 py-3 text-xl font-semibold ${
              activeTab === 'orders' 
                ? 'text-yellow-500 border-b-2 border-yellow-500' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Takeaway Orders
          </button>
        </div>
        
        {/* Content Area */}
        <div className="bg-black bg-opacity-75 rounded-lg p-6 shadow-xl">
          {activeTab === 'reservations' && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-white">Your Table Reservations</h2>
              {reservations.length > 0 ? (
                <div className="space-y-6">
                  {reservations.map((reservation) => (
                    <div 
                      key={reservation.orderId} 
                      className="bg-gray-900 rounded-lg p-5 border-l-4 border-blue-500"
                    >
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            Reservation #{reservation.orderId.substring(0, 8)}
                          </h3>
                          <p className="text-gray-300">
                            <span className="font-medium">Date:</span> {formatDate(reservation.date)}
                          </p>
                          <p className="text-gray-300">
                            <span className="font-medium">Time:</span> {reservation.time}
                          </p>
                          <p className="text-gray-300">
                            <span className="font-medium">Guests:</span> {reservation.guests}
                          </p>
                          
                          <div className="mt-3">
                            <p className="font-medium text-white mb-1">Selected Tables:</p>
                            <div className="flex flex-wrap gap-2">
                              {reservation.tables.map((table, i) => (
                                <span 
                                  key={i} 
                                  className="bg-blue-900 text-blue-100 px-3 py-1 rounded-full text-sm"
                                >
                                  Table {table}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            onClick={() => cancelOrder(reservation.orderId, true)}
                          >
                            Cancel Reservation
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-400">You don't have any active table reservations.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 px-6 py-3 bg-yellow-500 text-black font-bold rounded-md hover:bg-yellow-600"
                    onClick={() => navigate('/select-date-time')}
                  >
                    Make a Reservation
                  </motion.button>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'orders' && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-white">Your Takeaway Orders</h2>
              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div 
                      key={order.orderId} 
                      className="bg-gray-900 rounded-lg p-5 border-l-4 border-yellow-500"
                    >
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            Order #{order.orderId.substring(0, 8)}
                          </h3>
                          <p className="text-gray-300">
                            <span className="font-medium">Date:</span> {formatDate(order.createdAt)}
                          </p>
                          <p className="text-gray-300">
                            <span className="font-medium">Delivery Address:</span> {order.address}
                          </p>
                          
                          <div className="mt-3">
                            <p className="font-medium text-white mb-1">Items:</p>
                            <ul className="list-disc list-inside text-gray-300">
                              {order.items.map((item, i) => (
                                <li key={i}>
                                  {item.quantity}x {item.name} - ₹{item.price.toFixed(2)}
                                </li>
                              ))}
                            </ul>
                            
                            <div className="mt-3 pt-3 border-t border-gray-700">
                              <p className="text-gray-300">
                                <span className="font-medium">Subtotal:</span> ₹{order.subtotal.toFixed(2)}
                              </p>
                              <p className="text-gray-300">
                                <span className="font-medium">Delivery:</span> ₹{order.deliveryCharge.toFixed(2)}
                              </p>
                              <p className="text-gray-300">
                                <span className="font-medium">Tax:</span> ₹{(order.tax + (order.acTax || 0) + (order.gst || 0)).toFixed(2)}
                              </p>
                              <p className="text-white font-bold mt-1">
                                Total: ₹{order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            onClick={() => cancelOrder(order.orderId, false)}
                          >
                            Cancel Order
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-400">You don't have any active takeaway orders.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 px-6 py-3 bg-yellow-500 text-black font-bold rounded-md hover:bg-yellow-600"
                    onClick={() => navigate('/order-takeaway')}
                  >
                    Order Takeaway
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;