import { Shield, Users, Star, Lock, CheckCircle, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TrustSignals() {
  const navigate = useNavigate();

  const signals = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is encrypted with 256-bit SSL — the same protection banks use",
      stat: "256-bit SSL"
    },
    {
      icon: Users,
      title: "10,000+ Canadians Helped",
      description: "Real people resolving real legal issues across Ontario",
      stat: "4.8/5 Rating"
    },
    {
      icon: Star,
      title: "89% Success Rate",
      description: "Cases resolved favorably when users follow the guided steps",
      stat: "Verified Results"
    },
    {
      icon: Lock,
      title: "PIPEDA Compliant",
      description: "We never sell your information. Your privacy is protected by law.",
      stat: "Privacy First"
    },
    {
      icon: CheckCircle,
      title: "No Legal Jargon",
      description: "Plain English guidance anyone can understand and follow",
      stat: "Step-by-Step"
    },
    {
      icon: Heart,
      title: "Built for Self-Reps",
      description: "Created by self-represented litigants turned legal tech advocates",
      stat: "By People Like You"
    }
  ];

  return (
    <section className="py-16 bg-muted/30" aria-labelledby="trust-heading">
      <div className="container mx-auto px-4">
        {/* Header with transparency message */}
        <div className="text-center mb-12">
          <h2 id="trust-heading" className="text-3xl md:text-4xl font-bold mb-4">
            Why Thousands Trust Justice-Bot
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Built by self-represented litigants who understand the struggle — 
            now helping others navigate the legal system with confidence.
          </p>
        </div>

        {/* Trust signals grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {signals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <Card 
                key={index} 
                className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/80"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 text-foreground">{signal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {signal.description}
                    </p>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {signal.stat}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Social proof + CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-card border rounded-2xl px-8 py-6 shadow-lg">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent border-3 border-background flex items-center justify-center text-xs font-bold text-primary-foreground"
                >
                  {i === 1 && "JD"}
                  {i === 2 && "MK"}
                  {i === 3 && "RS"}
                  {i === 4 && "AL"}
                  {i === 5 && "+"}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">
                Join 10,000+ Canadians
              </p>
              <p className="text-sm text-muted-foreground">
                who've resolved their legal issues affordably
              </p>
            </div>
            <Button 
              variant="cta" 
              className="group"
              onClick={() => navigate('/triage')}
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Transparency links */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm">
          <a href="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
            Legal Disclaimer
          </a>
          <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
            Terms of Service
          </a>
          <a href="https://tribunalsontario.ca/ltb/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
            Official LTB Site →
          </a>
          <a href="https://tribunalsontario.ca/hrto/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
            Official HRTO Site →
          </a>
        </div>
      </div>
    </section>
  );
}
