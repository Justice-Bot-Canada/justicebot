import React from 'react';
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  message = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn("flex items-center gap-2", className)} role="status" aria-live="polite">
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} aria-hidden="true" />
      <span className="text-sm text-muted-foreground">{message}</span>
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted rounded-md",
        className
      )}
      role="img"
      aria-label="Loading placeholder"
    >
      {children}
    </div>
  );
};

export const FormSkeleton = () => (
  <div className="space-y-4" role="img" aria-label="Form loading">
    <Skeleton className="h-4 w-1/4" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-4 w-1/5" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-10 w-24" />
  </div>
);

export const CardSkeleton = () => (
  <div className="space-y-3 p-4 border rounded-lg" role="img" aria-label="Card loading">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-16 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

interface StatusIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'warning';
  message: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  message, 
  className 
}) => {
  const icons = {
    loading: <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />,
    success: <CheckCircle2 className="w-4 h-4 text-success" aria-hidden="true" />,
    error: <XCircle className="w-4 h-4 text-destructive" aria-hidden="true" />,
    warning: <AlertTriangle className="w-4 h-4 text-warning" aria-hidden="true" />
  };

  const statusColors = {
    loading: 'text-muted-foreground',
    success: 'text-success',
    error: 'text-destructive',
    warning: 'text-warning'
  };

  return (
    <div 
      className={cn("flex items-center gap-2", className)}
      role="status"
      aria-live={status === 'loading' ? 'polite' : 'assertive'}
    >
      {icons[status]}
      <span className={cn("text-sm", statusColors[status])}>
        {message}
      </span>
      <span className="sr-only">
        {status === 'loading' && 'Operation in progress'}
        {status === 'success' && 'Operation completed successfully'}
        {status === 'error' && 'Error occurred'}
        {status === 'warning' && 'Warning message'}
      </span>
    </div>
  );
};

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label = 'Progress',
  showPercentage = true,
  size = 'md',
  className
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-foreground" id="progress-label">
          {label}
        </label>
        {showPercentage && (
          <span className="text-sm text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div 
        className={cn(
          "w-full bg-muted rounded-full overflow-hidden",
          heightClasses[size]
        )}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-labelledby="progress-label"
      >
        <div 
          className="bg-primary h-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  onCancel?: () => void;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Processing...',
  progress,
  onCancel
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
    >
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-sm w-full mx-4 space-y-4">
        <div className="text-center">
          <h2 id="loading-title" className="text-lg font-semibold mb-2">
            {message}
          </h2>
          
          {progress !== undefined ? (
            <ProgressBar 
              value={progress} 
              label="Progress" 
              showPercentage={true}
            />
          ) : (
            <LoadingSpinner size="lg" />
          )}
        </div>
        
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full mt-4 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cancel current operation"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};