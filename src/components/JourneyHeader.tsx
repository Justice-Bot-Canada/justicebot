import { Card } from "@/components/ui/card";
import { Clock, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface JourneyHeaderProps {
  title: string;
  description: string;
  whoIsItFor: string;
  whatYouGet: string[];
  timeToComplete: string;
  whatYouNeed: string[];
  ctaText?: string;
  ctaLink?: string;
}

export const JourneyHeader = ({
  title,
  description,
  whoIsItFor,
  whatYouGet,
  timeToComplete,
  whatYouNeed,
  ctaText = "Start Your Journey",
  ctaLink = "/triage"
}: JourneyHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 mb-8">
      {/* Main Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Who It's For */}
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Who Is This For?</h3>
              <p className="text-sm text-muted-foreground">{whoIsItFor}</p>
            </div>
          </div>
        </Card>

        {/* Time to Complete */}
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Time to Complete</h3>
              <p className="text-sm text-muted-foreground">{timeToComplete}</p>
            </div>
          </div>
        </Card>

        {/* What You'll Get */}
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">What You'll Get</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {whatYouGet.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* What You Need Ready */}
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">What You Need Ready</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {whatYouNeed.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* CTA */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold mb-1">Ready to Get Started?</h3>
            <p className="text-sm text-muted-foreground">
              Our guided journey will walk you through every step of the process.
            </p>
          </div>
          <Button onClick={() => navigate(ctaLink)} size="lg" className="whitespace-nowrap">
            {ctaText}
          </Button>
        </div>
      </Card>
    </div>
  );
};
