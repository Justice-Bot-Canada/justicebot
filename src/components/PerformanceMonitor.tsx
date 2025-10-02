import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoadedTime: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
}

class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: PerformanceMetrics | null = null;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  public static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async saveToDatabase(eventType: string, metrics: any): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('analytics_events').insert({
        event_type: eventType,
        page_url: window.location.pathname,
        user_id: user?.id || null,
        session_id: this.sessionId,
        metrics: metrics,
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }

  public collectMetrics(): void {
    if (typeof window === 'undefined' || !window.performance) return;

    // Basic navigation timing
    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    this.metrics = {
      pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      domContentLoadedTime: navigation.domContentLoadedEventEnd - navigation.fetchStart,
    };

    // Web Vitals
    this.collectWebVitals();
    
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Page Load Time:', `${this.metrics.pageLoadTime}ms`);
      console.log('DOM Content Loaded:', `${this.metrics.domContentLoadedTime}ms`);
    }

    // Save to database
    this.saveToDatabase('page_load', this.metrics);
  }

  private collectWebVitals(): void {
    if (!window.PerformanceObserver) return;

    // First Contentful Paint (FCP)
    try {
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint' && this.metrics) {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        });
      });
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('FCP observation failed:', error);
    }

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (this.metrics) {
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('LCP observation failed:', error);
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsScore = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsScore += (entry as any).value;
          }
        }
        if (this.metrics) {
          this.metrics.cumulativeLayoutShift = clsScore;
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('CLS observation failed:', error);
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (this.metrics) {
            this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
          }
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('FID observation failed:', error);
    }
  }

  public getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  public reportError(error: Error, errorInfo?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('🔥 Error Report:', error);
      if (errorInfo) {
        console.error('Error Info:', errorInfo);
      }
    }

    // In production, you would send this to your analytics service
    // analytics.track('error', {
    //   error: error.message,
    //   stack: error.stack,
    //   url: window.location.href,
    //   userAgent: navigator.userAgent,
    //   timestamp: new Date().toISOString()
    // });
  }
}

export const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    const tracker = PerformanceTracker.getInstance();
    
    // Collect metrics after page load
    if (document.readyState === 'complete') {
      tracker.collectMetrics();
    } else {
      window.addEventListener('load', () => {
        tracker.collectMetrics();
      });
    }

    // Error boundary for unhandled errors
    const handleError = (event: ErrorEvent) => {
      tracker.reportError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      tracker.reportError(new Error(`Unhandled Promise Rejection: ${event.reason}`));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
};

export { PerformanceTracker };