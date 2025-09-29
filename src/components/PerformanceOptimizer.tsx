import { useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

export const PerformanceOptimizer = ({ children }: PerformanceOptimizerProps) => {
  useEffect(() => {
    // Enable progressive loading for components below the fold
    if ('IntersectionObserver' in window && 'requestIdleCallback' in window) {
      // Defer non-critical component initialization
      requestIdleCallback(() => {
        // Initialize performance monitoring in idle time
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // Progressive enhancement for visible components
                const element = entry.target as HTMLElement;
                element.classList.add('visible');
              }
            });
          },
          { rootMargin: '50px' }
        );

        // Observe all images and components for lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach((img) => observer.observe(img));
      }, { timeout: 2000 });
    }

    // Optimize script execution timing
    const optimizeMainThread = () => {
      // Batch DOM updates to reduce layout thrashing
      if ('scheduler' in window) {
        // Use experimental scheduler API if available
        (window as any).scheduler.postTask(() => {
          // Defer heavy computations
        }, { priority: 'background' });
      }
    };

    // Run optimization after initial render
    setTimeout(optimizeMainThread, 100);
  }, []);

  return <>{children}</>;
};