/**
 * Performance testing utilities for Justice-Bot application
 */

export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  memoryUsage?: number;
}

export interface ComponentPerformanceTest {
  component: string;
  renderTime: number;
  updateTime: number;
  memoryLeaks: boolean;
}

/**
 * Measures Web Vitals and other performance metrics
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0
  };

  constructor() {
    this.observePerformance();
  }

  private observePerformance() {
    // Observe FCP and LCP
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        });
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.cumulativeLayoutShift = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
        });
      }).observe({ entryTypes: ['first-input'] });
    }

    // Load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    });
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    // Add memory usage if available
    if ('memory' in performance) {
      this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }
    
    return { ...this.metrics };
  }

  /**
   * Check if performance meets acceptable thresholds
   */
  validatePerformance(): { passed: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Web Vitals thresholds
    if (this.metrics.largestContentfulPaint > 2500) {
      issues.push(`LCP too slow: ${this.metrics.largestContentfulPaint}ms (should be < 2500ms)`);
    }
    
    if (this.metrics.firstInputDelay > 100) {
      issues.push(`FID too high: ${this.metrics.firstInputDelay}ms (should be < 100ms)`);
    }
    
    if (this.metrics.cumulativeLayoutShift > 0.1) {
      issues.push(`CLS too high: ${this.metrics.cumulativeLayoutShift} (should be < 0.1)`);
    }
    
    if (this.metrics.loadTime > 3000) {
      issues.push(`Load time too slow: ${this.metrics.loadTime}ms (should be < 3000ms)`);
    }

    return {
      passed: issues.length === 0,
      issues
    };
  }
}

/**
 * Test component rendering performance
 */
export async function testComponentPerformance(
  componentName: string,
  renderFunction: () => void,
  updateFunction?: () => void
): Promise<ComponentPerformanceTest> {
  const startRender = performance.now();
  
  // Measure initial render
  renderFunction();
  const renderTime = performance.now() - startRender;
  
  // Measure update time if update function provided
  let updateTime = 0;
  if (updateFunction) {
    const startUpdate = performance.now();
    updateFunction();
    updateTime = performance.now() - startUpdate;
  }
  
  // Check for memory leaks (simplified)
  const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0;
  
  // Force garbage collection if available (for testing)
  if ('gc' in window) {
    (window as any).gc();
  }
  
  const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;
  const memoryLeaks = memoryAfter > memoryBefore * 1.1; // 10% threshold
  
  return {
    component: componentName,
    renderTime,
    updateTime,
    memoryLeaks
  };
}

/**
 * Simulate slow network conditions for testing
 */
export function simulateSlowNetwork(): void {
  // This would typically be done in a testing environment
  // with network throttling tools
  console.warn('Slow network simulation - implement with testing tools');
}

/**
 * Generate performance report
 */
export function generatePerformanceReport(
  metrics: PerformanceMetrics,
  componentTests: ComponentPerformanceTest[]
): string {
  const validation = new PerformanceMonitor().validatePerformance();
  
  let report = '# Performance Test Report\n\n';
  
  // Web Vitals
  report += '## Web Vitals\n';
  report += `- **First Contentful Paint**: ${metrics.firstContentfulPaint.toFixed(2)}ms\n`;
  report += `- **Largest Contentful Paint**: ${metrics.largestContentfulPaint.toFixed(2)}ms\n`;
  report += `- **First Input Delay**: ${metrics.firstInputDelay.toFixed(2)}ms\n`;
  report += `- **Cumulative Layout Shift**: ${metrics.cumulativeLayoutShift.toFixed(3)}\n`;
  report += `- **Load Time**: ${metrics.loadTime.toFixed(2)}ms\n\n`;
  
  if (metrics.memoryUsage) {
    report += `- **Memory Usage**: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB\n\n`;
  }
  
  // Validation results
  report += '## Validation Results\n';
  report += `**Status**: ${validation.passed ? '✅ PASSED' : '❌ FAILED'}\n\n`;
  
  if (validation.issues.length > 0) {
    report += '### Issues Found:\n';
    validation.issues.forEach(issue => {
      report += `- ${issue}\n`;
    });
    report += '\n';
  }
  
  // Component performance
  if (componentTests.length > 0) {
    report += '## Component Performance\n';
    componentTests.forEach(test => {
      report += `### ${test.component}\n`;
      report += `- **Render Time**: ${test.renderTime.toFixed(2)}ms\n`;
      if (test.updateTime > 0) {
        report += `- **Update Time**: ${test.updateTime.toFixed(2)}ms\n`;
      }
      report += `- **Memory Leaks**: ${test.memoryLeaks ? '❌ Detected' : '✅ None'}\n\n`;
    });
  }
  
  return report;
}

/**
 * Performance testing configuration
 */
export const PERFORMANCE_THRESHOLDS = {
  LOAD_TIME_MAX: 3000, // 3 seconds
  LCP_MAX: 2500, // 2.5 seconds
  FID_MAX: 100, // 100ms
  CLS_MAX: 0.1, // 0.1
  COMPONENT_RENDER_MAX: 16, // 16ms (60fps)
  MEMORY_LEAK_THRESHOLD: 0.1 // 10% increase
} as const;