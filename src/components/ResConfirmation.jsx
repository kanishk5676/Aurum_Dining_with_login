import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ResConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);

  // Debugging: Check if data is received
  console.log("Location state in ResConfirmation:", location.state);

  useEffect(() => {
    if (!location.state || !location.state.orderId) {
      console.log("No reservation data found. Redirecting...");
      navigate("/");
    } else {
      setReservation(location.state);
    }
  }, [location, navigate]);

  if (!reservation) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Animated Checkmark */}
      <motion.div
        className="relative flex items-center justify-center w-24 h-24 bg-green-500 rounded-full shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.div>

      {/* Reservation Details */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800">Reservation Confirmed!</h2>
        <p className="text-gray-600 mt-2">Your reservation has been successfully booked.</p>

        <div className="mt-4 text-left">
          <p><strong>Order ID:</strong> {reservation.orderId || "N/A"}</p>
          <p><strong>Name:</strong> {reservation.fullName || "N/A"}</p>
          <p><strong>Phone:</strong> {reservation.phone || "N/A"}</p>
          <p><strong>Email:</strong> {reservation.email || "N/A"}</p>
          <p><strong>Date:</strong> {reservation.date || "N/A"}</p>
          <p><strong>Time:</strong> {reservation.time || "N/A"}</p>
          <p><strong>Guests:</strong> {reservation.guests || "N/A"}</p>
          <p><strong>Tables:</strong> {reservation.tables?.length ? reservation.tables.join(", ") : "N/A"}</p>
        </div>
      </div>

      {/* Return Home Button */}
      <button
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        onClick={() => navigate("/")}
      >
        Return to Home
      </button>
    </div>
  );
};

export default ResConfirmation;
