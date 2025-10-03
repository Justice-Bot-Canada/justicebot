import { lazy, Suspense, ComponentType } from 'react';
import { LoadingSpinner } from './LoadingStates';

/**
 * Utility component for code-splitting and lazy loading
 * Improves performance by reducing initial bundle size
 */

export const lazyLoad = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <LoadingSpinner size="lg" />
) => {
  const LazyComponent = lazy(importFunc);

  return (props: any) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default lazyLoad;
