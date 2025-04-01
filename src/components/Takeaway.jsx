import { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "/images/hk-background.png";

function Takeaway() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("brunch");
  const [order, setOrder] = useState({});
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Menu Data
  const menuItems = {
    brunch: [
      { name: "Masala Dosa", desc: "Rice crepe with spicy potato filling", price: 180 },
      { name: "Aloo Paratha", desc: "Stuffed wheat flatbread with butter", price: 150 },
      { name: "Eggs Benedict", desc: "Poached eggs, hollandaise sauce", price: 250 },
    ],
    lunch: [
      { name: "Chicken Biryani", desc: "Aromatic basmati rice with spices", price: 350 },
      { name: "Paneer Butter Masala", desc: "Cottage cheese in creamy tomato sauce", price: 280 },
      { name: "Lasagna", desc: "Layered pasta with ricotta and meat sauce", price: 400 },
    ],
    dinner: [
      { name: "Dal Makhani", desc: "Slow-cooked black lentils in butter", price: 240 },
      { name: "Butter Chicken", desc: "Rich tomato-based curry with chicken", price: 340 },
      { name: "Shrimp Alfredo Pasta", desc: "Creamy garlic sauce with juicy shrimp", price: 420 },
    ],
    desserts: [
      { name: "Gulab Jamun", desc: "Deep-fried dough balls in sugar syrup", price: 100 },
      { name: "Chocolate Brownie", desc: "Rich, fudgy chocolate brownie", price: 180 },
      { name: "Ice Cream Sundae", desc: "Vanilla ice cream with toppings", price: 200 },
    ],
    drinks: [
      { name: "Mango Lassi", desc: "Sweet yogurt drink with mango", price: 120 },
      { name: "Cold Coffee", desc: "Chilled coffee with ice cream", price: 150 },
      { name: "Masala Chai", desc: "Spiced Indian tea with milk", price: 80 },
    ],
  };

  const updateOrder = (item, action) => {
    setOrder((prevOrder) => {
      const newOrder = { ...prevOrder };

      if (action === "add") {
        newOrder[item.name] = { qty: (newOrder[item.name]?.qty || 0) + 1, price: item.price };
      } else if (action === "remove" && newOrder[item.name]) {
        if (newOrder[item.name].qty > 1) {
          newOrder[item.name].qty -= 1;
        } else {
          delete newOrder[item.name]; // Remove item when qty reaches 0
        }
      }

      return newOrder;
    });
  };

  // Calculate billing amounts
  const subtotal = Object.values(order).reduce((total, item) => total + item.qty * item.price, 0);
  const tax = subtotal * 0.05;
  const acTax = subtotal * 0.02;
  const gst = subtotal * 0.08;
  const deliveryCharge = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + acTax + gst + deliveryCharge;

  // Format order items for API submission
  const formatOrderItems = () => {
    return Object.entries(order).map(([itemName, details]) => ({
      name: itemName,
      quantity: details.qty,
      price: details.price
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    if (userName.trim() === "") {
      setErrorMessage("Please enter your name");
      return false;
    }
    if (phone.trim() === "" || !/^\d{10}$/.test(phone)) {
      setErrorMessage("Please enter a valid 10-digit phone number");
      return false;
    }
    if (address.trim() === "") {
      setErrorMessage("Please enter your delivery address");
      return false;
    }
    if (Object.keys(order).length === 0) {
      setErrorMessage("Please add at least one item to your order");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const orderData = {
        fullName: userName,
        phone: phone,
        address: address,
        items: formatOrderItems(),
        subtotal: subtotal,
        tax: tax,
        acTax: acTax,
        gst: gst,
        deliveryCharge: deliveryCharge,
        total: total
      };
      
      const response = await fetch('http://localhost:5001/takeaway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error('Order submission failed');
      }
      
      const data = await response.json();
      
      // Redirect to order confirmation page with orderId
      navigate(`/order-confirmation/${data.orderId}`);
      
    } catch (error) {
      console.error('Error submitting order:', error);
      setErrorMessage("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div
      className="w-full min-h-screen bg-repeat bg-[length:100px_100px] text-white flex flex-col py-12 px-6 mt-16"
      style={{ backgroundImage: `url(${background})` }}
    >
      <h1 className="text-3xl font-bold tracking-wide text-center">TAKEAWAY</h1>
      <h2 className="text-lg font-semibold text-[#B8860B] text-center mt-1">Order Your Favorite Food</h2>

      <div className="flex flex-col md:flex-row mt-12 w-full max-w-7xl mx-auto">
        {/* Left: Menu */}
        <div className="md:w-2/3 w-full pr-10">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {["brunch", "lunch", "dinner"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full px-5 py-2 rounded-lg font-medium text-sm transition ${
                  selectedCategory === category
                    ? "bg-[#B8860B] text-black"
                    : "border-2 border-white text-white hover:bg-white hover:text-black"
                }`}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {["desserts", "drinks"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full px-5 py-2 rounded-lg font-medium text-sm transition ${
                  selectedCategory === category
                    ? "bg-[#B8860B] text-black"
                    : "border-2 border-white text-white hover:bg-white hover:text-black"
                }`}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Food Items List */}
          <div className="flex flex-col space-y-4">
            {menuItems[selectedCategory].map((item) => (
              <div key={item.name} className="bg-black/40 p-4 rounded-lg border border-white flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-300">{item.desc}</p>
                  <p className="text-[#B8860B] font-bold">₹{item.price}</p>
                </div>
                <div className="flex items-center">
                  <button
                    className="px-4 py-2 rounded-l-md font-medium text-lg shadow-2xl transition"
                    onClick={() => updateOrder(item, "remove")}
                    disabled={!order[item.name]}
                  >
                    -
                  </button>
                  <span className="px-5 py-2 text-lg bg-gray-900 text-white font-semibold shadow-inner rounded-full">
                    {order[item.name]?.qty || 0}
                  </span>
                  <button
                    className="px-4 py-2 rounded-r-md font-medium text-lg shadow-2xl transition"
                    onClick={() => updateOrder(item, "add")}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Billing Section */}
        <div className="md:w-1/3 w-full bg-black/30 p-6 rounded-lg shadow-lg border border-white mt-8 md:mt-0">
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold text-center mb-4">Your Details</h2>
            {errorMessage && (
              <div className="bg-red-600 text-white p-2 mb-4 rounded text-sm">
                {errorMessage}
              </div>
            )}
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <input 
              type="text" 
              placeholder="Phone Number" 
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="\d{10}"
              required
            />
            <input 
              type="text" 
              placeholder="Delivery Address" 
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <button
              type="submit"
              className={`w-full p-3 mt-4 rounded-lg font-semibold transition bg-[#B8860B] text-black hover:bg-[#D4AF37] ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Place Order"}
            </button>
          </form>

          {/* Billing Summary */}
          <div className="mt-6 text-lg font-semibold">
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>Tax (5%): ₹{tax.toFixed(2)}</p>
            <p>AC Tax (2%): ₹{acTax.toFixed(2)}</p>
            <p>GST (8%): ₹{gst.toFixed(2)}</p>
            <p>Delivery Charge: ₹{deliveryCharge.toFixed(2)}</p>
            <hr className="my-4" />
            <p>Total: ₹{total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Takeaway;