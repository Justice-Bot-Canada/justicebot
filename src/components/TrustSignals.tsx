import { Shield, Users, Star, Award, Lock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function TrustSignals() {
  const signals = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Bank-level encryption protects your data",
      stat: "256-bit SSL"
    },
    {
      icon: Users,
      title: "Trusted by Canadians",
      description: "Real users getting real results",
      stat: "800+ Users"
    },
    {
      icon: Star,
      title: "High Success Rate",
      description: "Cases resolved favorably",
      stat: "85% Success"
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "Expert-reviewed legal guidance",
      stat: "100% Verified"
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your information stays confidential",
      stat: "PIPEDA Compliant"
    },
    {
      icon: CheckCircle,
      title: "Easy to Use",
      description: "Step-by-step guidance for everyone",
      stat: "No Legal Jargon"
    }
  ];

  return (
    <section className="py-16 bg-muted/30" aria-labelledby="trust-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="trust-heading" className="text-3xl font-bold mb-4">
            Why Thousands Trust Justice-Bot
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing secure, reliable, and affordable legal help to all Canadians
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <Card 
                key={index} 
                className="p-6 hover:shadow-lg transition-shadow"
                role="article"
                aria-label={signal.title}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{signal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {signal.description}
                    </p>
                    <span className="text-xs font-bold text-primary">
                      {signal.stat}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Social Proof Section */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-card border rounded-full px-6 py-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-sm font-medium">
              Join 800+ Canadians who've resolved their legal issues affordably
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}