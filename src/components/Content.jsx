import React from 'react';
import {useNavigate} from 'react-router-dom';
import { motion } from "framer-motion";
import table from "../assets/reserve-table.avif";
import food5 from "../assets/food5.avif";
import background from "/images/hk-background.png";
import Carousel from "./Carousel";

const Content = () => {
  const navigate = useNavigate();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        duration: 0.8 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <div>
      <Carousel/>
      
      <div 
        id="content" 
        className="bg-repeat text-white py-20 px-4 md:px-8 lg:px-16 relative" 
        style={{ 
          backgroundImage: `url(${background})`,
          backgroundSize: '100px 100px'
        }}
      >
        {/* Elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Title */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center text-4xl md:text-5xl font-bold mb-16 uppercase tracking-wider"
          >
            <span className="text-[#B8860B]">Vijaya's</span> Experience
          </motion.h1>
          
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Left Side - Reservation */}
            <motion.div 
              className="w-full md:w-1/2 space-y-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold uppercase leading-tight">
                Secure Your <span className="text-[#B8860B]">Exclusive</span> Dining Experience
              </motion.h2>
              
              <motion.div variants={itemVariants} className="relative overflow-hidden rounded-lg">
                <img 
                  src={table} 
                  alt="Elegant dining reservation" 
                  className="w-full h-auto object-cover rounded-lg shadow-xl hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-5">
                <p className="text-gray-200 font-montserrat leading-relaxed">
                  Indulge in luxury without the wait—reserve your seat at Vijaya's Kitchen effortlessly. 
                  Plan ahead and guarantee your place at our elegantly curated tables, ensuring an unforgettable 
                  dining experience tailored just for you.
                </p>
                
                <button 
                  className="bg-[#B8860B] text-white px-8 py-3 rounded-md uppercase font-semibold hover:bg-[#9C7A40] transition duration-300 transform hover:scale-105 flex items-center group"
                  onClick={() => navigate("/select-date-time")}
                >
                  <span>Reserve Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>

            {/* Right Side - Delivery/Pickup */}
            <motion.div 
              className="w-full md:w-1/2 space-y-8 md:mt-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.h3 variants={itemVariants} className="text-3xl font-bold uppercase leading-tight">
                Dine Your Way – <span className="text-[#B8860B]">Pick Up</span> or <span className="text-[#B8860B]">Delivery</span>!
              </motion.h3>
              
              <motion.div variants={itemVariants} className="relative overflow-hidden rounded-lg">
                <img 
                  src={food5}
                  alt="Gourmet food delivery" 
                  className="w-full h-auto object-cover rounded-lg shadow-xl hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-5">
                <p className="text-gray-200 font-montserrat leading-relaxed">
                  Enjoy the flavors of Vijaya's Kitchen with ease—place a special order and savor your favorites 
                  just the way you like. Whether you choose to pick up your meal or have it delivered straight 
                  to your doorstep in just 20 minutes, we bring the luxury of fine dining to you.
                </p>
                
                <button 
                  className="bg-[#B8860B] text-white px-8 py-3 rounded-md uppercase font-semibold hover:bg-[#9C7A40] transition duration-300 transform hover:scale-105 flex items-center group"
                  onClick={() => navigate("/order-takeaway")}
                >
                  <span>Order Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;