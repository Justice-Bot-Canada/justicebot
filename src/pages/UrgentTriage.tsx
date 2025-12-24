import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Home, Briefcase, Users, Scale, FileWarning, ArrowRight, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import { analytics } from "@/utils/analytics";

interface UrgentScenario {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  examples: string[];
  primaryPath: string;
  secondaryPath?: string;
  urgencyLevel: "critical" | "high" | "medium";
}

const urgentScenarios: UrgentScenario[] = [
  {
    id: "eviction",
    icon: Home,
    title: "I received an eviction notice",
    description: "N4, N5, N12, or other eviction notices from your landlord",
    examples: ["N4 - Non-payment of rent", "N5 - Interference/damage", "N12 - Landlord's own use", "N13 - Demolition/repairs"],
    primaryPath: "/ltb-journey",
    urgencyLevel: "critical"
  },
  {
    id: "discrimination",
    icon: Users,
    title: "I'm being discriminated against",
    description: "Discrimination at work, housing, or services based on protected grounds",
    examples: ["Fired due to disability", "Denied housing due to race", "Harassed at work due to gender", "Service denial due to religion"],
    primaryPath: "/hrto-journey",
    secondaryPath: "/ltb-journey",
    urgencyLevel: "high"
  },
  {
    id: "terminated",
    icon: Briefcase,
    title: "I was fired or terminated",
    description: "Wrongful dismissal, retaliation, or unfair termination",
    examples: ["Terminated without notice", "Fired after reporting safety issues", "Let go after requesting accommodation", "Constructive dismissal"],
    primaryPath: "/labour-board-journey",
    secondaryPath: "/hrto-journey",
    urgencyLevel: "high"
  },
  {
    id: "landlord-issues",
    icon: FileWarning,
    title: "My landlord is harassing me",
    description: "Illegal entry, utility shutoffs, threats, or interference",
    examples: ["Entering without notice", "Cutting utilities", "Threats or intimidation", "Refusing repairs"],
    primaryPath: "/ltb-journey",
    secondaryPath: "/hrto-journey",
    urgencyLevel: "high"
  },
  {
    id: "money-owed",
    icon: Scale,
    title: "Someone owes me money",
    description: "Unpaid debts, damaged property, or broken contracts under $35,000",
    examples: ["Contractor didn't finish work", "Damage to property", "Unpaid loans", "Security deposit not returned"],
    primaryPath: "/small-claims-journey",
    urgencyLevel: "medium"
  }
];

const UrgentTriage = () => {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<UrgentScenario | null>(null);

  const handleScenarioSelect = (scenario: UrgentScenario) => {
    setSelectedScenario(scenario);
  };

  const handleContinue = (path: string) => {
    // Track conversion: urgent_routed
    if (selectedScenario) {
      analytics.urgentRouted(path, selectedScenario.id);
    }
    navigate(path);
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "critical": return "border-destructive bg-destructive/5 hover:bg-destructive/10";
      case "high": return "border-orange-500 bg-orange-500/5 hover:bg-orange-500/10";
      default: return "border-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Urgent Legal Help | Emergency Triage | Justice-Bot"
        description="Get immediate legal guidance for urgent situations. Eviction notices, discrimination, wrongful termination - find your legal pathway now."
        keywords="urgent legal help, emergency eviction, discrimination help, wrongful termination, legal emergency Canada"
        canonicalUrl="https://www.justice-bot.com/urgent-triage"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Emergency Header - Improved Copy */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">You're not late. You're in the right place.</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            What happened?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Select your situation below. We'll get you to the right legal pathway.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Takes about 2 minutes</span>
            <span className="mx-2">•</span>
            <Shield className="w-4 h-4" />
            <span>Free & confidential</span>
          </div>
        </div>

        {!selectedScenario ? (
          /* Scenario Selection */
          <div className="grid gap-4">
            {urgentScenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <Card
                  key={scenario.id}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg border-2 ${getUrgencyColor(scenario.urgencyLevel)}`}
                  onClick={() => handleScenarioSelect(scenario)}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-background">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{scenario.title}</h3>
                      <p className="text-muted-foreground mb-3">{scenario.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {scenario.examples.slice(0, 3).map((example, i) => (
                          <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Pathway Confirmation */
          <Card className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                <selectedScenario.icon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{selectedScenario.title}</h2>
              <p className="text-muted-foreground">{selectedScenario.description}</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Recommended Legal Pathway:</h3>
                <Button 
                  className="w-full justify-between"
                  size="lg"
                  onClick={() => handleContinue(selectedScenario.primaryPath)}
                >
                  Start Your Case
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              {selectedScenario.secondaryPath && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                    You may also have claims at:
                  </h3>
                  <Button 
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => handleContinue(selectedScenario.secondaryPath!)}
                  >
                    Explore Additional Options
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              )}

              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setSelectedScenario(null)}
              >
                ← Back to situations
              </Button>
            </div>

            <div className="mt-6 p-4 bg-accent/10 rounded-lg text-sm">
              <p className="text-muted-foreground">
                <strong>Important:</strong> Your situation may involve multiple legal pathways. 
                Justice-Bot will help identify all applicable tribunals as you proceed.
              </p>
            </div>
          </Card>
        )}

        {/* Help Banner */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">Not sure which applies to you?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate("/find-my-path")}>
              Find My Legal Path
            </Button>
            <Button variant="outline" onClick={() => navigate("/upload-first")}>
              Upload Your Documents
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UrgentTriage;
