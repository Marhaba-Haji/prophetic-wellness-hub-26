import React, { useState, useCallback } from 'react';

const OptimizedImage = ({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80,
  placeholder = 'empty',
  blurDataURL = null,
  onLoad = null,
  onError = null,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  // Generate optimized image URL with parameters
  const getOptimizedSrc = (originalSrc) => {
    if (!originalSrc) return '';
    
    // If it's an external image service, add optimization parameters
    if (originalSrc.includes('unsplash.com')) {
      const url = new URL(originalSrc);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('h', height.toString());
      url.searchParams.set('q', quality.toString());
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      return url.toString();
    }
    
    // For other images, return as is
    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(src);
  const fallbackSrc = "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          {placeholder === 'blur' && blurDataURL ? (
            <img
              src={blurDataURL}
              alt=""
              className="w-full h-full object-cover filter blur-sm"
              style={{ width, height }}
            />
          ) : (
            <div className="w-8 h-8 border-2 border-gray-300 border-t-brand-green rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* Main image */}
      <img
        src={optimizedSrc || fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } w-full h-full object-cover`}
        onLoad={handleLoad}
        onError={handleError}
        style={{ width, height }}
      />
    </div>
  );
};

export default OptimizedImage;
