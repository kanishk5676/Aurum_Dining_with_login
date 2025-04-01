import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import bgImage from "/images/hk-background.png";

const UpdateOrDeleteOrder = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Confirmation dialog state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteType, setDeleteType] = useState("reservation");
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Function to handle search and fetch orders based on phone number
  const handleSearchOrders = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError("");
    setSearchPerformed(true);

    try {
      // Connect to the backend API endpoint
      const response = await axios.get(`http://localhost:5001/orders-by-phone/${phoneNumber}`);
      
      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("There was an error fetching your orders. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to initialize the delete confirmation
  const confirmDelete = (order) => {
    setOrderToDelete(order);
    setDeleteType(order.items ? "takeaway order" : "reservation");
    setShowConfirmation(true);
  };

  // Function to cancel delete operation
  const cancelDelete = () => {
    setShowConfirmation(false);
    setOrderToDelete(null);
  };

  // Function to handle confirmed delete
  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    
    setLoading(true);
    try {
      // Determine endpoint based on order type
      const endpoint = orderToDelete.items 
        ? `http://localhost:5001/takeaway/${orderToDelete.orderId}`
        : `http://localhost:5001/reservation/${orderToDelete.orderId}`;
      
      const response = await axios.delete(endpoint);
      
      if (response.status === 200) {
        // Remove the deleted order from the local state
        setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderToDelete.orderId));
      } else {
        throw new Error("Failed to cancel the order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      setError("There was an error cancelling your order. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirmation(false);
      setOrderToDelete(null);
    }
  };

  // Function to handle update order
  const handleUpdateOrder = async (order) => {
    try {
      // Store selected tables in localStorage before navigating
      localStorage.setItem("updateOrderData", JSON.stringify({
        orderId: order.orderId,
        fullName: order.fullName,
        phone: order.phone,
        email: order.email,
        date: order.date,
        time: order.time,
        guests: order.guests,
        tables: order.tables,
        isUpdate: true
      }));
      
      // FIXED: Don't delete the existing reservation here
      // Just navigate to the table reservation page with the required state
      navigate("/reserve-table", {
        state: {
          date: order.date,
          time: order.time,
          isUpdateMode: true
        }
      });
    } catch (error) {
      console.error("Error preparing for update:", error);
      setError("There was an error updating your reservation. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-black/70 p-8 rounded-t-lg text-white text-center mb-6">
          <h1 className="text-4xl font-bold mb-4">Manage Your Orders</h1>
          <p className="text-lg text-gray-300 mb-6">View, update, or cancel your reservations.</p>
          
          {/* Phone Number Search Input */}
          <div className="max-w-md mx-auto">
            <label className="block text-left text-gray-300 mb-2">Enter Your Phone Number:</label>
            <div className="flex">
              <input
                type="text"
                className="flex-grow p-3 border rounded-l-md text-black"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
              />
              <button
                onClick={handleSearchOrders}
                className="px-6 py-3 bg-[#B8860B] text-black font-bold rounded-r-md hover:bg-[#8B6508] transition-colors"
                disabled={loading}
              >
                {loading ? "Searching..." : "Find Orders"}
              </button>
            </div>
            {error && <p className="text-red-500 mt-2 text-left">{error}</p>}
          </div>
        </div>

        {/* Results Section */}
        {loading && !showConfirmation ? (
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg text-white text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B8860B]"></div>
            </div>
            <p className="mt-4">Loading your orders...</p>
          </div>
        ) : searchPerformed && (
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-b-lg text-white">
            {orders.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-[#B8860B]">
                  Your Orders ({orders.length})
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-black/30">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-md">Order ID</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Date & Time</th>
                        <th className="px-4 py-3">Tables</th>
                        <th className="px-4 py-3 rounded-tr-md">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <motion.tr 
                          key={order.orderId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={index % 2 === 0 ? "bg-black/20" : "bg-black/10"}
                        >
                          <td className="px-4 py-3 border-b border-gray-700">#{order.orderId}</td>
                          <td className="px-4 py-3 border-b border-gray-700">{order.fullName}</td>
                          <td className="px-4 py-3 border-b border-gray-700">
                            {order.date} at {order.time}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-700">
                            {order.tables ? order.tables.join(", ") : "N/A"}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-700">
                            <div className="flex space-x-2">
                              {!order.items && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleUpdateOrder(order)}
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                >
                                  Update
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => confirmDelete(order)}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                              >
                                Cancel
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-xl font-medium">No Orders Found</h3>
                <p className="mt-2 text-gray-400">We couldn't find any orders associated with this phone number.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Confirmation Dialog */}
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
    </div>
  );
};

export default UpdateOrDeleteOrder;