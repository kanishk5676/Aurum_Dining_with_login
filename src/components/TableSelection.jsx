import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "/images/hk-background.png";
import Navbar from "./Navbar";

const TableSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { date, time, isUpdateMode: locationIsUpdateMode } = location.state || {};

  const [tables, setTables] = useState([]);
  const [reservedTables, setReservedTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(locationIsUpdateMode || false);
  const [updateData, setUpdateData] = useState(null);
  const [originalOrderId, setOriginalOrderId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    guests: "1",
    agree: false,
  });

  // First useEffect - Check for update data in localStorage
  useEffect(() => {
    const storedUpdateData = localStorage.getItem("updateOrderData");
    
    if (storedUpdateData) {
      try {
        const parsedData = JSON.parse(storedUpdateData);
        
        // Set update mode flag
        setIsUpdateMode(true);
        
        // Store the update data
        setUpdateData(parsedData);
        
        // Store the original order ID for later use
        setOriginalOrderId(parsedData.orderId);
        
        // Pre-fill form fields
        setFormData({
          fullName: parsedData.fullName || "",
          phone: parsedData.phone || "",
          email: parsedData.email || "",
          guests: String(parsedData.guests) || "1",
          agree: true,
        });
        
        // Pre-select tables
        if (parsedData.tables && Array.isArray(parsedData.tables)) {
          setSelectedTables(parsedData.tables);
        }
      } catch (error) {
        console.error("Error parsing update data:", error);
      }
    }
  }, []);

  // Second useEffect - Load tables and reserved tables
  useEffect(() => {
    // Check if we have date and time from either location state or update data
    const effectiveDate = isUpdateMode && updateData ? updateData.date : date;
    const effectiveTime = isUpdateMode && updateData ? updateData.time : time;
    
    // If we don't have date/time information and we're not in update mode, redirect to home
    if (!effectiveDate || !effectiveTime) {
      if (!isUpdateMode || !updateData) {
        navigate("/");
        return;
      }
    }

    // Fetch all available tables
    axios.get("http://localhost:5001/tables").then((response) => {
      setTables(response.data);
    });

    // Fetch reserved tables for the given date and time
    axios
      .get(`http://localhost:5001/reserved-tables?date=${effectiveDate}&time=${effectiveTime}`)
      .then((response) => {
        // Get all reserved tables
        let allReservedTables = response.data;
        
        // If we're in update mode, don't consider the user's own tables as reserved
        if (isUpdateMode && updateData && updateData.tables) {
          allReservedTables = allReservedTables.filter(
            tableId => !updateData.tables.includes(tableId)
          );
        }
        
        setReservedTables(allReservedTables);
      })
      .catch(error => {
        console.error("Error fetching reserved tables:", error);
      });
  }, [date, time, navigate, isUpdateMode, updateData]);

  const toggleTableSelection = (tableId) => {
    // Don't allow selection of reserved tables
    if (reservedTables.includes(tableId)) return;
    
    setSelectedTables((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId]
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;
    if (name === "phone") {
      newValue = newValue.replace(/[^0-9]/g, "").slice(0, 10);
    }
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.fullName || !formData.phone || !formData.email || !formData.agree) {
      alert("Please fill in all required fields.");
      return;
    }
    if (formData.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    if (selectedTables.length === 0) {
      alert("Please select at least one table to reserve.");
      return;
    }
  
    // Get the effective date and time
    const effectiveDate = isUpdateMode && updateData ? updateData.date : date;
    const effectiveTime = isUpdateMode && updateData ? updateData.time : time;
    
    const reservationData = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      guests: Number(formData.guests),
      date: effectiveDate,
      time: effectiveTime,
      tables: selectedTables,
    };

    try {
      // If in update mode, we need to delete the old reservation and create a new one
      if (isUpdateMode && originalOrderId) {
        // Delete the existing reservation
        await axios.delete(`http://localhost:5001/reservation/${originalOrderId}`);
        
        // Create a new reservation
        const response = await axios.post("http://localhost:5001/reserve", reservationData);
        const { orderId } = response.data;
        
        if (!orderId) {
          alert("Update failed. No order ID received.");
          return;
        }
        
        // Navigate to confirmation page
        navigate("/confirmation", {
          state: { 
            ...reservationData,
            orderId,
            isUpdated: true 
          },
        });
      } else {
        // Regular reservation flow
        const response = await axios.post("http://localhost:5001/reserve", reservationData);
        const { orderId } = response.data;
        
        if (!orderId) {
          alert("Reservation failed. No order ID received.");
          return;
        }
        
        navigate("/confirmation", {
          state: { orderId, ...reservationData },
        });
      }
      
      // Clear the localStorage after successful submission
      localStorage.removeItem("updateOrderData");
    } catch (err) {
      console.error("Error:", err);
      alert("Reservation failed. Try again.");
    }
  };

  return (
    <div
      className="flex justify-between items-start min-h-screen bg-repeat bg-[length:100px_100px] bg-center p-10"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Navbar />

      {/* Table Selection Area */}
      <div className="grid grid-cols-5 gap-8 w-[600px] min-h-[650px] p-20 pb-24 bg-[url('./images/frame6.jpg')] bg-cover bg-center bg-padding-box rounded-lg shadow-lg">
        {tables.map((table) => (
          <button
            key={table.id}
            className={`w-15 h-15 border rounded-lg transition-all ${
              selectedTables.includes(table.id)
                ? "bg-yellow-500"
                : reservedTables.includes(table.id)
                ? "bg-red-500"
                : "bg-green-500"
            }`}
            onClick={() => toggleTableSelection(table.id)}
            disabled={reservedTables.includes(table.id)}
          ></button>
        ))}
      </div>

      {/* Customer Details Form */}
      <div className="w-[400px] bg-black/30 backdrop-blur-md p-8 shadow-lg rounded-lg mt-10">       
      <h2 className="text-4xl font-semibold mb-4 text-white">
        {isUpdateMode ? "Update Reservation" : "Customer Details"}
      </h2>
        {isUpdateMode && updateData && (
          <div className="mb-4 p-2 bg-gray-800 rounded text-white">
            <p>Updating reservation for: {updateData.date} at {updateData.time}</p>
          </div>
        )}

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-12 bg-black text-white"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-12 bg-black text-white"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-12 bg-black text-white"
        />

        <label className="block font-medium mb-1 text-white">Number of Guests:</label>
        <select
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-12 bg-black text-white"
        >
          {[...Array(20).keys()].map((num) => (
            <option key={num + 1} value={num + 1}>
              {num + 1}
            </option>
          ))}
        </select>

        <label className="flex items-center mb-12 text-white text-xl">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            required
            className="mr-2 text-2xl"
          />
          I agree to the terms and conditions
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-4 rounded-lg mt-2 text-lg"
          onClick={handleSubmit}
        >
          {isUpdateMode ? "Update Reservation" : "Reserve"}
        </button>
      </div>
    </div>
  );
};

export default TableSelection;