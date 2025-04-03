import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import ReservationsBarChart from './ReservationsBarChart'; 

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/');
    } else {
      fetchOrders();
      fetchReservations();
    }
  }, [navigate]);
  
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5001/admin/takeaway-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:5001/admin/reservations');
      setReservations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setLoading(false);
    }
  };
  
  const confirmDelete = (id, type) => {
    setItemToDelete(id);
    setDeleteType(type);
    setShowConfirmation(true);
  };
  
  const cancelDelete = () => {
    setShowConfirmation(false);
    setItemToDelete(null);
    setDeleteType('');
  };
  
  const handleOrderCancel = async () => {
    try {
      await axios.delete(`http://localhost:5001/admin/takeaway-orders/${itemToDelete}`);
      fetchOrders();
      setShowConfirmation(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };
  
  const handleReservationCancel = async () => {
    try {
      await axios.delete(`http://localhost:5001/admin/reservations/${itemToDelete}`);
      fetchReservations();
      setShowConfirmation(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };
  
  const handleConfirmDelete = () => {
    if (deleteType === 'order') {
      handleOrderCancel();
    } else if (deleteType === 'reservation') {
      handleReservationCancel();
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto pb-12 bg-black min-h-screen">
      <div className="flex justify-between items-center mb-6 pt-4">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          onClick={handleLogout}
        >
          Logout
        </motion.button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Takeaway Orders Section */}
        <div className="w-full lg:w-1/2 bg-black bg-opacity-90 rounded-lg border border-gray-800 shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-white">Takeaway Orders</h2>
          
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {orders.length > 0 ? (
              orders.map((order) => (
                <OrderCard 
                  key={order.orderId}
                  order={order}
                  onCancel={() => confirmDelete(order.orderId, 'order')}
                />
              ))
            ) : (
              <p className="text-gray-400 italic">No takeaway orders found</p>
            )}
          </div>
        </div>
        
        {/* Reservations Section */}
        <div className="w-full lg:w-1/2 bg-black bg-opacity-90 rounded-lg border border-gray-800 shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-white">Reservations</h2>
          
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {reservations.length > 0 ? (
              reservations.map((reservation) => (
                <ReservationCard 
                  key={reservation.orderId}
                  reservation={reservation}
                  onCancel={() => confirmDelete(reservation.orderId, 'reservation')}
                />
              ))
            ) : (
              <p className="text-gray-400 italic">No reservations found</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <ReservationsBarChart reservations={reservations} />
      </div>
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-white">Confirm Cancellation</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel this {deleteType}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                onClick={cancelDelete}
              >
                No, Keep It
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={handleConfirmDelete}
              >
                Yes, Cancel It
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderCard = ({ order, onCancel }) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow p-4 border-l-4 border-yellow-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-white">Order #{order.orderId.substring(0, 8)}</h3>
          <p className="text-sm text-gray-400">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
          onClick={onCancel}
        >
          Cancel
        </motion.button>
      </div>
      
      <div className="mt-3 text-gray-300">
        <p><span className="font-medium text-white">Customer:</span> {order.fullName}</p>
        <p><span className="font-medium text-white">Phone:</span> {order.phone}</p>
        <p><span className="font-medium text-white">Address:</span> {order.address}</p>
        
        <div className="mt-2">
          <h4 className="font-medium text-white">Items:</h4>
          <ul className="ml-4 mt-1">
            {order.items.map((item, index) => (
              <li key={index} className="text-sm">
                {item.quantity}x {item.name} - ₹{item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-2 border-t border-gray-700 pt-2">
          <p><span className="font-medium text-white">Subtotal:</span> ₹{order.subtotal.toFixed(2)}</p>
          <p><span className="font-medium text-white">Tax:</span> ₹{order.tax.toFixed(2)}</p>
          {order.acTax && <p><span className="font-medium text-white">AC Tax:</span> ₹{order.acTax.toFixed(2)}</p>}
          {order.gst && <p><span className="font-medium text-white">GST:</span> ₹{order.gst.toFixed(2)}</p>}
          <p><span className="font-medium text-white">Delivery:</span> ₹{order.deliveryCharge.toFixed(2)}</p>
          <p className="font-bold mt-1 text-white">Total: ₹{order.total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

// ReservationCard component
const ReservationCard = ({ reservation, onCancel }) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-white">Reservation #{reservation.orderId.substring(0, 8)}</h3>
          <p className="text-sm text-gray-400">
            {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
          onClick={onCancel}
        >
          Cancel
        </motion.button>
      </div>
      
      <div className="mt-3 text-gray-300">
        <p><span className="font-medium text-white">Customer:</span> {reservation.fullName}</p>
        <p><span className="font-medium text-white">Phone:</span> {reservation.phone}</p>
        <p><span className="font-medium text-white">Email:</span> {reservation.email}</p>
        <p><span className="font-medium text-white">Guests:</span> {reservation.guests}</p>
        
        <div className="mt-2">
          <h4 className="font-medium text-white">Tables:</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {reservation.tables.map((table, index) => (
              <span 
                key={index}
                className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded-full"
              >
                Table {table}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;