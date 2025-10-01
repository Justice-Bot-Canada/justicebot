import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EnhancedSEO from "@/components/EnhancedSEO";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { Shield, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccountabilityJourney = () => {
  const navigate = useNavigate();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Government Accountability - Police & CAS Matters",
    "description": "Choose your government accountability issue: Police complaints (SIU/OIPRD) or Children's Aid Society (CAS) matters"
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "Government Accountability", url: "https://justice-bot.com/accountability-journey" }
  ];

  const accountabilityTypes = [
    {
      id: "police",
      title: "Police Accountability",
      description: "File complaints about police conduct through SIU or OIPRD",
      icon: Shield,
      color: "from-orange-500 to-orange-600",
      examples: ["Excessive force", "Unlawful arrest", "Police misconduct", "Serious injury by police"],
      route: "/police-accountability-journey"
    },
    {
      id: "cas",
      title: "Children's Aid Society (CAS)",
      description: "Navigate CAS involvement and child protection proceedings",
      icon: Users,
      color: "from-pink-500 to-pink-600",
      examples: ["CAS investigation", "Child apprehension", "Family court proceedings", "Access visits"],
      route: "/cas-journey"
    }
  ];

  return (
    <>
      <PerformanceMonitor />
      <EnhancedSEO 
        title="Government Accountability - Police Complaints & CAS Matters"
        description="Step-by-step guidance for filing police complaints (SIU/OIPRD) or navigating Children's Aid Society (CAS) involvement in Ontario."
        keywords="police complaint, SIU, OIPRD, CAS, Children's Aid Society, government accountability, police misconduct, child protection"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Government Accountability
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your situation to get step-by-step guidance for holding government agencies accountable
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {accountabilityTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card 
                  key={type.id}
                  className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary"
                  onClick={() => navigate(type.route)}
                >
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${type.color} mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{type.title}</CardTitle>
                    <CardDescription className="text-base">{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Common situations:</h4>
                        <ul className="space-y-2">
                          {type.examples.map((example, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="text-primary mt-1">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                        variant="outline"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-12 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Need Help Determining Where to File?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you're unsure which process applies to your situation, our smart triage system can help you determine the right path forward.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/triage")}
                  >
                    Start Smart Triage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AccountabilityJourney;
