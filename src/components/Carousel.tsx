'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const DUMMY_IMAGES = [
  'https://plus.unsplash.com/premium_photo-1664299335717-71d868cd964e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9zcGl0YWxpdHklMjBob3RlbHxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1689729738817-fb1f4256769d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGhvc3BpdGFsaXR5JTIwaG90ZWx8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1623718649591-311775a30c43?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWwlMjBwb29sfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1728051104103-64479a8ecf48?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fGhvdGVsJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
];

const HeroImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DUMMY_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-xl shadow-2xl sm:h-96 lg:h-full">
      {DUMMY_IMAGES.map((img, i) => (
        <Image
          key={i}
          src={img}
          alt={`Hero Image ${i + 1}`}
          fill
          className={`object-cover transition-opacity duration-1000 ${
            i === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

export default HeroImageCarousel;
