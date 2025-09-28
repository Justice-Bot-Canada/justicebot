import React, { useState } from 'react';
import { AlertTriangle, XCircle, Info, CheckCircle, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export type ErrorType = 'network' | 'validation' | 'authentication' | 'permission' | 'server' | 'client' | 'unknown';
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface AppError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  title: string;
  message: string;
  details?: string;
  timestamp: Date;
  userAction?: {
    label: string;
    action: () => void;
  };
  retryAction?: () => void;
  dismissible?: boolean;
}

interface ErrorHandlerProps {
  errors: AppError[];
  onDismiss: (errorId: string) => void;
  onRetry?: (errorId: string) => void;
  maxVisible?: number;
  className?: string;
}

const getErrorIcon = (type: ErrorType, severity: ErrorSeverity) => {
  if (severity === 'critical') return XCircle;
  if (severity === 'high') return AlertTriangle;
  if (severity === 'medium') return Info;
  return CheckCircle;
};

const getErrorStyles = (severity: ErrorSeverity) => {
  switch (severity) {
    case 'critical':
      return 'border-destructive/50 bg-destructive/5 text-destructive';
    case 'high':
      return 'border-warning/50 bg-warning/5 text-warning';
    case 'medium':
      return 'border-info/50 bg-info/5 text-info';
    case 'low':
      return 'border-muted bg-muted/5 text-muted-foreground';
    default:
      return 'border-muted bg-muted/5 text-muted-foreground';
  }
};

const getUserFriendlyMessage = (error: AppError): string => {
  switch (error.type) {
    case 'network':
      return 'Unable to connect to our servers. Please check your internet connection and try again.';
    case 'validation':
      return 'Please check the information you entered and try again.';
    case 'authentication':
      return 'Your session has expired. Please log in again to continue.';
    case 'permission':
      return 'You don\'t have permission to perform this action. Please contact support if you believe this is an error.';
    case 'server':
      return 'Our servers are experiencing issues. We\'re working to fix this. Please try again in a few minutes.';
    case 'client':
      return 'Something went wrong on your device. Try refreshing the page or restarting your browser.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

const getSuggestedActions = (error: AppError): string[] => {
  switch (error.type) {
    case 'network':
      return [
        'Check your internet connection',
        'Try refreshing the page',
        'Disable any VPN or proxy if enabled'
      ];
    case 'validation':
      return [
        'Review the form fields for errors',
        'Ensure all required fields are filled',
        'Check date and number formats'
      ];
    case 'authentication':
      return [
        'Log out and log back in',
        'Clear your browser cache',
        'Disable browser extensions temporarily'
      ];
    case 'permission':
      return [
        'Contact your administrator',
        'Check if your account status is active',
        'Try logging out and back in'
      ];
    case 'server':
      return [
        'Wait a few minutes and try again',
        'Check our status page for updates',
        'Contact support if the issue persists'
      ];
    default:
      return [
        'Refresh the page',
        'Try again in a few minutes',
        'Contact support if the problem continues'
      ];
  }
};

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({
  errors,
  onDismiss,
  onRetry,
  maxVisible = 3,
  className
}) => {
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set());

  const visibleErrors = errors.slice(0, maxVisible);
  const hiddenCount = Math.max(0, errors.length - maxVisible);

  const toggleExpanded = (errorId: string) => {
    const newExpanded = new Set(expandedErrors);
    if (newExpanded.has(errorId)) {
      newExpanded.delete(errorId);
    } else {
      newExpanded.add(errorId);
    }
    setExpandedErrors(newExpanded);
  };

  if (errors.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)} role="alert" aria-live="assertive">
      {visibleErrors.map((error) => {
        const Icon = getErrorIcon(error.type, error.severity);
        const isExpanded = expandedErrors.has(error.id);
        const userMessage = getUserFriendlyMessage(error);
        const suggestedActions = getSuggestedActions(error);

        return (
          <Alert
            key={error.id}
            className={cn(
              "relative transition-all duration-200",
              getErrorStyles(error.severity)
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">
                    {error.title}
                  </h4>
                  <AlertDescription className="text-sm">
                    {userMessage}
                  </AlertDescription>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  {error.retryAction && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={error.retryAction}
                      className="h-6 w-6 p-0"
                      aria-label="Retry action"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {(error.details || suggestedActions.length > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(error.id)}
                      className="h-6 px-2 text-xs"
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? "Hide details" : "Show details"}
                    >
                      {isExpanded ? 'Less' : 'More'}
                    </Button>
                  )}
                  
                  {(error.dismissible !== false) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismiss(error.id)}
                      className="h-6 w-6 p-0"
                      aria-label="Dismiss error"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-current/20 space-y-3">
                  {error.details && (
                    <div>
                      <h5 className="font-medium text-xs mb-1">Technical Details:</h5>
                      <p className="text-xs opacity-75 font-mono bg-background/50 p-2 rounded">
                        {error.details}
                      </p>
                    </div>
                  )}
                  
                  {suggestedActions.length > 0 && (
                    <div>
                      <h5 className="font-medium text-xs mb-1">Suggested Solutions:</h5>
                      <ul className="text-xs space-y-1" role="list">
                        {suggestedActions.map((action, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-current/50 mt-0.5">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="text-xs opacity-75">
                    Occurred at {error.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              )}

              {/* User Action Button */}
              {error.userAction && (
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={error.userAction.action}
                    className="h-7 text-xs"
                  >
                    {error.userAction.label}
                  </Button>
                </div>
              )}
            </div>
          </Alert>
        );
      })}

      {/* Hidden errors indicator */}
      {hiddenCount > 0 && (
        <div className="text-xs text-muted-foreground text-center py-2">
          {hiddenCount} more error{hiddenCount !== 1 ? 's' : ''} not shown
        </div>
      )}
    </div>
  );
};

// Error management hook
export const useErrorHandler = () => {
  const [errors, setErrors] = useState<AppError[]>([]);

  const addError = (errorData: Omit<AppError, 'id' | 'timestamp'>) => {
    const error: AppError = {
      ...errorData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    
    setErrors(prev => [error, ...prev]);
    
    // Auto-dismiss low severity errors after 5 seconds
    if (error.severity === 'low' && error.dismissible !== false) {
      setTimeout(() => {
        dismissError(error.id);
      }, 5000);
    }
  };

  const dismissError = (errorId: string) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  };

  const clearAllErrors = () => {
    setErrors([]);
  };

  return {
    errors,
    addError,
    dismissError,
    clearAllErrors
  };
};