import { useState, useRef, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * LazyImage Component
 * Optimized image loading with IntersectionObserver, placeholder, and error handling
 */
export function LazyImage({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  errorClassName = '',
  width,
  height,
  aspectRatio,
  placeholder = null,
  fallback = null,
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  blur = true,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // If IntersectionObserver is not supported, load immediately
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = (e) => {
    setHasError(true);
    setIsLoaded(false);
    onError?.(e);
  };

  // Calculate aspect ratio padding if provided
  const paddingBottom = aspectRatio ? `${(1 / aspectRatio) * 100}%` : undefined;

  // Error fallback
  if (hasError) {
    if (fallback) {
      return fallback;
    }

    return (
      <div
        ref={containerRef}
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 ${errorClassName || className}`}
        style={{ width, height, paddingBottom: paddingBottom && !height ? paddingBottom : undefined }}
      >
        <div className="text-center p-4">
          <ImageOff className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Không thể tải ảnh</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${!isLoaded ? placeholderClassName : ''}`}
      style={{ width, height, paddingBottom: paddingBottom && !height ? paddingBottom : undefined }}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 animate-pulse">
          {placeholder || (
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Actual image - only load when in view */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`${className} ${
            blur && !isLoaded ? 'blur-sm scale-105' : 'blur-0 scale-100'
          } transition-all duration-300`}
          style={{
            opacity: isLoaded ? 1 : 0,
            width: width || '100%',
            height: height || '100%',
            objectFit: 'cover',
          }}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
}

/**
 * LazyBackgroundImage Component
 * Lazy loading for background images
 */
export function LazyBackgroundImage({
  src,
  className = '',
  children,
  placeholder = null,
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '100px',
  style = {},
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  // Load background image when in view
  useEffect(() => {
    if (!isInView || !src) return;

    const img = new Image();

    img.onload = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    img.onerror = (e) => {
      setHasError(true);
      onError?.(e);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isInView, src, onLoad, onError]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        ...style,
        backgroundImage: isLoaded && !hasError ? `url(${src})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      {...props}
    >
      {/* Placeholder overlay */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 animate-pulse">
          {placeholder}
        </div>
      )}

      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <ImageOff className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
      )}

      {/* Children content */}
      {children}
    </div>
  );
}

export default LazyImage;
