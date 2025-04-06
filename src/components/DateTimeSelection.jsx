import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import background from "/images/hk-background.png";

function DateTimeSelection() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Generate options for date selection (next 30 days)
  const dateOptions = [...Array(30)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      value: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    };
  });

  // Time options for reservation
  const timeOptions = [
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM",
    "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
    "9:00 PM", "9:30 PM", "10:00 PM",
  ];

  // Check if user is logged in on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleContinue = () => {
    if (!date || !time) {
      setErrorMessage("Please select both date and time");
      return;
    }

    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    // Store reservation details in sessionStorage
    sessionStorage.setItem("reservationDetails", JSON.stringify({
      date,
      time,
      guests
    }));

    // Navigate to table selection page
    navigate("/reserve-table");
  };

  // Navigate to login page
  const handleRedirectToLogin = () => {
    // Store selected date/time in session storage
    sessionStorage.setItem('pendingReservation', JSON.stringify({ date, time, guests }));
    navigate('/login?redirect=select-date-time');
  };

  return (
    <div
      className="min-h-screen bg-repeat bg-[length:100px_100px] text-white flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="max-w-lg w-full bg-black/30 p-8 rounded-xl border border-white shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-8">Reserve a Table</h1>
        
        {errorMessage && (
          <div className="bg-red-600 text-white p-3 mb-6 rounded">
            {errorMessage}
          </div>
        )}

        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg shadow-xl border border-[#B8860B] max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold mb-4 text-white">Login Required</h3>
              <p className="mb-6 text-gray-300">Please login to your account to make a reservation.</p>
              <div className="flex justify-end space-x-4">
                <button 
                  onClick={() => setShowLoginPrompt(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRedirectToLogin}
                  className="px-4 py-2 bg-[#B8860B] text-black rounded hover:bg-[#D4AF37]"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Info Summary (if logged in) */}
        {user && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Reserving as:</h3>
            <p><span className="text-gray-400">Name:</span> {user.fullName}</p>
            <p><span className="text-gray-400">Phone:</span> {user.phone}</p>
            {user.email && <p><span className="text-gray-400">Email:</span> {user.email}</p>}
          </div>
        )}
        
        {!user && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg text-center">
            <p className="text-yellow-400 mb-2">Not logged in</p>
            <button 
              onClick={handleRedirectToLogin}
              className="w-full p-2 bg-[#B8860B] text-black rounded hover:bg-[#D4AF37]"
            >
              Login to Reserve
            </button>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Date</label>
          <select
            className="w-full p-3 bg-gray-800 rounded text-white"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          >
            <option value="">Choose a date</option>
            {dateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Time</label>
          <select
            className="w-full p-3 bg-gray-800 rounded text-white"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="">Choose a time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Number of Guests</label>
          <div className="flex items-center justify-between">
            <button
              className="bg-gray-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl"
              onClick={() => setGuests(Math.max(1, guests - 1))}
            >
              -
            </button>
            <span className="text-2xl font-bold mx-4">{guests}</span>
            <button
              className="bg-gray-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl"
              onClick={() => setGuests(Math.min(20, guests + 1))}
            >
              +
            </button>
          </div>
        </div>

        <button
          className="w-full py-3 bg-[#B8860B] text-black rounded-lg font-semibold hover:bg-yellow-600 transition"
          onClick={handleContinue}
        >
          Continue to Table Selection
        </button>
      </div>
    </div>
  );
}

export default DateTimeSelection;