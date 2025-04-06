const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // Add this package for password hashing

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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to user
  createdAt: { type: Date, default: Date.now }, // Add creation date
});
const Reservation = mongoose.model("Reservation", reservationSchema);

// ✅ Takeaway Order Schema
const takeawayOrderSchema = new mongoose.Schema({
  orderId: String,
  fullName: String,
  phone: String,
  address: String,
  items: [{ name: String, quantity: Number, price: Number }],
  subtotal: Number,
  tax: Number,
  acTax: Number,
  gst: Number,
  deliveryCharge: Number,
  total: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to user
  createdAt: { type: Date, default: Date.now },
});
const TakeawayOrder = mongoose.model("TakeawayOrder", takeawayOrderSchema);

// ✅ New User Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true }, 
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

// ✅ User Registration
app.post("/api/register", async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;
    
    // Basic validation
    if (!fullName || !phone || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide name, phone number, and password" 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this phone number already exists" 
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const newUser = new User({
      fullName,
      phone,
      email,
      password: hashedPassword
    });
    
    await newUser.save();
    
    res.status(201).json({
      success: true,
      message: "Registration successful. Please login.",
      userId: newUser._id
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Registration failed. Please try again later." 
    });
  }
});

// ✅ User Login
app.post("/api/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid phone number or password" 
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid phone number or password" 
      });
    }
    
    // Return user info (excluding password)
    const userResponse = {
      userId: user._id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      isAdmin: user.isAdmin
    };
    
    res.json({
      success: true,
      message: "Login successful",
      user: userResponse
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Login failed. Please try again later." 
    });
  }
});

// ✅ Get User Profile
app.get("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
});

// ✅ Get User Orders (both reservations and takeaway)
app.get("/api/users/:userId/orders", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get both reservations and takeaway orders
    const reservations = await Reservation.find({ userId: mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 });
      
    const takeawayOrders = await TakeawayOrder.find({ userId: mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 });
    
    res.json({
      reservations,
      takeawayOrders
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

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

// ✅ Modified: Save a reservation with a unique order ID and user association
app.post("/reserve", async (req, res) => {
  try {
    const { fullName, phone, email, date, time, guests, tables, userId } = req.body;
    if (!fullName || !phone || !email || !date || !time || !guests || tables.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Please fill in all required fields and select at least one table" 
      });
    }
    const orderId = new mongoose.Types.ObjectId().toString();
    const newReservation = new Reservation({ 
      orderId, 
      fullName, 
      phone, 
      email, 
      date, 
      time, 
      guests, 
      tables,
      userId // Associate with user if provided
    });
    await newReservation.save();
    res.status(201).json({ 
      success: true, 
      message: "Your table has been successfully reserved! Your reservation ID is " + orderId, 
      orderId 
    });
  } catch (error) {
    console.error("Error saving reservation:", error);
    res.status(500).json({ 
      success: false, 
      message: "We couldn't complete your reservation at this time. Please try again later." 
    });
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

// ✅ Modified: Save a Takeaway Order with user association
app.post("/takeaway", async (req, res) => {
  try {
    const { fullName, phone, address, items, subtotal, tax, acTax, gst, deliveryCharge, total, userId } = req.body;
    if (!fullName || !phone || !address || !items.length || !subtotal || !total) {
      return res.status(400).json({ 
        success: false, 
        message: "Please fill in all required fields to complete your order" 
      });
    }
    const orderId = new mongoose.Types.ObjectId().toString();
    const newOrder = new TakeawayOrder({ 
      orderId, 
      fullName, 
      phone, 
      address, 
      items, 
      subtotal, 
      tax, 
      acTax, 
      gst, 
      deliveryCharge, 
      total,
      userId // Associate with user if provided
    });
    await newOrder.save();
    res.status(201).json({ 
      success: true, 
      message: "Your takeaway order has been successfully placed! You can track it with your order ID.", 
      orderId 
    });
  } catch (error) {
    console.error("Error saving takeaway order:", error);
    res.status(500).json({ 
      success: false, 
      message: "We couldn't process your order at this time. Please try again later." 
    });
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
        return res.status(404).json({ 
          success: false, 
          message: "We couldn't find the order you're trying to cancel" 
        });
      }
    }
    
    res.json({ 
      success: true, 
      message: "Your order has been successfully cancelled" 
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ 
      success: false, 
      message: "We couldn't cancel your order at this time. Please try again later." 
    });
  }
});

// ✅ Update reservation
app.put("/update-reservation", async (req, res) => {
  try {
    const { orderId, fullName, phone, email, date, time, guests, tables } = req.body;
    
    if (!orderId || !fullName || !phone || !email || !date || !time || !guests || !tables.length) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide all required fields" 
      });
    }

    // First check if the reservation exists
    const existingReservation = await Reservation.findOne({ orderId });
    if (!existingReservation) {
      return res.status(404).json({ 
        success: false, 
        message: "Reservation not found" 
      });
    }

    // Update the reservation
    await Reservation.updateOne(
      { orderId }, 
      { fullName, phone, email, date, time, guests, tables }
    );

    res.json({ 
      success: true, 
      message: "Your reservation has been successfully updated", 
      orderId 
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ 
      success: false, 
      message: "We couldn't update your reservation at this time. Please try again later." 
    });
  }
});

// Fetch all reservations (for admin panel)
app.get("/admin/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error });
  }
});

// Fetch all takeaway orders (for admin panel)
app.get("/admin/takeaway-orders", async (req, res) => {
  try {
    const orders = await TakeawayOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching takeaway orders", error });
  }
});

// Cancel a reservation (for admin panel)
app.delete("/admin/reservations/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedReservation = await Reservation.findOneAndDelete({ orderId });
    
    if (!deletedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    
    res.json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling reservation", error });
  }
});

// Cancel a takeaway order (for admin panel)
app.delete("/admin/takeaway-orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await TakeawayOrder.findOneAndDelete({ orderId });
    
    if (!deletedOrder) {
      return res.status(404).json({ message: "Takeaway order not found" });
    }
    
    res.json({ message: "Takeaway order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling takeaway order", error });
  }
});

// Add to server.js

// Food Item Schema
const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['brunch', 'lunch', 'dinner', 'dessert', 'drinks']
  },
  imageUrl: { type: String, default: "/api/placeholder/300/200" },
  isAvailable: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const FoodItem = mongoose.model("FoodItem", foodItemSchema);

// API Routes for Food Items

// Get all food items
app.get("/api/menu", async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    
    const foodItems = await FoodItem.find(query);
    res.json(foodItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch menu items" 
    });
  }
});

// Get a single food item
app.get("/api/menu/:id", async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    
    if (!foodItem) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }
    
    res.json(foodItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch menu item" 
    });
  }
});

// Add a new food item (Admin only)
app.post("/api/menu", async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, isAvailable, isPopular } = req.body;
    
    // Basic validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide name, description, price, and category" 
      });
    }
    
    const newFoodItem = new FoodItem({
      name,
      description,
      price,
      category,
      imageUrl: imageUrl || "/api/placeholder/300/200",
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isPopular: isPopular || false
    });
    
    await newFoodItem.save();
    
    res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      foodItem: newFoodItem
    });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add menu item" 
    });
  }
});

// Update a food item (Admin only)
app.put("/api/menu/:id", async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, isAvailable, isPopular } = req.body;
    
    const updatedFoodItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        imageUrl,
        isAvailable,
        isPopular
      },
      { new: true }
    );
    
    if (!updatedFoodItem) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }
    
    res.json({
      success: true,
      message: "Menu item updated successfully",
      foodItem: updatedFoodItem
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update menu item" 
    });
  }
});

// Delete a food item (Admin only)
app.delete("/api/menu/:id", async (req, res) => {
  try {
    const deletedFoodItem = await FoodItem.findByIdAndDelete(req.params.id);
    
    if (!deletedFoodItem) {
      return res.status(404).json({ 
        success: false, 
        message: "Menu item not found" 
      });
    }
    
    res.json({
      success: true,
      message: "Menu item deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete menu item" 
    });
  }
});

// Seed initial menu data (you can call this once to populate your database)
app.post("/api/seed-menu", async (req, res) => {
  try {
    // Check if there are already menu items
    const count = await FoodItem.countDocuments();
    if (count > 0) {
      return res.json({ message: "Menu items already exist" });
    }
    
    // Initial menu data from your existing menu
    const initialMenuItems = [
      { name: "Masala Dosa", description: "Rice crepe with spicy potato filling", price: 110, category: "brunch" },
      { name: "Aloo Paratha", description: "Stuffed wheat flatbread with butter", price: 70, category: "brunch" },
      { name: "Eggs Benedict", description: "Poached eggs, hollandaise sauce", price: 140, category: "brunch" },
      { name: "Pancakes & Maple Syrup", description: "Classic pancakes with pure maple syrup", price: 220, category: "brunch" },
      { name: "French Toast", description: "Crispy golden toast with honey drizzle", price: 100, category: "brunch" },
      { name: "Cheesy Garlic Naan Benedict", description: "Poached eggs over mini garlic naans, topped with creamy tikka hollandaise", price: 200, category: "brunch" },
      { name: "Tandoori Avocado Toast", description: "Grilled avocado with smoky tandoori spices on sourdough, topped with pickled onions", price: 150, category: "brunch" },
      
      { name: "Chicken Biryani", description: "Aromatic basmati rice with spices", price: 350, category: "lunch" },
      { name: "Mutton Biryani", description: "Aromatic basmati rice with spices", price: 420, category: "lunch" },
      { name: "Butter Chicken", description: "Cottage cheese in creamy tomato sauce", price: 280, category: "lunch" },
      { name: "Lasagna", description: "Layered pasta with ricotta and meat sauce", price: 400, category: "lunch" },
      { name: "Grilled Chicken Salad", description: "Fresh greens, grilled chicken & vinaigrette", price: 260, category: "lunch" },
      { name: "Fish & Chips", description: "Golden fried fish with crispy fries", price: 320, category: "lunch" },
      { name: "Kathi Roll Burrito", description: "A fusion of a burrito and Indian kathi roll, stuffed with spiced paneer, saffron rice, and raita drizzle", price: 200, category: "lunch" },
      { name: "Black Garlic & Truffle Butter Naan Pizza", description: "Naan topped with black garlic sauce, mushrooms, and truffle butter", price: 280, category: "lunch" },
      
      { name: "Butter Chicken", description: "Rich tomato-based curry with chicken", price: 340, category: "dinner" },
      { name: "Beef Stroganoff", description: "Creamy Russian beef dish with pasta", price: 450, category: "dinner" },
      { name: "Shrimp Alfredo Pasta", description: "Creamy garlic sauce with juicy shrimp", price: 420, category: "dinner" },
      { name: "Tandoori Roti & Sabzi", description: "Traditional tandoori bread with mixed veggies", price: 200, category: "dinner" },
      { name: "Lobster Thermidor", description: "Succulent lobster in a creamy brandy-infused sauce, topped with gruyère cheese and baked until golden", price: 460, category: "dinner" },
      { name: "Saffron & Gold Leaf Risotto", description: "Creamy risotto infused with saffron and garnished with edible gold leaf for an opulent touch", price: 300, category: "dinner" },
      { name: "Mutton Rogan Josh", description: "Kashmiri-style slow-cooked lamb curry with rich spices", price: 380, category: "dinner" },
      
      { name: "Gulab Jamun", description: "Deep-fried milk balls in sugar syrup", price: 120, category: "dessert" },
      { name: "Tiramisu", description: "Italian coffee-flavored dessert", price: 280, category: "dessert" },
      { name: "Chocolate Brownie", description: "Warm fudgy brownie with ice cream", price: 250, category: "dessert" },
      { name: "Cheesecake", description: "Classic creamy cheesecake with berry topping", price: 260, category: "dessert" },
      { name: "24K Gold Chocolate Lava Cake", description: "Rich molten chocolate cake with edible gold dust", price: 450, category: "dessert" },
      { name: "Saffron Pistachio Cheesecake", description: "Baked cheesecake infused with saffron and topped with pistachios", price: 350, category: "dessert" },
      { name: "Dark Chocolate & Raspberry Mousse", description: "Layers of dark chocolate and raspberry mousse", price: 320, category: "dessert" },
      
      { name: "Mango Lassi", description: "Sweet yogurt drink with mango", price: 150, category: "drinks" },
      { name: "Espresso", description: "Strong Italian coffee shot", price: 110, category: "drinks" },
      { name: "Iced Latte", description: "Chilled espresso with creamy milk", price: 160, category: "drinks" },
      { name: "Mocktail - Blue Lagoon", description: "Refreshing blue drink with lemon fizz", price: 200, category: "drinks" },
      { name: "Golden Elixir Martini", description: "Vodka martini infused with saffron and elderflower", price: 500, category: "drinks" },
      { name: "Midnight Velvet Negroni", description: "Negroni with activated charcoal and dark cherry bitters", price: 450, category: "drinks" },
      { name: "Imperial Old Fashioned", description: "Smoked bourbon cocktail with 24k gold leaf", price: 550, category: "drinks" }
    ];
    
    // Add image URLs to each item
    const menuItems = initialMenuItems.map(item => ({
      ...item,
      imageUrl: "/api/placeholder/300/200" // Placeholder image for all items
    }));
    
    await FoodItem.insertMany(menuItems);
    
    res.status(201).json({
      success: true,
      message: "Menu seeded successfully",
      count: menuItems.length
    });
  } catch (error) {
    console.error("Error seeding menu:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to seed menu" 
    });
  }
});







// ✅ Start the server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));