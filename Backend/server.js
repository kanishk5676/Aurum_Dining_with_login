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

// ✅ Reservation Schema
const reservationSchema = new mongoose.Schema({
  orderId: String,
  fullName: String,
  phone: String,
  email: String,
  date: String,
  time: String,
  guests: Number,
  tables: [String],
});
const Reservation = mongoose.model("Reservation", reservationSchema);

// ✅ Takeaway Order Schema
// Modified TakeawayOrder Schema
const takeawayOrderSchema = new mongoose.Schema({
    orderId: String,
    fullName: String,
    phone: String,
    address: String,
    items: [{ name: String, quantity: Number, price: Number }],
    subtotal: Number,
    tax: Number,
    acTax: Number, // Added AC Tax (2%)
    gst: Number,   // Added GST (8%)
    deliveryCharge: Number,
    total: Number,
    createdAt: { type: Date, default: Date.now },
  });
const TakeawayOrder = mongoose.model("TakeawayOrder", takeawayOrderSchema);

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
    const orderId = new mongoose.Types.ObjectId().toString();
    const newReservation = new Reservation({ orderId, fullName, phone, email, date, time, guests, tables });
    await newReservation.save();
    res.status(201).json({ message: "Reservation successful", orderId });
  } catch (error) {
    res.status(500).json({ message: "Error saving reservation", error });
  }
});

// ✅ Fetch reservation by orderId
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

// ✅ Save a Takeaway Order
app.post("/takeaway", async (req, res) => {
  try {
    const { fullName, phone, address, items, subtotal, tax, deliveryCharge, total } = req.body;
    if (!fullName || !phone || !address || !items.length || !subtotal || !total) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const orderId = new mongoose.Types.ObjectId().toString();
    const newOrder = new TakeawayOrder({ orderId, fullName, phone, address, items, subtotal, tax, deliveryCharge, total });
    await newOrder.save();
    res.status(201).json({ message: "Takeaway order placed successfully", orderId });
  } catch (error) {
    res.status(500).json({ message: "Error placing takeaway order", error });
  }
});

// ✅ Fetch takeaway order by orderId
app.get("/takeaway/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await TakeawayOrder.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: "Takeaway order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching takeaway order", error });
  }
});

// Add this endpoint to your server.js file

// ✅ Fetch orders by phone number
app.get("/orders-by-phone/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    
    // Search in both reservation and takeaway collections
    const reservations = await Reservation.find({ phone });
    const takeawayOrders = await TakeawayOrder.find({ phone });
    
    // Combine the results
    const allOrders = [...reservations, ...takeawayOrders];
    
    // Sort by creation date (assuming most recent first)
    allOrders.sort((a, b) => {
      const dateA = a.createdAt || new Date(0);
      const dateB = b.createdAt || new Date(0);
      return dateB - dateA;
    });
    
    res.json(allOrders);
  } catch (error) {
    console.error("Error fetching orders by phone:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

// ✅ Delete reservation
app.delete("/reservation/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await Reservation.deleteOne({ orderId });
    
    if (result.deletedCount === 0) {
      // Try deleting from takeaway orders
      const takeawayResult = await TakeawayOrder.deleteOne({ orderId });
      
      if (takeawayResult.deletedCount === 0) {
        return res.status(404).json({ message: "Order not found" });
      }
    }
    
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
});

// ✅ Start the server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
