import logo from "../assets/logo5.png";

function Navbar() { 
  return (
    <nav className="w-full bg-black text-white fixed top-0 left-0 shadow-lg z-10 font-oswald">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
        
        {/* Left - Logo */}
        <div className="h-full flex items-center ml-[-60px] cursor-pointer">
          <img src={logo} alt="Logo" className="h-14" />
        </div>

        {/* Center - Navigation Links */}
        <div className="flex space-x-8 text-lg font-semibold">
          <div className="hover:text-[#8C7427] transition duration-300 cursor-pointer">Home</div>
          <div className="hover:text-[#8C7427] transition duration-300 cursor-pointer">Menu</div>
          <div className="hover:text-[#8C7427] transition duration-300 cursor-pointer">Reserve</div>
          <div className="hover:text-[#8C7427] transition duration-300 cursor-pointer">Takeaway</div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
