import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DemoCard from './DemoCard';

const ImprovedDemoCarousel = ({ title, demos, description, onSelectDemo }) => {
  const carouselRef = useRef(null);
  const scrollbarRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollWidthPercentage, setScrollWidthPercentage] = useState(0);

  // Aktualisiert die Scroll-Informationen (Pfeile, Fortschritt, Scrollbar)
  const updateScrollInfo = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const isAtStart = scrollLeft <= 10;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
    setShowLeftArrow(!isAtStart);
    setShowRightArrow(!isAtEnd);

    const maxScrollLeft = scrollWidth - clientWidth;
    const progress = maxScrollLeft <= 0 ? 0 : scrollLeft / maxScrollLeft;
    setScrollProgress(progress);
    setScrollWidthPercentage(maxScrollLeft <= 0 ? 0 : (clientWidth / scrollWidth) * 100);
  }, []);

  // Prüft bei Resize, ob die Ansicht mobil ist, und aktualisiert die Scroll-Infos
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      updateScrollInfo();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateScrollInfo]);

  // Registriert Scroll- und Wheel-Event-Listener
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener('scroll', updateScrollInfo);
    carousel.addEventListener('wheel', handleWheel, { passive: false });
    updateScrollInfo();

    return () => {
      carousel.removeEventListener('scroll', updateScrollInfo);
      carousel.removeEventListener('wheel', handleWheel);
    };
  }, [updateScrollInfo, demos]);

  // Behandelt das Wheel-Event für horizontales Scrollen
  const handleWheel = (e) => {
    if (!carouselRef.current) return;
    if (carouselRef.current.contains(e.target) && e.deltaY !== 0) {
      e.preventDefault();
      carouselRef.current.scrollLeft += e.deltaY;
    }
  };

  // Hilfsfunktion für das Scrollen um einen bestimmten Betrag
  const scrollByAmount = (amount) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: amount,
      behavior: 'smooth'
    });
  };

  // Linker Navigations-Button
  const handleScrollLeft = (e) => {
    e.stopPropagation();
    const card = carouselRef.current.querySelector('div');
    const cardWidth = card ? card.offsetWidth : 300;
    const gap = 24;
    scrollByAmount(-(cardWidth + gap));
  };

  // Rechter Navigations-Button
  const handleScrollRight = (e) => {
    e.stopPropagation();
    const card = carouselRef.current.querySelector('div');
    const cardWidth = card ? card.offsetWidth : 300;
    const gap = 24;
    scrollByAmount(cardWidth + gap);
  };

  // Klick auf die benutzerdefinierte Scrollbar
  const handleScrollbarClick = (e) => {
    if (!carouselRef.current || !scrollbarRef.current) return;
    const { left, width } = scrollbarRef.current.getBoundingClientRect();
    const clickX = e.clientX - left;
    const clickRatio = clickX / width;
    const { scrollWidth, clientWidth } = carouselRef.current;
    carouselRef.current.scrollTo({
      left: clickRatio * (scrollWidth - clientWidth),
      behavior: 'smooth'
    });
  };

  // Beginnt den Drag-Vorgang
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    dragStartX.current = e.pageX;
    dragStartScrollLeft.current = carouselRef.current.scrollLeft;
    isDraggingRef.current = false;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp, { once: true });
  };

  // Bewegt das Carousel beim Drag
  const handleMouseMove = (e) => {
    const diff = e.pageX - dragStartX.current;
    if (!isDraggingRef.current && Math.abs(diff) > 5) {
      isDraggingRef.current = true;
      carouselRef.current.style.cursor = 'grabbing';
    }
    if (isDraggingRef.current) {
      carouselRef.current.scrollLeft = dragStartScrollLeft.current - diff;
    }
  };

  // Beendet den Drag-Vorgang
  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (carouselRef.current) {
        carouselRef.current.style.cursor = 'grab';
      }
    }
    document.removeEventListener('mousemove', handleMouseMove);
  };

  // Selektiert eine Demo nur, wenn kein Drag stattgefunden hat
  const handleCardSelect = (demo) => {
    if (!isDraggingRef.current) {
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
          {description && (
            <p className="text-gray-400 text-sm mt-2 ml-4">{description}</p>
          )}
        </div>
      </div>

      <div className="relative group">
        {showLeftArrow && (
          <button
            onClick={handleScrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/90 text-white hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <div
          ref={carouselRef}
          className="flex overflow-x-auto pb-4 gap-6 relative scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollSnapType: isMobile ? 'x mandatory' : 'none',
            WebkitOverflowScrolling: 'touch',
            cursor: 'grab',
            paddingLeft: '5px',
            paddingRight: '5px'
          }}
          onScroll={updateScrollInfo}
          onMouseDown={handleMouseDown}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {demos.map((demo) => (
            <div
              key={demo.id}
              style={{
                scrollSnapAlign: isMobile ? 'start' : 'none',
                flexShrink: 0,
                overflow: 'hidden'
              }}
              className="card-container"
            >
              <div onClick={() => handleCardSelect(demo)}>
                <DemoCard demo={demo} onSelect={onSelectDemo} />
              </div>
            </div>
          ))}
        </div>

        {demos.length > 4 && (
          <div
            ref={scrollbarRef}
            className="h-1.5 bg-gray-700/30 rounded-full mt-4 mb-2 relative cursor-pointer hidden md:block"
            onClick={handleScrollbarClick}
          >
            <div
              className="absolute top-0 h-full bg-yellow-400/70 rounded-full transition-all duration-100 ease-out"
              style={{
                width: `${scrollWidthPercentage}%`,
                left: `${scrollProgress * (100 - scrollWidthPercentage)}%`
              }}
            ></div>
          </div>
        )}

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
