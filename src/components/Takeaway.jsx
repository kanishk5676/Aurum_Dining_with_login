import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import background from "/images/hk-background.png";

function Takeaway() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("brunch");
  const [order, setOrder] = useState({});
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Menu Data
  const menuItems = {
    brunch: [
      { name: "Masala Dosa", desc: "Rice crepe with spicy potato filling", price: "110" },
      { name: "Aloo Paratha", desc: "Stuffed wheat flatbread with butter", price: "70" },
      { name: "Eggs Benedict", desc: "Poached eggs, hollandaise sauce", price: "140" },
      { name: "Pancakes & Maple Syrup", desc: "Classic pancakes with pure maple syrup", price: "220" },
      { name: "French Toast", desc: "Crispy golden toast with honey drizzle", price: "100" },
      { name: "Cheesy Garlic Naan Benedict" ,desc:"Poached eggs over mini garlic naans, topped with creamy tikka hollandaise",price:"200"},
      { name: "Tandoori Avocado Toast" ,desc:"Grilled avocado with smoky tandoori spices on sourdough, topped with pickled onions",price:"150"}
    ],
    lunch: [
      { name: "Chicken Biryani", desc: "Aromatic basmati rice with spices", price: "350" },
      { name: "Mutton Biryani", desc: "Aromatic basmati rice with spices", price: "420" },
      { name: "Butter Chicken", desc: "Cottage cheese in creamy tomato sauce", price: "280" },
      { name: "Lasagna", desc: "Layered pasta with ricotta and meat sauce", price: "400" },
      { name: "Grilled Chicken Salad", desc: "Fresh greens, grilled chicken & vinaigrette", price: "260" },
      { name: "Fish & Chips", desc: "Golden fried fish with crispy fries", price: "320" },
      { name: "Kathi Roll Burrito", desc: "A fusion of a burrito and Indian kathi roll, stuffed with spiced paneer, saffron rice, and raita drizzle", price: "200" },
      { name: "Black Garlic & Truffle Butter Naan Pizza", desc: "Naan topped with black garlic sauce, mushrooms, and truffle butter", price: "280" },
    ],
    dinner: [
      { name: "Butter Chicken", desc: "Rich tomato-based curry with chicken", price: "340" },
      { name: "Beef Stroganoff", desc: "Creamy Russian beef dish with pasta", price: "450" },
      { name: "Shrimp Alfredo Pasta", desc: "Creamy garlic sauce with juicy shrimp", price: "420" },
      { name: "Tandoori Roti & Sabzi", desc: "Traditional tandoori bread with mixed veggies", price: "200" },
      { name: "Lobster Thermidor", desc: "Succulent lobster in a creamy brandy-infused sauce, topped with gruyère cheese and baked until golden", price: "460" },
      { name: "Saffron & Gold Leaf Risotto", desc: "Creamy risotto infused with saffron and garnished with edible gold leaf for an opulent touch", price: "300" },
      { name: "Mutton Rogan Josh", desc: "Kashmiri-style slow-cooked lamb curry with rich spices", price: "380" },
    ],    
    desserts:[
      { name: "Gulab Jamun", desc: "Deep-fried milk balls in sugar syrup", price: "120" },
      { name: "Tiramisu", desc: "Italian coffee-flavored dessert", price: "280" },
      { name: "Chocolate Brownie", desc: "Warm fudgy brownie with ice cream", price: "250" },
      { name: "Cheesecake", desc: "Classic creamy cheesecake with berry topping", price: "260" },
      { name: "24K Gold Chocolate Lava Cake", desc: "Rich molten chocolate cake with edible gold dust", price: "450" },
      { name: "Saffron Pistachio Cheesecake", desc: "Baked cheesecake infused with saffron and topped with pistachios", price: "350" },
      { name: "Dark Chocolate & Raspberry Mousse", desc: "Layers of dark chocolate and raspberry mousse", price: "320" },
    ],
    drinks: [
      { name: "Mango Lassi", desc: "Sweet yogurt drink with mango", price: "150" },
      { name: "Espresso", desc: "Strong Italian coffee shot", price: "110" },
      { name: "Iced Latte", desc: "Chilled espresso with creamy milk", price: "160" },
      { name: "Mocktail - Blue Lagoon", desc: "Refreshing blue drink with lemon fizz", price: "200" },
      { name: "Golden Elixir Martini", desc: "Vodka martini infused with saffron and elderflower", price: "500" },
      { name: "Midnight Velvet Negroni", desc: "Negroni with activated charcoal and dark cherry bitters", price: "450" },
      { name: "Imperial Old Fashioned", desc: "Smoked bourbon cocktail with 24k gold leaf", price: "550" },
    ],
  };

  // Check if user is logged in on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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

  // Validate order
  const validateOrder = () => {
    if (Object.keys(order).length === 0) {
      setErrorMessage("Please add at least one item to your order");
      return false;
    }
    
    if (!user) {
      setShowLoginPrompt(true);
      return false;
    }

    if (!user.fullName || !user.phone) {
      setErrorMessage("User profile incomplete. Please update your profile.");
      return false;
    }
    
    setErrorMessage("");
    return true;
  };

  // Navigate to login page
  const handleRedirectToLogin = () => {
    // Store current order in session storage so it can be retrieved after login
    sessionStorage.setItem('pendingOrder', JSON.stringify(order));
    navigate('/login?redirect=order-takeaway');
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateOrder()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create modal for address input
      const deliveryAddress = prompt("Please enter your delivery address:");
      if (!deliveryAddress || deliveryAddress.trim() === "") {
        setErrorMessage("Delivery address is required");
        setIsSubmitting(false);
        return;
      }
      
      const orderData = {
        fullName: user.fullName,
        phone: user.phone,
        address: deliveryAddress,
        items: formatOrderItems(),
        subtotal: subtotal,
        tax: tax,
        acTax: acTax,
        gst: gst,
        deliveryCharge: deliveryCharge,
        total: total,
        userId: user.userId // Link order to user
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
      className="w-full min-h-screen bg-repeat bg-[length:100px_100px] text-white flex flex-col py-12 px-6"
      style={{ backgroundImage: `url(${background})` }}
    >
      <h1 className="text-3xl font-bold tracking-wide text-center">TAKEAWAY</h1>
      <h2 className="text-lg font-semibold text-[#B8860B] text-center mt-1">Order Your Favorite Food</h2>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg shadow-xl border border-[#B8860B] max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-white">Login Required</h3>
            <p className="mb-6 text-gray-300">Please login to your account to place an order.</p>
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

      <div className="flex flex-col md:flex-row mt-12 w-full max-w-7xl mx-auto">
        {/* Left: Menu */}
        <div className="md:w-2/3 w-full pr-0 md:pr-10">
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
          {errorMessage && (
            <div className="bg-red-600 text-white p-2 mb-4 rounded text-sm">
              {errorMessage}
            </div>
          )}
          
          {/* User Info Summary */}
          {user && (
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Ordering as:</h3>
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
                Login to Order
              </button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className={`w-full p-3 mt-4 rounded-lg font-semibold transition bg-[#B8860B] text-black hover:bg-[#D4AF37] ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting || !user}
          >
            {isSubmitting ? "Submitting..." : "Place Order"}
          </button>

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