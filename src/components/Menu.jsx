import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import background from "/images/hk-background.png";

function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("brunch");
  const [menuItems, setMenuItems] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch menu items from the server
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/menu");
        
        // Group items by category
        const groupedItems = response.data.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
        }, {});
        
        setMenuItems(groupedItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div
      className="w-full min-h-screen bg-repeat bg-[length:100px_100px] text-white flex flex-col items-center py-12 px-6"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Menu Header */}
      <h1 className="text-3xl font-bold tracking-wide">MENU</h1>
      <h2 className="text-lg font-semibold text-[#B8860B] mt-1">Vellore</h2>
      <p 
        className="flex items-center gap-2 text-gray-400 mt-1 cursor-pointer hover:text-white transition text-sm"
        onClick={() => window.open("https://maps.app.goo.gl/VAiMDt3fWoyQ7XMg9", "_blank")}
      >
        <span>📍</span> View location
      </p>

      {/* Menu Categories */}
      <div className="grid grid-cols-3 gap-8 mt-12">
        {["brunch", "lunch", "dinner"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`w-32 md:w-48 px-4 md:px-10 py-3 rounded-lg font-medium text-base transition ${
              selectedCategory === category
                ? "bg-[#B8860B] text-black"
                : "border-2 border-white text-white hover:bg-white hover:text-black"
            }`}
          >
            {category.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex gap-8 md:gap-14 mt-8">
        {["dessert", "drinks"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`w-32 md:w-48 px-4 md:px-10 py-3 rounded-lg font-medium text-base transition ${
              selectedCategory === category
                ? "bg-[#B8860B] text-black"
                : "border-2 border-white text-white hover:bg-white hover:text-black"
            }`}
          >
            {category.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Food Items Section */}
      <div className="w-full max-w-4xl mt-12">
        <h2 className="text-lg font-bold text-center mb-6 uppercase">
          {selectedCategory} Mains
        </h2>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B8860B]"></div>
          </div>
        ) : menuItems[selectedCategory] && menuItems[selectedCategory].length > 0 ? (
          <div className="grid md:grid-cols-2 gap-10">
            {menuItems[selectedCategory].map((item) => (
              <div 
                key={item._id} 
                className="bg-black/30 p-5 rounded-lg shadow-lg border border-white flex flex-col"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  
                  <div className="w-full md:w-2/3">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-gray-300 text-sm">{item.description}</p>
                    <p className="text-[#B8860B] font-semibold mt-2 text-sm">₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No items available in this category</p>
        )}
      </div>

      {/* Order Now Button */}
      <button
        onClick={() => navigate("/order-takeaway")}
        className="mt-12 bg-[#B8860B] text-white font-medium text-lg px-10 py-3 rounded-lg shadow-md transition hover:bg-[#d4a017]"
      >
        Order Now
      </button>
    </div>
  );
}

export default Menu;