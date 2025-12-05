'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const DUMMY_IMAGES = [
  'https://images.unsplash.com/photo-1594402919317-9e67dca0a305?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGhvc3BpdGFsaXR5fGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1469631423273-6995642a6a40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGhvc3BpdGFsaXR5fGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1683914791874-2dcb78e58e09?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGhvc3BpdGFsaXR5fGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGhvc3BpdGFsaXR5fGVufDB8fDB8fHww',
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
