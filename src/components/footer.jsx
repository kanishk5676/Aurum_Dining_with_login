import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      {/* Footer top with background pattern */}
      <div 
        className="relative py-16 px-4 md:px-8 lg:px-16" 
        style={{ 
          backgroundImage: 'url(/images/hk-background.png)',
          backgroundSize: '100px 100px'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/90" />
        
        <div className="relative max-w-7xl mx-auto z-10">
          {/* Gold separator line */}
          <div className="w-24 h-1 bg-[#B8860B] mx-auto mb-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* About Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold uppercase tracking-wider">Vijaya's Kitchen</h3>
              <p className="text-gray-300 font-montserrat leading-relaxed">
                Experience the finest cuisine in an elegant setting. Our award-winning chefs 
                create unforgettable dishes using only the freshest ingredients.
              </p>
              <div className="flex space-x-4">
                <a href="https://instagram.com" className="text-gray-300 hover:text-[#B8860B] transition-colors">
                  <Instagram size={22} />
                </a>
                <a href="https://facebook.com" className="text-gray-300 hover:text-[#B8860B] transition-colors">
                  <Facebook size={22} />
                </a>
                <a href="https://twitter.com" className="text-gray-300 hover:text-[#B8860B] transition-colors">
                  <Twitter size={22} />
                </a>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold uppercase tracking-wider">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin size={20} className="text-[#B8860B] mt-1 flex-shrink-0" />
                  <span className="text-gray-300">123 Gourmet Avenue, Culinary District, NY 10001</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone size={20} className="text-[#B8860B] flex-shrink-0" />
                  <span className="text-gray-300">(555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail size={20} className="text-[#B8860B] flex-shrink-0" />
                  <span className="text-gray-300">info@vijayaskitchen.com</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Clock size={20} className="text-[#B8860B] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">Mon-Fri: 11am-10pm</p>
                    <p className="text-gray-300">Sat-Sun: 10am-11pm</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/menu" className="text-gray-300 hover:text-[#B8860B] transition-colors">
                    Our Menu
                  </Link>
                </li>
                <li>
                  <Link to="/select-date-time" className="text-gray-300 hover:text-[#B8860B] transition-colors">
                    Reservations
                  </Link>
                </li>
                <li>
                  <Link to="/order-takeaway" className="text-gray-300 hover:text-[#B8860B] transition-colors">
                    Order Online
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-[#B8860B] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="text-gray-300 hover:text-[#B8860B] transition-colors">
                    Private Events
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-gray-300 hover:text-[#B8860B] transition-colors">
                    Gallery
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Newsletter */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold uppercase tracking-wider">Newsletter</h3>
              <p className="text-gray-300 font-montserrat">
                Subscribe to our newsletter for special offers, new menu items, and events.
              </p>
              <form className="space-y-3">
                <div>
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-[#B8860B] text-white"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#B8860B] text-white px-6 py-3 rounded uppercase font-semibold hover:bg-[#9C7A40] transition duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer bottom */}
      <div className="py-6 bg-black/80 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Vijaya's Kitchen. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 text-sm hover:text-[#B8860B] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 text-sm hover:text-[#B8860B] transition-colors">
              Terms of Service
            </Link>
            <Link to="/sitemap" className="text-gray-400 text-sm hover:text-[#B8860B] transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;