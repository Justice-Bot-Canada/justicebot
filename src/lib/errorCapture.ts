/**
 * Capture console errors and send to GA4 for production debugging
 * This helps identify errors that users see but don't report
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

let isInitialized = false;

export function captureConsoleErrors() {
  // Only run once and only in production
  if (isInitialized || import.meta.env.DEV) {
    return;
  }
  
  isInitialized = true;
  
  const originalError = console.error;
  const originalWarn = console.warn;
  
  // Capture console.error
  console.error = (...args) => {
    originalError.apply(console, args);
    
    // Send to GA4
    if (window.gtag) {
      const errorMessage = args
        .map(arg => {
          if (arg instanceof Error) {
            return `${arg.name}: ${arg.message}`;
          }
          return String(arg);
        })
        .join(' ')
        .slice(0, 200);
      
      window.gtag('event', 'console_error', {
        error_message: errorMessage,
        page_path: window.location.pathname,
        timestamp: Date.now(),
      });
    }
  };
  
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (window.gtag) {
      const reason = event.reason instanceof Error 
        ? event.reason.message 
        : String(event.reason);
      
      window.gtag('event', 'unhandled_rejection', {
        error_message: reason.slice(0, 200),
        page_path: window.location.pathname,
        timestamp: Date.now(),
      });
    }
  });
  
  // Capture global errors
  window.addEventListener('error', (event) => {
    if (window.gtag) {
      window.gtag('event', 'js_error', {
        error_message: event.message?.slice(0, 200) || 'Unknown error',
        error_source: event.filename?.slice(-50) || 'unknown',
        error_line: event.lineno,
        page_path: window.location.pathname,
        timestamp: Date.now(),
      });
    }
  });
  
  console.log('[ErrorCapture] Production error tracking initialized');
}
