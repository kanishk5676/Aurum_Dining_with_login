import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "/images/hk-background.png";
import Navbar from "/src/pages/Navbar.jsx";

const TableSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { date, time } = location.state || {};

  const [tables, setTables] = useState([]);
  const [reservedTables, setReservedTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    guests: "1",
    agree: false,
  });

  useEffect(() => {
    if (!date || !time) {
      navigate("/");
      return;
    }

    axios.get("http://localhost:5001/tables").then((response) => {
      setTables(response.data);
    });

    axios
      .get(`http://localhost:5001/reserved-tables?date=${date}&time=${time}`)
      .then((response) => {
        setReservedTables(response.data);
      });
  }, [date, time, navigate]);

  const toggleTableSelection = (tableId) => {
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

  const handleSubmit = (e) => {
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
  
    const reservationData = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      guests: Number(formData.guests),
      date: date,
      time: time,
      tables: selectedTables,
    };
  
    axios
      .post("http://localhost:5001/reserve", reservationData)
      .then((response) => {
        const { orderId } = response.data;
        
        if (!orderId) {
          alert("Reservation failed. No order ID received.");
          return;
        }
  
        console.log("Navigating with:", { orderId, ...reservationData }); // Debugging
  
        navigate("/confirmation", {
          state: { orderId, ...reservationData },
        });
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Reservation failed. Try again.");
      });
  };
  
 

  return (
    <div
      className="flex justify-between items-start min-h-screen bg-repeat bg-[length:100px_100px] bg-center p-10"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Navbar />

      <div className="grid grid-cols-5 gap-8 w-[600px] min-h-[650px] p-20 pb-24 bg-[url('./images/frame6.jpg')] bg-cover bg-center bg-padding-box rounded-lg shadow-lg">
        {tables.map((table) => (
          <button
            key={table.id}
            className={`w-20 h-20 border rounded-lg transition-all ${
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

      <div className="w-[400px] bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Customer Details</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-4"
        />

        <label className="block font-medium mb-1">Number of Guests:</label>
        <select
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-4"
        >
          {[...Array(20).keys()].map((num) => (
            <option key={num + 1} value={num + 1}>
              {num + 1}
            </option>
          ))}
        </select>

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            required
            className="mr-2"
          />
          I agree to the terms and conditions
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-4 rounded-lg mt-2 text-lg"
          onClick={handleSubmit}
        >
          Reserve
        </button>
      </div>
    </div>
  );
};

export default TableSelection;
