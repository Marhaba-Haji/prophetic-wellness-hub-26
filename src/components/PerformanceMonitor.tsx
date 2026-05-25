import React, { useEffect } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    // Only run in development
    if (!import.meta.env.DEV) return;

    const measurePerformance = () => {
      const metrics: Partial<PerformanceMetrics> = {};

      // Navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      }

      // Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                metrics.firstContentfulPaint = entry.startTime;
              }
              break;
            case 'largest-contentful-paint':
              metrics.largestContentfulPaint = entry.startTime;
              break;
            case 'first-input':
              metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
              break;
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                metrics.cumulativeLayoutShift = (metrics.cumulativeLayoutShift || 0) + (entry as any).value;
              }
              break;
          }
        }

        // Log metrics after a delay to ensure all metrics are collected
        setTimeout(() => {
          console.group('🚀 Blog Performance Metrics');
          console.log('📊 Load Time:', metrics.loadTime?.toFixed(2) + 'ms');
          console.log('📊 DOM Content Loaded:', metrics.domContentLoaded?.toFixed(2) + 'ms');
          console.log('📊 First Contentful Paint:', metrics.firstContentfulPaint?.toFixed(2) + 'ms');
          console.log('📊 Largest Contentful Paint:', metrics.largestContentfulPaint?.toFixed(2) + 'ms');
          console.log('📊 First Input Delay:', metrics.firstInputDelay?.toFixed(2) + 'ms');
          console.log('📊 Cumulative Layout Shift:', metrics.cumulativeLayoutShift?.toFixed(4));
          
          // Performance assessment
          const assessment = [];
          if (metrics.largestContentfulPaint && metrics.largestContentfulPaint < 2500) {
            assessment.push('✅ LCP: Good (< 2.5s)');
          } else if (metrics.largestContentfulPaint) {
            assessment.push('⚠️ LCP: Needs improvement (> 2.5s)');
          }
          
          if (metrics.firstInputDelay && metrics.firstInputDelay < 100) {
            assessment.push('✅ FID: Good (< 100ms)');
          } else if (metrics.firstInputDelay) {
            assessment.push('⚠️ FID: Needs improvement (> 100ms)');
          }
          
          if (metrics.cumulativeLayoutShift && metrics.cumulativeLayoutShift < 0.1) {
            assessment.push('✅ CLS: Good (< 0.1)');
          } else if (metrics.cumulativeLayoutShift) {
            assessment.push('⚠️ CLS: Needs improvement (> 0.1)');
          }
          
          if (assessment.length > 0) {
            console.log('🎯 Assessment:', assessment.join(', '));
          }
          
          console.groupEnd();
        }, 2000);
      });

      // Observe different performance entry types
      try {
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (e) {
        console.log('Performance monitoring not fully supported in this browser');
      }

      // Cleanup
      return () => observer.disconnect();
    };

    const cleanup = measurePerformance();
    return cleanup;
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;