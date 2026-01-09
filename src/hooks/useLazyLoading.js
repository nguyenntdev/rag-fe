import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for lazy loading images with IntersectionObserver
 * Provides optimized image loading with placeholder support
 */
export function useLazyLoading(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    placeholder = null,
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(null);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
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

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setError(null);
  }, []);

  const handleError = useCallback((err) => {
    setError(err);
    setIsLoaded(false);
  }, []);

  return {
    ref: elementRef,
    isLoaded,
    isInView,
    error,
    handleLoad,
    handleError,
    placeholder,
  };
}

/**
 * Custom hook for lazy loading multiple images
 * Useful for galleries or lists of images
 */
export function useLazyLoadingBatch(imageUrls, options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    batchSize = 5,
  } = options;

  const [loadedImages, setLoadedImages] = useState(new Set());
  const [visibleImages, setVisibleImages] = useState(new Set());
  const [errors, setErrors] = useState(new Map());
  const containerRef = useRef(null);
  const imageRefs = useRef(new Map());

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setVisibleImages(new Set(imageUrls));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const url = entry.target.dataset.src;
          if (entry.isIntersecting && url) {
            setVisibleImages((prev) => new Set([...prev, url]));
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [imageUrls, threshold, rootMargin]);

  const setImageRef = useCallback((url) => (element) => {
    if (element) {
      imageRefs.current.set(url, element);
    }
  }, []);

  const handleImageLoad = useCallback((url) => () => {
    setLoadedImages((prev) => new Set([...prev, url]));
    setErrors((prev) => {
      const next = new Map(prev);
      next.delete(url);
      return next;
    });
  }, []);

  const handleImageError = useCallback((url) => (error) => {
    setErrors((prev) => new Map([...prev, [url, error]]));
  }, []);

  const isImageVisible = useCallback((url) => visibleImages.has(url), [visibleImages]);
  const isImageLoaded = useCallback((url) => loadedImages.has(url), [loadedImages]);
  const getImageError = useCallback((url) => errors.get(url), [errors]);

  return {
    containerRef,
    setImageRef,
    handleImageLoad,
    handleImageError,
    isImageVisible,
    isImageLoaded,
    getImageError,
    loadedCount: loadedImages.size,
    totalCount: imageUrls.length,
  };
}

/**
 * Progressive image loading hook
 * Loads a low-quality placeholder first, then the full image
 */
export function useProgressiveImage(lowQualitySrc, highQualitySrc, options = {}) {
  const { onLoad, onError } = options;

  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!highQualitySrc) return;

    setIsLoading(true);
    setError(null);

    const img = new Image();

    img.onload = () => {
      setCurrentSrc(highQualitySrc);
      setIsHighQualityLoaded(true);
      setIsLoading(false);
      onLoad?.();
    };

    img.onerror = (err) => {
      setError(err);
      setIsLoading(false);
      onError?.(err);
    };

    img.src = highQualitySrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [highQualitySrc, onLoad, onError]);

  return {
    src: currentSrc,
    isHighQualityLoaded,
    isLoading,
    error,
    blur: !isHighQualityLoaded,
  };
}

/**
 * Preload images utility
 * Preloads a list of images in the background
 */
export function preloadImages(urls, options = {}) {
  const { priority = 'low', onProgress, onComplete } = options;

  let loadedCount = 0;
  const totalCount = urls.length;
  const results = new Map();

  return new Promise((resolve) => {
    if (urls.length === 0) {
      onComplete?.(results);
      resolve(results);
      return;
    }

    urls.forEach((url) => {
      const img = new Image();

      // Set loading priority if supported
      if ('fetchPriority' in img) {
        img.fetchPriority = priority;
      }

      img.onload = () => {
        results.set(url, { success: true, width: img.width, height: img.height });
        loadedCount++;
        onProgress?.(loadedCount, totalCount);

        if (loadedCount === totalCount) {
          onComplete?.(results);
          resolve(results);
        }
      };

      img.onerror = (error) => {
        results.set(url, { success: false, error });
        loadedCount++;
        onProgress?.(loadedCount, totalCount);

        if (loadedCount === totalCount) {
          onComplete?.(results);
          resolve(results);
        }
      };

      img.src = url;
    });
  });
}

/**
 * Image dimensions hook
 * Gets the natural dimensions of an image
 */
export function useImageDimensions(src) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) return;

    setIsLoading(true);
    setError(null);

    const img = new Image();

    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setIsLoading(false);
    };

    img.onerror = (err) => {
      setError(err);
      setIsLoading(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { dimensions, isLoading, error, aspectRatio: dimensions.width / dimensions.height || 1 };
}

export default useLazyLoading;
