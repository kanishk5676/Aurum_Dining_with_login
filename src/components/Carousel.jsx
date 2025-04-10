import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Note: Actual image imports remain unchanged
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
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative w-full mx-auto h-[60vh] md:h-[70vh] overflow-hidden"> {/* Reduced height here */}
      {/* Image Slider Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0 relative h-full">
            <div className="absolute inset-0 bg-black/30 z-10" /> {/* Overlay */}
            <img 
              src={image.src} 
              alt={`carousel-image-${index}`} 
              className="w-full h-full object-cover transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* Text Animation Container */}
      <div className="absolute top-1/4 left-4 md:left-16 lg:left-32 text-white text-left z-20 transition-opacity duration-300">
        <div className="flex flex-col text-3xl md:text-5xl font-bold uppercase tracking-wider space-y-2">
          {images[currentIndex].title.map((word, i) => (
            <span 
              key={i}
              className="transform transition-all duration-700 opacity-100 translate-y-0"
              style={{
                animationDelay: `${i * 0.2}s`,
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
              }}
            >
              {word}
            </span>
          ))}
        </div>
        <p className="text-base md:text-lg mt-4 font-montserrat max-w-md backdrop-blur-sm bg-black/20 px-4 py-2 rounded-md transition-all duration-700">
          {images[currentIndex].subtitle}
        </p>
        <button className="mt-6 px-5 py-2 bg-[#B8860B] text-white uppercase font-bold rounded text-sm hover:bg-[#9C7A40] transition-all duration-300 transform hover:scale-105">
          Explore Menu
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full z-20 hover:bg-black/60 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full z-20 hover:bg-black/60 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index 
                ? "bg-white w-5" 
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;