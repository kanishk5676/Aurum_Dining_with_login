import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo5.png";

function Navbar() { 
  const location = useLocation();

  const handleHomeClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="w-full bg-black text-white fixed top-0 left-0 shadow-lg z-30 font-oswald">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
        
        {/* Left - Logo */}
        <div className="h-full flex items-center ml-[-60px]">
          <img src={logo} alt="Logo" className="h-14" />
          <p className="text-5xl pb-4 font-trajan">Aurum Dining</p>
        </div>

        {/* Center - Navigation Links */}
        <div className="flex space-x-8 text-lg font-semibold">
          <Link to="/" onClick={handleHomeClick} className="hover:text-[#8C7427] transition duration-300 cursor-pointer">Home</Link>
          <Link to="/menu" className="hover:text-[#8C7427] transition duration-300 cursor-pointer">Menu</Link>
          <div className="hover:text-[#8C7427] transition duration-300 cursor-pointer">Reserve</div>
          <div className="hover:text-[#8C7427] transition duration-300 cursor-pointer">Takeaway</div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
