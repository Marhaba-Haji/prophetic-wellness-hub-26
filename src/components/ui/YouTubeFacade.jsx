import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const YouTubeFacade = ({ videoId, title, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWarmingConnection, setIsWarmingConnection] = useState(false);

  // Preconnect to YouTube on hover to reduce load time when clicked
  const handleMouseEnter = () => {
    if (!isWarmingConnection && !isLoaded) {
      setIsWarmingConnection(true);
      // Warm up the connection
      const linkPreconnect1 = document.createElement('link');
      linkPreconnect1.rel = 'preconnect';
      linkPreconnect1.href = 'https://www.youtube.com';
      document.head.appendChild(linkPreconnect1);
      
      const linkPreconnect2 = document.createElement('link');
      linkPreconnect2.rel = 'preconnect';
      linkPreconnect2.href = 'https://www.google.com';
      document.head.appendChild(linkPreconnect2);
    }
  };

  if (isLoaded) {
    return (
      <iframe
        className={cn("w-full h-full", className)}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        frameBorder="0"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  return (
    <div 
      className={cn(
        "relative w-full h-full bg-black cursor-pointer group flex items-center justify-center",
        "bg-gradient-to-br from-gray-900 to-black",
        className
      )}
      onClick={() => setIsLoaded(true)}
      onMouseEnter={handleMouseEnter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsLoaded(true);
        }
      }}
      aria-label={`Load and play video: ${title}`}
    >
      {/* YouTube thumbnail background - use loading="lazy" for performance */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={`${title} thumbnail`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
      
      {/* Play button */}
      <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
        <PlayCircle 
          className="w-16 h-16 text-white opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
          fill="rgba(255, 0, 0, 0.8)"
        />
      </div>
      
      {/* Loading hint */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Click to load video
        </div>
      </div>
    </div>
  );
};

export default YouTubeFacade;