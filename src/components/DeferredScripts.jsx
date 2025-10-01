import { useEffect } from 'react';

/**
 * DeferredScripts - Loads non-critical scripts after page is interactive
 * This improves Time to Interactive (TTI) by deferring analytics and tracking
 */
const DeferredScripts = () => {
  useEffect(() => {
    // Wait for page to be interactive before loading analytics
    const loadDeferredScripts = () => {
      // Check if Google Tag Manager is already loaded
      if (window.gtag) return;
      
      // Load Google Analytics/GTM
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-7X8Z9633RK';
      
      gtagScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-7X8Z9633RK', {
          page_path: window.location.pathname,
        });
        window.gtag = gtag;
      };
      
      document.head.appendChild(gtagScript);
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadDeferredScripts, { timeout: 2000 });
    } else {
      setTimeout(loadDeferredScripts, 2000);
    }
  }, []);

  return null;
};

export default DeferredScripts;
