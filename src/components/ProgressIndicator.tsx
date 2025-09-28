import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
  timeEstimate?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStepId: string;
  orientation?: 'horizontal' | 'vertical';
  showDescriptions?: boolean;
  showTimeEstimates?: boolean;
  className?: string;
  onStepClick?: (stepId: string) => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStepId,
  orientation = 'vertical',
  showDescriptions = true,
  showTimeEstimates = true,
  className,
  onStepClick
}) => {
  const currentIndex = steps.findIndex(step => step.id === currentStepId);
  const completedCount = steps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedCount / steps.length) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-warning';
      case 'medium': return 'text-info';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const StepIcon = ({ step, index }: { step: Step; index: number }) => {
    const isClickable = onStepClick && step.status !== 'upcoming';
    
    const iconContent = () => {
      switch (step.status) {
        case 'completed':
          return <CheckCircle className="w-5 h-5 text-success" aria-hidden="true" />;
        case 'current':
          return <Clock className="w-5 h-5 text-primary animate-pulse" aria-hidden="true" />;
        case 'upcoming':
          return <Circle className="w-5 h-5 text-muted-foreground" aria-hidden="true" />;
      }
    };

    const content = (
      <div 
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
          step.status === 'current' && "bg-primary/5 border border-primary/20",
          step.status === 'completed' && "bg-success/5",
          isClickable && "cursor-pointer hover:bg-muted/50"
        )}
        onClick={isClickable ? () => onStepClick(step.id) : undefined}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={isClickable ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onStepClick(step.id);
          }
        } : undefined}
        aria-label={`Step ${index + 1}: ${step.title}${step.status === 'completed' ? ' - Completed' : step.status === 'current' ? ' - Current step' : ' - Upcoming'}`}
      >
        <div className="flex-shrink-0 relative">
          {iconContent()}
          {orientation === 'vertical' && index < steps.length - 1 && (
            <div 
              className={cn(
                "absolute top-6 left-1/2 w-0.5 h-8 -translate-x-1/2",
                step.status === 'completed' ? "bg-success" : "bg-border"
              )}
              aria-hidden="true"
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-medium text-sm",
              step.status === 'current' && "text-primary",
              step.status === 'completed' && "text-success",
              step.status === 'upcoming' && "text-muted-foreground"
            )}>
              {step.title}
            </h3>
            {step.priority && (
              <Badge 
                variant="outline" 
                className={cn("text-xs", getPriorityColor(step.priority))}
                aria-label={`Priority: ${step.priority}`}
              >
                {step.priority}
              </Badge>
            )}
          </div>
          
          {showDescriptions && step.description && (
            <p className="text-xs text-muted-foreground mb-1">
              {step.description}
            </p>
          )}
          
          {showTimeEstimates && step.timeEstimate && (
            <p className="text-xs text-muted-foreground">
              <Clock className="w-3 h-3 inline mr-1" aria-hidden="true" />
              {step.timeEstimate}
            </p>
          )}
        </div>
      </div>
    );

    return content;
  };

  return (
    <div className={cn("space-y-2", className)} role="list" aria-label="Progress steps">
      {/* Progress Summary */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Progress: {completedCount} of {steps.length} steps completed
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div 
          className="w-full bg-muted rounded-full h-2"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
          aria-label={`Overall progress: ${Math.round(progressPercentage)}% complete`}
        >
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className={cn(
        orientation === 'horizontal' ? "flex gap-4 overflow-x-auto pb-2" : "space-y-2"
      )}>
        {steps.map((step, index) => (
          <div key={step.id} role="listitem">
            <StepIcon step={step} index={index} />
          </div>
        ))}
      </div>

      {/* Current Step Highlight */}
      {currentIndex >= 0 && (
        <div 
          className="bg-primary/10 border border-primary/20 p-3 rounded-lg"
          role="status"
          aria-live="polite"
        >
          <h4 className="font-medium text-primary mb-1">
            Current Step: {steps[currentIndex]?.title}
          </h4>
          {steps[currentIndex]?.description && (
            <p className="text-sm text-muted-foreground">
              {steps[currentIndex].description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;