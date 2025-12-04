'use client';
import React, { useState, useEffect } from 'react';

// Replace these with your actual image paths
// Updated DUMMY_IMAGES for quick testing with placeholders
const DUMMY_IMAGES = [
  'https://via.placeholder.com/1200x800?text=Luxury+Suite+1',
  'https://via.placeholder.com/1200x800?text=Grand+Lobby+2',
  'https://via.placeholder.com/1200x800?text=Rooftop+Pool+3',
];

// Note: You must ensure these dummy paths exist in your /public/images folder
// or update the paths above.

const HeroImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Set up a timer to cycle images every 5 seconds (5000ms)
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % DUMMY_IMAGES.length);
    }, 5000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this runs once on mount

  // Map the current image URL
  const currentImageUrl = DUMMY_IMAGES[currentIndex];

  return (
    <div
      className="relative h-72 w-full rounded-xl bg-cover bg-center shadow-2xl transition-opacity duration-1000 ease-in-out sm:h-96 lg:h-full"
      style={{
        backgroundImage: `url('${currentImageUrl}')`,
        // Ensures the background image always fills the container
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Optional: Indicator for image transition (fade effect is handled by transition-opacity) */}
      <div className="absolute inset-0 rounded-xl bg-black/10" />
    </div>
  );
};

export default HeroImageCarousel;
