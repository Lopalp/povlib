import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DemoCard from './DemoCard';

const ImprovedDemoCarousel = ({ title, demos, description, onSelectDemo }) => {
  const carouselRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Update arrow visibility based on scroll position
  const updateArrowVisibility = () => {
    if (!carouselRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const isScrolledToStart = scrollLeft <= 10;
    const isScrolledToEnd = scrollLeft + clientWidth >= scrollWidth - 10;
    
    setShowLeftArrow(!isScrolledToStart);
    setShowRightArrow(!isScrolledToEnd);
  };

  // Register scroll event to update arrow visibility
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', updateArrowVisibility);
      // Initial check
      updateArrowVisibility();
      return () => carousel.removeEventListener('scroll', updateArrowVisibility);
    }
  }, [demos]);

  // Handle navigation clicks
  const handleScrollLeft = () => {
    if (!carouselRef.current) return;
    
    const cardWidth = carouselRef.current.querySelector('div')?.offsetWidth || 300;
    const gap = 24; // Equivalent to the gap-6 class (6 * 4px)
    const scrollAmount = cardWidth + gap;
    
    carouselRef.current.scrollBy({ 
      left: -scrollAmount, 
      behavior: 'smooth' 
    });
  };

  const handleScrollRight = () => {
    if (!carouselRef.current) return;
    
    const cardWidth = carouselRef.current.querySelector('div')?.offsetWidth || 300;
    const gap = 24; // Equivalent to the gap-6 class (6 * 4px)
    const scrollAmount = cardWidth + gap;
    
    carouselRef.current.scrollBy({ 
      left: scrollAmount, 
      behavior: 'smooth' 
    });
  };

  // Touch and mouse drag handlers for mobile
  const handleMouseDown = (e) => {
    if (isMobile) return; // Only use these for desktop
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll faster with multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle mouse leave to prevent stuck dragging state
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  if (!demos || demos.length === 0) return null;
  
  return (
    <div className="mb-12 relative group">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-gray-100 text-2xl font-bold">
            <span className="border-l-4 border-yellow-400 pl-3 py-1">{title}</span>
          </h2>
          {description && <p className="text-gray-400 text-sm mt-2 ml-4">{description}</p>}
        </div>
      </div>
      
      {/* Carousel container with snap scrolling for mobile */}
      <div className="relative">
        {/* Left navigation button */}
        {showLeftArrow && (
          <button 
            onClick={handleScrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-gray-800/90 text-white hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        
        {/* Carousel */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto pb-4 gap-6 relative scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollSnapType: isMobile ? 'x mandatory' : 'none',
            WebkitOverflowScrolling: 'touch'
          }}
          onScroll={updateArrowVisibility}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Hide scrollbar */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {demos.map((demo, index) => (
            <div 
              key={demo.id} 
              style={{ 
                scrollSnapAlign: isMobile ? 'start' : 'none',
                flexShrink: 0
              }}
            >
              <DemoCard demo={demo} onSelect={onSelectDemo} />
            </div>
          ))}
        </div>
        
        {/* Right navigation button */}
        {showRightArrow && (
          <button 
            onClick={handleScrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-gray-800/90 text-white hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>
      
      {/* Dots indicator for mobile */}
      {isMobile && demos.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {/* We could implement dots for navigation here if desired */}
        </div>
      )}
    </div>
  );
};

export default ImprovedDemoCarousel;