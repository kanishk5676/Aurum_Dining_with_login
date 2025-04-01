import React from 'react';
import {useNavigate} from 'react-router-dom';
import table from "../assets/reserve-table.avif";
import food5 from "../assets/food5.avif";
import background from "/images/hk-background.png";
import Carousel from "./Carousel";

const Content = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div>
      <Carousel/>
      <div id="content" className="bg-repeat bg-[length:100px_100px] text-white py-16 px-4 md:px-8 lg:px-16" 
        style={{ backgroundImage: `url(${background})` }}>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          
          {/* Left Side - Dish Image and Description */}
          <div className="w-full md:w-1/2 space-y-6 md:-mt-12">
            <h2 className="text-3xl font-bold uppercase">SECURE YOUR EXCLUSIVE DINING EXPERIENCE</h2>
            <img 
              src={table} 
              alt="Chef's Signature Dish" 
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
            <div className="space-y-4">
              <p className="text-gray-300 font-montserrat">
                Indulge in luxury without the wait—reserve your seat at Aurum's Kitchen effortlessly. 
                Plan ahead and guarantee your place at our elegantly curated tables, ensuring an unforgettable dining experience tailored just for you.
              </p>
              <button 
                className="bg-[#B8860B] text-white px-6 py-3 rounded-md uppercase font-semibold hover:bg-[#9C7A40] transition duration-300"
                onClick={() => navigate("/select-date-time")} // Redirect to Date & Time selection
              >
                Reserve
              </button>
            </div>
          </div>

          {/* Right Side - Restaurant Image and Description */}
          <div className="w-full md:w-1/2 space-y-6 md:mt-12">
            <h3 className="text-2xl font-bold uppercase">DINE YOUR WAY – PICK UP OR DELIVERY!</h3>
            <img 
              src={food5}
              alt="Hell's Kitchen Interior" 
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
            <div className="space-y-4">
              <p className="text-gray-300 font-montserrat">
                Enjoy the flavors of Aurum's Kitchen with ease—place a special order and savor your favorites just the way you like. 
                Whether you choose to pick up your meal or have it delivered straight to your doorstep in just 20 minutes, we bring the luxury of fine dining to you.
              </p>
              <button className="bg-[#B8860B] text-white px-6 py-3 rounded-md uppercase font-semibold hover:bg-[#9C7A40] transition duration-300" 
                onClick={() => navigate("/order-takeaway")} // Updated route for takeaway
              >
                Order Now
              </button>
            </div>
          </div>

        </div>
      </div>
  </div>
  );
};

export default Content;