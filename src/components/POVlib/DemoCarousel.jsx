import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DemoCard from './DemoCard';

const ImprovedDemoCarousel = ({ title, demos, description, onSelectDemo }) => {
  const carouselRef = useRef(null);
  const scrollbarRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Update scroll information
  const updateScrollInfo = () => {
    if (!carouselRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const isScrolledToStart = scrollLeft <= 10;
    const isScrolledToEnd = scrollLeft + clientWidth >= scrollWidth - 10;
    
    setShowLeftArrow(!isScrolledToStart);
    setShowRightArrow(!isScrolledToEnd);
    
    // Calculate scroll progress for custom scrollbar
    const maxScrollLeft = scrollWidth - clientWidth;
    const progress = maxScrollLeft <= 0 ? 0 : (scrollLeft / maxScrollLeft);
    setScrollProgress(progress);
    setScrollWidth(maxScrollLeft <= 0 ? 0 : (clientWidth / scrollWidth) * 100);
  };

  // Register scroll event
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', updateScrollInfo);
      // Initial check
      updateScrollInfo();
      
      // Also check when window resizes
      window.addEventListener('resize', updateScrollInfo);
      
      return () => {
        carousel.removeEventListener('scroll', updateScrollInfo);
        window.removeEventListener('resize', updateScrollInfo);
      };
    }
  }, [demos]);

  // Handle navigation clicks
  const handleScrollLeft = (e) => {
    e.stopPropagation(); // Prevent click from reaching cards underneath
    if (!carouselRef.current) return;
    
    const cardWidth = carouselRef.current.querySelector('div')?.offsetWidth || 300;
    const gap = 24; // Equivalent to the gap-6 class (6 * 4px)
    const scrollAmount = cardWidth + gap;
    
    carouselRef.current.scrollBy({ 
      left: -scrollAmount, 
      behavior: 'smooth' 
    });
  };

  const handleScrollRight = (e) => {
    e.stopPropagation(); // Prevent click from reaching cards underneath
    if (!carouselRef.current) return;
    
    const cardWidth = carouselRef.current.querySelector('div')?.offsetWidth || 300;
    const gap = 24; // Equivalent to the gap-6 class (6 * 4px)
    const scrollAmount = cardWidth + gap;
    
    carouselRef.current.scrollBy({ 
      left: scrollAmount, 
      behavior: 'smooth' 
    });
  };

  // Custom scrollbar click handler
  const handleScrollbarClick = (e) => {
    if (!carouselRef.current || !scrollbarRef.current) return;
    
    const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - scrollbarRect.left;
    const scrollPercentage = clickPosition / scrollbarRect.width;
    
    const { scrollWidth, clientWidth } = carouselRef.current;
    const targetScrollLeft = scrollPercentage * (scrollWidth - clientWidth);
    
    carouselRef.current.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });
  };

  // Touch and mouse drag handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only handle left mouse button
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(carouselRef.current.scrollLeft);
    carouselRef.current.style.cursor = 'grabbing';
    e.preventDefault(); // Prevent text selection during drag
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    carouselRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (startX - x) * 1.5; // Scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft + walk;
  };

  // Handle mouse leave to prevent stuck dragging state
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (carouselRef.current) {
        carouselRef.current.style.cursor = 'grab';
      }
    }
  };

  // Handle mouse wheel for horizontal scrolling
  const handleWheel = (e) => {
    if (!carouselRef.current) return;
    
    if (e.deltaY !== 0) {
      e.preventDefault(); // Prevent vertical scrolling
      carouselRef.current.scrollLeft += e.deltaY;
    }
  };

  // Handle card selection only if not dragging
  const handleCardSelect = (demo) => {
    if (!isDragging) {
      onSelectDemo(demo);
    }
  };

  if (!demos || demos.length === 0) return null;
  
  return (
    <div className="mb-16 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-gray-100 text-2xl font-bold">
            <span className="border-l-4 border-yellow-400 pl-3 py-1">{title}</span>
          </h2>
          {description && <p className="text-gray-400 text-sm mt-2 ml-4">{description}</p>}
        </div>
      </div>
      
      {/* Carousel container */}
      <div className="relative group">
        {/* Left navigation button */}
        {showLeftArrow && (
          <button 
            onClick={handleScrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/90 text-white hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
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
            WebkitOverflowScrolling: 'touch',
            cursor: isDragging ? 'grabbing' : 'grab',
            paddingLeft: '5px',
            paddingRight: '5px'
          }}
          onScroll={updateScrollInfo}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
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
                flexShrink: 0,
                // Limit the scale to prevent overflow
                overflow: 'hidden'
              }}
              className="card-container"
            >
              <div 
                className={`${isDragging ? 'pointer-events-none' : ''}`}
                onClick={(e) => {
                  // Only call onSelectDemo if we're not dragging
                  if (!isDragging) {
                    handleCardSelect(demo);
                  }
                }}
              >
                <DemoCard demo={demo} onSelect={() => {}} />
              </div>
            </div>
          ))}
        </div>
        
        {/* Custom scrollbar */}
        {demos.length > 4 && (
          <div 
            ref={scrollbarRef}
            className="h-1.5 bg-gray-700/30 rounded-full mt-4 mb-2 relative cursor-pointer hidden md:block"
            onClick={handleScrollbarClick}
          >
            <div 
              className="absolute top-0 h-full bg-yellow-400/70 rounded-full transition-all duration-100 ease-out"
              style={{ 
                width: `${scrollWidth}%`, 
                left: `${scrollProgress * (100 - scrollWidth)}%` 
              }}
            ></div>
          </div>
        )}
        
        {/* Right navigation button */}
        {showRightArrow && (
          <button 
            onClick={handleScrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/90 text-white hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 group-hover:-translate-x-1"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>
      
      {/* Mobile dots indicator (optional) */}
      {isMobile && demos.length > 4 && (
        <div className="flex justify-center mt-2 gap-1">
          {[...Array(Math.ceil(demos.length / 2))].map((_, idx) => (
            <div 
              key={idx} 
              className={`w-1.5 h-1.5 rounded-full ${
                scrollProgress * 10 >= idx && scrollProgress * 10 < idx + 1 
                  ? 'bg-yellow-400' 
                  : 'bg-gray-600'
              }`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImprovedDemoCarousel;