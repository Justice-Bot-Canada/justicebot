import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, Users, DollarSign, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CaseManager from "@/components/CaseManager";

const venues = [
  {
    id: "ltb",
    title: "Landlord & Tenant Board",
    description: "Rent disputes, evictions, maintenance issues",
    icon: Building2,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    examples: ["Rent increase disputes", "Eviction notices", "Repair issues"]
  },
  {
    id: "hrto", 
    title: "Human Rights Tribunal",
    description: "Discrimination, harassment, accessibility",
    icon: Users,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    examples: ["Workplace discrimination", "Housing discrimination", "Service discrimination"]
  },
  {
    id: "small-claims",
    title: "Small Claims Court",
    description: "Disputes under $35,000",
    icon: DollarSign,
    color: "bg-green-50 text-green-700 border-green-200",
    examples: ["Unpaid invoices", "Property damage", "Contract disputes"]
  },
  {
    id: "family",
    title: "Family Court / CAS",
    description: "Custody, support, child protection",
    icon: Heart,
    color: "bg-rose-50 text-rose-700 border-rose-200",
    examples: ["Child custody", "Support payments", "CAS matters"]
  }
];

const TriageSection = () => {
  const { user } = useAuth();
  
  // Show case manager if user is logged in, otherwise show triage info
  if (user) {
    return (
      <section id="triage" className="py-20 bg-secondary/30">
        <CaseManager />
      </section>
    );
  }

  return (
    <section id="triage" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Smart Triage
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us your situation in plain language. We'll map it to the right venue and guide you through the process.
          </p>
          <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground text-sm mt-6 max-w-2xl mx-auto">
            "Everyone has the right to a fair and public hearing by an independent and impartial tribunal." — Charter of Rights and Freedoms
          </blockquote>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {venues.map((venue) => {
            const Icon = venue.icon;
            return (
              <Card 
                key={venue.id} 
                className="h-full hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => window.location.href = `/${venue.id}-journey`}
              >
                <CardHeader className="space-y-3">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${venue.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">{venue.title}</CardTitle>
                  <CardDescription>{venue.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {venue.examples.map((example, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-card rounded-xl p-8 shadow-lg">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              Start Your Assessment
            </h3>
            <p className="text-muted-foreground">
              Describe your legal situation in your own words. Our smart triage will determine 
              the best venue and next steps for your case.
            </p>
            <Button 
              variant="cta" 
              size="lg" 
              className="group"
              onClick={() => window.location.href = "/triage"}
            >
              Start Smart Triage
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TriageSection;