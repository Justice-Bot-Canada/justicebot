import { ArrowRight, MessageSquare, Scale, FileText, Send } from "lucide-react";
import { Card } from "./ui/card";

/**
 * Visual flowchart showing the step-by-step Justice-Bot process
 * Public component for SEO and user education
 */
export const JourneyFlowchart = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: "Describe Your Issue",
      description: "Answer simple questions about your legal situation",
      color: "from-primary/20 to-primary/10"
    },
    {
      icon: Scale,
      title: "AI Analysis",
      description: "Our AI analyzes your case and determines the best legal pathway",
      color: "from-accent/20 to-accent/10"
    },
    {
      icon: FileText,
      title: "Get Your Forms",
      description: "Receive customized legal forms pre-filled with your information",
      color: "from-secondary/20 to-secondary/10"
    },
    {
      icon: Send,
      title: "File & Proceed",
      description: "Follow step-by-step instructions to file your case confidently",
      color: "from-primary/20 to-primary/10"
    }
  ];

  return (
    <section className="w-full py-16 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Justice-Bot Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get legal help in 4 simple steps. No lawyer required.
          </p>
        </div>

        {/* Desktop view: Horizontal flow */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 items-start">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="w-8 h-8 text-foreground" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-primary mb-2">
                      Step {index + 1}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </Card>
                
                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="absolute top-12 -right-3 z-10">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile view: Vertical flow */}
        <div className="md:hidden space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-primary mb-1">
                        Step {index + 1}
                      </div>
                      <h3 className="font-bold text-base mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
                
                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="w-5 h-5 text-primary rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <a 
            href="/demo-journey" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            See a Live Demo
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};
