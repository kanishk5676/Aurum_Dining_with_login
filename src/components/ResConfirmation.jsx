import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import background from "/images/hk-background.png";

const ResConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    if (!location.state || !location.state.orderId) {
      navigate("/");
    } else {
      setReservation(location.state);
    }
  }, [location, navigate]);

  if (!reservation) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-12 px-6"
      style={{ backgroundImage: `url(${background})` }}>
      <div className="max-w-3xl mx-auto">
        
        {/* Success Header */}
        <div className="bg-black/70 p-8 rounded-t-lg text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 rounded-full bg-green-500 flex items-center justify-center">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-16 h-16"
                initial={{ strokeDasharray: 100, strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <path d="M20 6L9 17l-5-5" />
              </motion.svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Reservation Confirmed!</h1>
          <p className="text-lg text-gray-300">Thank you for your reservation. Your table is ready!</p>
          <div className="mt-4 inline-block px-5 py-2 bg-[#B8860B] text-black font-bold rounded-lg">
            Reservation ID: #{reservation?.orderId || "N/A"}
          </div>
        </div>
        
        {/* Reservation Details */}
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-b-lg text-white border-t border-[#B8860B]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-[#B8860B]">Customer Details</h2>
              <p className="mb-2"><span className="text-gray-400">Name:</span> {reservation?.fullName || "N/A"}</p>
              <p className="mb-2"><span className="text-gray-400">Phone:</span> {reservation?.phone || "N/A"}</p>
              <p className="mb-2"><span className="text-gray-400">Email:</span> {reservation?.email || "N/A"}</p>
              <p className="mb-2"><span className="text-gray-400">Date:</span> {reservation?.date || "N/A"}</p>
              <p className="mb-2"><span className="text-gray-400">Time:</span> {reservation?.time || "N/A"}</p>
              <p className="mb-2"><span className="text-gray-400">Guests:</span> {reservation?.guests || "N/A"}</p>
              <p className="mb-2"><span className="text-gray-400">Tables:</span> {reservation?.tables?.length ? reservation.tables.join(", ") : "N/A"}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </button>
            <button 
              onClick={() => navigate("/select-date-time")}
              className="px-6 py-3 bg-[#B8860B] text-black font-bold rounded-lg hover:bg-[#8B6508] transition-colors"
            >
              Place Another Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResConfirmation;