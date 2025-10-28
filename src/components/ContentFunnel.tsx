import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FunnelStep {
  title: string;
  description: string;
  path: string;
  completed?: boolean;
  estimatedTime?: string;
}

interface ContentFunnelProps {
  currentStep: string;
  steps: FunnelStep[];
  onStepClick?: (path: string) => void;
}

export const ContentFunnel = ({ currentStep, steps, onStepClick }: ContentFunnelProps) => {
  const navigate = useNavigate();

  const handleStepClick = (path: string) => {
    if (onStepClick) {
      onStepClick(path);
    } else {
      navigate(path);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-primary" />
          Your Journey Roadmap
        </CardTitle>
        <CardDescription>
          Follow these steps to successfully navigate your legal case
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isCurrent = step.path === currentStep;
            const isCompleted = step.completed;
            
            return (
              <div
                key={step.path}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  isCurrent 
                    ? 'bg-primary/20 border border-primary' 
                    : isCompleted 
                    ? 'bg-success/10 border border-success/30'
                    : 'bg-background/50 border border-border hover:bg-background cursor-pointer'
                }`}
                onClick={() => !isCurrent && handleStepClick(step.path)}
              >
                <div className="flex-shrink-0 mt-1">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold ${isCurrent ? 'text-primary' : ''}`}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {step.description}
                  </p>
                  {step.estimatedTime && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ⏱️ {step.estimatedTime}
                    </p>
                  )}
                </div>
                {!isCurrent && !isCompleted && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleStepClick(step.path)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentFunnel;
