import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo5.png";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('user') !== null;
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;

  const handleHomeClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <nav className="w-full bg-black text-white fixed top-0 left-0 shadow-lg z-30 font-oswald">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
        
        {/* Left - Logo */}
        <div className="h-full flex items-center ml-[-35px]">
          <img src={logo} alt="Logo" className="h-14" />
          <p className="text-5xl pb-4 font-trajan">Vijaya Dining</p>
        </div>

        {/* Center - Navigation Links */}
        <div className="flex items-center space-x-8 text-lg font-semibold">
          <Link to="/" onClick={handleHomeClick} className="hover:text-[#8C7427] transition duration-300 cursor-pointer">
            Home
          </Link>
          <Link to="/menu" className="hover:text-[#8C7427] transition duration-300 cursor-pointer">
            Menu
          </Link>
          <Link to="/select-date-time" className="hover:text-[#8C7427] transition duration-300 cursor-pointer">
            Reserve
          </Link>
          <Link to="/order-takeaway" className="hover:text-[#8C7427] transition duration-300 cursor-pointer">
            Takeaway
          </Link>
          
          {/* Conditional Display: Login/Profile Button */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 h-10 rounded-md font-medium transition-colors duration-300 flex items-center justify-center"
                onClick={handleProfileClick}
              >
                {user?.fullName || "Profile"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 h-10 rounded-md font-medium transition-colors duration-300 flex items-center justify-center"
                onClick={handleLogout}
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 h-10 rounded-md font-medium transition-colors duration-300 flex items-center justify-center"
              onClick={() => navigate('/login')}
            >
              Login
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;