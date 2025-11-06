import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Scale, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Calculator,
  BookOpen,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OnboardingFlowProps {
  open: boolean;
  onComplete: () => void;
}

const onboardingSteps = [
  {
    title: "Welcome to Justice-Bot",
    description: "Your AI-powered legal assistant for navigating the Canadian legal system",
    icon: Scale,
    features: [
      "Step-by-step guidance through legal processes",
      "AI-powered case analysis and merit scoring",
      "Access to legal forms and templates"
    ]
  },
  {
    title: "AI Case Assessment",
    description: "Get instant analysis of your legal situation with our advanced AI",
    icon: MessageSquare,
    features: [
      "Upload documents for automated analysis",
      "Receive merit scores and case strength evaluations",
      "Get personalized recommendations for next steps"
    ]
  },
  {
    title: "Legal Forms & Documents",
    description: "Access court forms and generate professional legal documents",
    icon: FileText,
    features: [
      "Browse forms by province and legal area",
      "AI-assisted form filling and guidance",
      "Generate exhibit books and legal documents"
    ]
  },
  {
    title: "Case Management",
    description: "Track deadlines, organize evidence, and manage your case timeline",
    icon: Calendar,
    features: [
      "Automated deadline tracking and reminders",
      "Evidence organization and exhibit builder",
      "Case progress tracking and milestones"
    ]
  },
  {
    title: "Settlement Calculator",
    description: "Calculate potential settlement amounts based on case specifics",
    icon: Calculator,
    features: [
      "AI-powered settlement estimation",
      "Factor-based calculations for various damages",
      "Detailed breakdown of potential awards"
    ]
  },
  {
    title: "Legal Resources",
    description: "Learn about your rights and navigate the legal system with confidence",
    icon: BookOpen,
    features: [
      "Province-specific legal procedures",
      "Tribunal and court information",
      "Step-by-step legal pathways"
    ]
  }
];

export function OnboardingFlow({ open, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const currentStepData = onboardingSteps[currentStep];
  const StepIcon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = async () => {
    await handleComplete();
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('id', user.id);

        if (error) throw error;

        toast({
          title: "Welcome aboard!",
          description: "You're all set to start using Justice-Bot",
        });
      }

      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      onComplete(); // Still complete even if there's an error
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-2xl">
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <Card className="border-2">
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <StepIcon className="h-12 w-12 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
                  <p className="text-muted-foreground">
                    {currentStepData.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {currentStepData.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 text-left">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button 
              variant="ghost" 
              onClick={handleSkip}
              disabled={isCompleting}
            >
              Skip Tour
            </Button>

            <Button 
              onClick={handleNext}
              disabled={isCompleting}
              className="min-w-32"
            >
              {currentStep === onboardingSteps.length - 1 ? (
                isCompleting ? "Completing..." : "Get Started"
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}