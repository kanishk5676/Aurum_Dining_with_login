import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import food1 from "../assets/food1.jpg";
import food2 from "../assets/food2.jpg";
import food6 from "../assets/food6.avif";
import restaurant from "../assets/restaurant1.avif";

const images = [
  { src: food1, title: ["Rise", "and", "Dine"], subtitle: "Start your day with a feast of flavors." },
  { src: food2, title: ["An Experience", "Like", "No Other"], subtitle: "A journey of taste, crafted to perfection." },
  { src: restaurant, title: ["Aesthetic", "Ambience"], subtitle: "Dine in luxury with a view to remember." },
  { src: food6, title: ["Our", "Signature", "Dishes"], subtitle: "Crafted by master chefs for a perfect bite." }
];

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full mx-auto h-screen overflow-hidden">
      {/* Image Slider Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}vw)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-screen flex-shrink-0 relative">
            <img src={image.src} alt="carousel" className="w-full h-screen object-cover" />
          </div>
        ))}
      </div>

      {/* Conditional Rendering: Show Text Only for Active Image */}
      <div className="absolute top-1/3 left-16 md:left-32 text-white text-left">
        <div className="flex flex-col text-6xl font-bold uppercase tracking-wide drop-shadow-lg">
          {images[currentIndex].title.map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </div>
        <p className="text-xl mt-4 drop-shadow-md px-4 py-2 rounded-md font-montserrat">
          {images[currentIndex].subtitle}
        </p>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full z-20"
      >
        <FaChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full z-20"
      >
        <FaChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
