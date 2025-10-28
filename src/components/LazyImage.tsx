import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
  placeholderSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  fetchpriority?: 'high' | 'low' | 'auto';
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  width,
  height,
  placeholderSrc,
  onLoad,
  onError,
  fetchpriority = 'auto'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (loading === 'eager') return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '100px' } // Load earlier for better UX
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Loading state */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <svg
            className="w-8 h-8 text-muted-foreground/50"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground"
          style={{ width, height }}
        >
          <span className="text-sm">Failed to load image</span>
        </div>
      )}

      {/* Actual image */}
      {(isInView || loading === 'eager') && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          fetchPriority={fetchpriority}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          decoding="async"
        />
      )}
    </div>
  );
};

export default LazyImage;