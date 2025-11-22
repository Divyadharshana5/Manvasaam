/**
 * Performance monitoring utilities for responsive pages
 */

export const performanceMonitor = {
  /**
   * Measure page load performance
   */
  measurePageLoad: () => {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      console.log('Performance Metrics:', {
        pageLoadTime: `${pageLoadTime}ms`,
        connectTime: `${connectTime}ms`,
        renderTime: `${renderTime}ms`,
      });
    });
  },

  /**
   * Detect slow frames (< 60fps)
   */
  detectSlowFrames: () => {
    if (typeof window === 'undefined') return;

    let lastTime = performance.now();
    let frames = 0;
    let slowFrames = 0;

    const checkFrame = () => {
      const currentTime = performance.now();
      const delta = currentTime - lastTime;
      
      frames++;
      
      // Frame took longer than 16.67ms (60fps threshold)
      if (delta > 16.67) {
        slowFrames++;
      }

      // Log every 100 frames
      if (frames % 100 === 0) {
        const slowPercentage = (slowFrames / frames) * 100;
        if (slowPercentage > 10) {
          console.warn(`Performance Warning: ${slowPercentage.toFixed(1)}% slow frames detected`);
        }
      }

      lastTime = currentTime;
      requestAnimationFrame(checkFrame);
    };

    requestAnimationFrame(checkFrame);
  },

  /**
   * Check if device is mobile
   */
  isMobile: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  },

  /**
   * Check if device is touch-enabled
   */
  isTouchDevice: (): boolean => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  /**
   * Get viewport dimensions
   */
  getViewport: () => {
    if (typeof window === 'undefined') return { width: 0, height: 0 };
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },

  /**
   * Detect slow network connection
   */
  isSlowConnection: (): boolean => {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) return false;
    
    const connection = (navigator as any).connection;
    if (!connection) return false;

    // Check for slow connection types
    const slowTypes = ['slow-2g', '2g', '3g'];
    return slowTypes.includes(connection.effectiveType);
  },

  /**
   * Optimize images based on device
   */
  getOptimalImageSize: (baseSize: number): number => {
    if (typeof window === 'undefined') return baseSize;
    
    const dpr = window.devicePixelRatio || 1;
    const viewport = performanceMonitor.getViewport();
    
    // Reduce image size on mobile
    if (viewport.width < 768) {
      return Math.round(baseSize * 0.5 * dpr);
    }
    
    return Math.round(baseSize * dpr);
  },

  /**
   * Debounce function for resize events
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * Throttle function for scroll events
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Lazy load images
   */
  lazyLoadImages: () => {
    if (typeof window === 'undefined') return;
    
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  },

  /**
   * Preload critical resources
   */
  preloadCriticalResources: (resources: string[]) => {
    if (typeof document === 'undefined') return;
    
    resources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      link.href = resource;
      document.head.appendChild(link);
    });
  },

  /**
   * Monitor memory usage (Chrome only)
   */
  monitorMemory: () => {
    if (typeof window === 'undefined') return;
    
    const performance = (window as any).performance;
    if (performance && performance.memory) {
      const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
      const usedPercentage = (usedJSHeapSize / jsHeapSizeLimit) * 100;
      
      if (usedPercentage > 90) {
        console.warn(`Memory Warning: ${usedPercentage.toFixed(1)}% heap used`);
      }
      
      return {
        used: `${(usedJSHeapSize / 1048576).toFixed(2)} MB`,
        total: `${(totalJSHeapSize / 1048576).toFixed(2)} MB`,
        limit: `${(jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
        percentage: `${usedPercentage.toFixed(1)}%`,
      };
    }
    
    return null;
  },
};

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'development') {
    performanceMonitor.measurePageLoad();
    
    // Log device info
    console.log('Device Info:', {
      isMobile: performanceMonitor.isMobile(),
      isTouch: performanceMonitor.isTouchDevice(),
      viewport: performanceMonitor.getViewport(),
      slowConnection: performanceMonitor.isSlowConnection(),
    });
  }
};
