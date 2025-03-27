import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import food1 from "../assets/food1.jpg";
import food2 from "../assets/food2.jpg";
import food3 from "../assets/food3.jpg";
import food4 from "../assets/food4.avif";

const images=[
    food1,food2,food3,food4
];

function Content() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-screen h-[500px] mt-20 bg-black z-10">
      <div className="overflow-hidden w-full h-full flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt="carousel"
          className="max-w-full max-h-full object-contain"
        />
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

export default Content;