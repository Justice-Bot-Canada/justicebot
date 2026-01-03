import { CheckCircle, Circle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlowStep, STEP_METADATA, useFlowEnforcement } from '@/hooks/useFlowEnforcement';

interface FlowProgressIndicatorProps {
  currentStep: FlowStep;
  compact?: boolean;
  className?: string;
}

const FLOW_STEPS: FlowStep[] = ['welcome', 'triage', 'evidence', 'timeline', 'documents'];

export function FlowProgressIndicator({ 
  currentStep, 
  compact = false,
  className 
}: FlowProgressIndicatorProps) {
  const { isStepComplete, isCurrentStep, isLocked } = useFlowEnforcement();
  
  const currentStepNumber = STEP_METADATA[currentStep]?.number || 1;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="text-sm font-medium text-primary">
          Step {currentStepNumber} of 5
        </span>
        <div className="flex gap-1">
          {FLOW_STEPS.map((step, idx) => (
            <div
              key={step}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                isStepComplete(step) 
                  ? "bg-primary" 
                  : isCurrentStep(step) 
                    ? "bg-primary animate-pulse"
                    : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Step counter */}
      <div className="text-center mb-4">
        <span className="text-lg font-semibold text-primary">
          Step {currentStepNumber} of 5
        </span>
        <span className="text-muted-foreground ml-2">
          — {STEP_METADATA[currentStep]?.title}
        </span>
      </div>

      {/* Progress bar with steps */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted" />
        
        {/* Progress line */}
        <div 
          className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500"
          style={{ 
            width: `${((currentStepNumber - 1) / 4) * 100}%` 
          }}
        />

        {/* Step circles */}
        <div className="relative flex justify-between">
          {FLOW_STEPS.map((step, idx) => {
            const stepMeta = STEP_METADATA[step];
            const complete = isStepComplete(step);
            const current = isCurrentStep(step);
            const locked = isLocked(step);

            return (
              <div key={step} className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all bg-background",
                    complete && "bg-primary border-primary text-primary-foreground",
                    current && !complete && "border-primary text-primary",
                    locked && "border-muted text-muted-foreground"
                  )}
                >
                  {complete ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : locked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{idx + 1}</span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center hidden sm:block",
                    complete && "text-primary",
                    current && !complete && "text-primary",
                    locked && "text-muted-foreground"
                  )}
                >
                  {stepMeta.shortTitle}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Minimal inline version for headers
export function FlowProgressBadge({ currentStep }: { currentStep: FlowStep }) {
  const stepNumber = STEP_METADATA[currentStep]?.number || 1;
  
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
      <Circle className="w-2 h-2 fill-current" />
      <span>Step {stepNumber} of 5</span>
    </div>
  );
}
