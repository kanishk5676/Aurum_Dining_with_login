const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/restaurantDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Table Schema
const tableSchema = new mongoose.Schema({
  number: Number,
  id: String,
});
const Table = mongoose.model("Table", tableSchema);

// ✅ Reservation Schema (Now includes orderId)
const reservationSchema = new mongoose.Schema({
  orderId: String,  // Unique order ID
  fullName: String,
  phone: String,
  email: String,
  date: String,
  time: String,
  guests: Number,
  tables: [String], // Array of reserved table IDs
});

const Reservation = mongoose.model("Reservation", reservationSchema);

// ✅ Fetch all tables
app.get("/tables", async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tables", error });
  }
});

// ✅ Fetch reserved tables for a specific date & time
app.get("/reserved-tables", async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) {
      return res.status(400).json({ message: "Date and time are required" });
    }
    
    const reservations = await Reservation.find({ date, time });
    const reservedTables = reservations.flatMap((reservation) => reservation.tables);
    res.json(reservedTables);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reserved tables", error });
  }
});

// ✅ Save a reservation with a unique order ID
app.post("/reserve", async (req, res) => {
  try {
    const { fullName, phone, email, date, time, guests, tables } = req.body;
    if (!fullName || !phone || !email || !date || !time || !guests || tables.length === 0) {
      return res.status(400).json({ message: "All fields are required, including at least one table" });
    }

    // Generate unique order ID from MongoDB ObjectId
    const orderId = new mongoose.Types.ObjectId().toString();

    const newReservation = new Reservation({ orderId, fullName, phone, email, date, time, guests, tables });
    await newReservation.save();

    res.status(201).json({ message: "Reservation successful", orderId });
  } catch (error) {
    res.status(500).json({ message: "Error saving reservation", error });
  }
});

// ✅ Fetch reservation by orderId (for future use)
app.get("/reservation/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const reservation = await Reservation.findOne({ orderId });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservation", error });
  }
});

// ✅ Start the server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
