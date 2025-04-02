import { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "/images/hk-background.png";

function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("brunch");
  const navigate = useNavigate();

  // Menu Data
  const menuItems = {
    brunch: [
      { name: "Masala Dosa", desc: "Rice crepe with spicy potato filling", price: "₹110" },
      { name: "Aloo Paratha", desc: "Stuffed wheat flatbread with butter", price: "₹70" },
      { name: "Eggs Benedict", desc: "Poached eggs, hollandaise sauce", price: "₹140" },
      { name: "Pancakes & Maple Syrup", desc: "Classic pancakes with pure maple syrup", price: "₹220" },
      { name: "French Toast", desc: "Crispy golden toast with honey drizzle", price: "₹100" },
      { name: "Cheesy Garlic Naan Benedict" ,desc:"Poached eggs over mini garlic naans, topped with creamy tikka hollandaise",price:"₹200"},
      { name: "Tandoori Avocado Toast" ,desc:"Grilled avocado with smoky tandoori spices on sourdough, topped with pickled onions",price:"₹150"}
    ],

    lunch: [
      { name: "Chicken Biryani", desc: "Aromatic basmati rice with spices", price: "₹350" },
      { name: "Mutton Biryani", desc: "Aromatic basmati rice with spices", price: "₹420" },
      { name: "Butter Chicken", desc: "Cottage cheese in creamy tomato sauce", price: "₹280" },
      { name: "Lasagna", desc: "Layered pasta with ricotta and meat sauce", price: "₹400" },
      { name: "Grilled Chicken Salad", desc: "Fresh greens, grilled chicken & vinaigrette", price: "₹260" },
      { name: "Fish & Chips", desc: "Golden fried fish with crispy fries", price: "₹320" },
      { name: "Kathi Roll Burrito", desc: "A fusion of a burrito and Indian kathi roll, stuffed with spiced paneer, saffron rice, and raita drizzle", price: "₹200" },
      { name: "Black Garlic & Truffle Butter Naan Pizza", desc: "Naan topped with black garlic sauce, mushrooms, and truffle butter", price: "₹280" },
    ],

    dinner: [
      { name: "Butter Chicken", desc: "Rich tomato-based curry with chicken", price: "₹340" },
      { name: "Beef Stroganoff", desc: "Creamy Russian beef dish with pasta", price: "₹450" },
      { name: "Shrimp Alfredo Pasta", desc: "Creamy garlic sauce with juicy shrimp", price: "₹420" },
      { name: "Tandoori Roti & Sabzi", desc: "Traditional tandoori bread with mixed veggies", price: "₹200" },
      { name: "Lobster Thermidor", desc: "Succulent lobster in a creamy brandy-infused sauce, topped with gruyère cheese and baked until golden", price: "₹460" },
      { name: "Saffron & Gold Leaf Risotto", desc: "Creamy risotto infused with saffron and garnished with edible gold leaf for an opulent touch", price: "₹300" },
      { name: "Mutton Rogan Josh", desc: "Kashmiri-style slow-cooked lamb curry with rich spices", price: "₹380" }
    ],


    dessert: [
      { name: "Gulab Jamun", desc: "Deep-fried milk balls in sugar syrup", price: "₹120" },
      { name: "Tiramisu", desc: "Italian coffee-flavored dessert", price: "₹280" },
      { name: "Chocolate Brownie", desc: "Warm fudgy brownie with ice cream", price: "₹250" },
      { name: "Cheesecake", desc: "Classic creamy cheesecake with berry topping", price: "₹260" },
      { name: "24K Gold Chocolate Lava Cake", desc: "Rich molten chocolate cake with edible gold dust", price: "₹450" },
      { name: "Saffron Pistachio Cheesecake", desc: "Baked cheesecake infused with saffron and topped with pistachios", price: "₹350" },
      { name: "Dark Chocolate & Raspberry Mousse", desc: "Layers of dark chocolate and raspberry mousse", price: "₹320" }
    ],
    
    drinks: [
      { name: "Mango Lassi", desc: "Sweet yogurt drink with mango", price: "₹150" },
      { name: "Espresso", desc: "Strong Italian coffee shot", price: "₹110" },
      { name: "Iced Latte", desc: "Chilled espresso with creamy milk", price: "₹160" },
      { name: "Mocktail - Blue Lagoon", desc: "Refreshing blue drink with lemon fizz", price: "₹200" },
      { name: "Golden Elixir Martini", desc: "Vodka martini infused with saffron and elderflower", price: "₹500" },
      { name: "Midnight Velvet Negroni", desc: "Negroni with activated charcoal and dark cherry bitters", price: "₹450" },
      { name: "Imperial Old Fashioned", desc: "Smoked bourbon cocktail with 24k gold leaf", price: "₹550" }
    ],
  };

  return (
    <div
      className="w-full min-h-screen bg-repeat bg-[length:100px_100px] text-white flex flex-col items-center py-12 px-6 "
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Menu Header */}
      <h1 className="text-3xl font-bold tracking-wide">MENU</h1>
      <h2 className="text-lg font-semibold text-[#B8860B] mt-1">Vellore</h2>
      <p className="flex items-center gap-2 text-gray-400 mt-1 cursor-pointer hover:text-white transition text-sm"
      onClick={() => window.open("https://maps.app.goo.gl/VAiMDt3fWoyQ7XMg9", "_blank")}>
        <span>📍</span> View location
      </p>

      {/* Menu Categories */}
      <div className="grid grid-cols-3 gap-16 mt-12">
        {["brunch", "lunch", "dinner"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`w-48 px-10 py-3 rounded-lg font-medium text-base transition ${
              selectedCategory === category
                ? "bg-[#B8860B] text-black"
                : "border-2 border-white text-white hover:bg-white hover:text-black"
            }`}
          >
            {category.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex gap-14 mt-8">
        {["dessert", "drinks"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`w-48 px-10 py-3 rounded-lg font-medium text-base transition ${
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
        <h2 className="text-lg font-bold text-center mb-6 uppercase">{selectedCategory} Mains</h2>
        <div className="grid md:grid-cols-2 gap-10">
          {menuItems[selectedCategory].map((item, index) => (
            <div key={index} className="bg-black/30 p-5 rounded-lg shadow-lg border border-white">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-gray-300 text-sm">{item.desc}</p>
              <p className="text-[#B8860B] font-semibold mt-2 text-sm">{item.price}</p>
            </div>
          ))}
        </div>
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