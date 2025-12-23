import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, Users, DollarSign, Heart, Briefcase, Globe, Shield, Sparkles, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CaseManager from "@/components/CaseManager";
import { useNavigate } from "react-router-dom";

const venues = [
  {
    id: "ltb",
    title: "Landlord & Tenant Board",
    description: "Rent disputes, evictions, maintenance issues",
    icon: Building2,
    color: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    examples: ["Rent increase disputes", "Eviction notices", "Repair issues"]
  },
  {
    id: "hrto", 
    title: "Human Rights Tribunal",
    description: "Discrimination, harassment, accessibility",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    bgLight: "bg-purple-50",
    examples: ["Workplace discrimination", "Housing discrimination", "Service discrimination"]
  },
  {
    id: "small-claims",
    title: "Small Claims Court",
    description: "Disputes under $35,000",
    icon: DollarSign,
    color: "from-green-500 to-green-600",
    bgLight: "bg-green-50",
    examples: ["Unpaid invoices", "Property damage", "Contract disputes"]
  },
  {
    id: "family",
    title: "Family Court / CAS",
    description: "Custody, support, child protection",
    icon: Heart,
    color: "from-rose-500 to-rose-600",
    bgLight: "bg-rose-50",
    examples: ["Child custody", "Support payments", "CAS matters"]
  },
  {
    id: "labour",
    title: "Labour Board",
    description: "Employment disputes, wrongful dismissal",
    icon: Briefcase,
    color: "from-teal-500 to-teal-600",
    bgLight: "bg-teal-50",
    examples: ["Wrongful dismissal", "Employment standards", "Workplace rights"]
  },
  {
    id: "immigration",
    title: "Immigration & Refugee",
    description: "IRB hearings, refugee claims, appeals",
    icon: Globe,
    color: "from-indigo-500 to-indigo-600",
    bgLight: "bg-indigo-50",
    examples: ["Refugee claims", "Immigration appeals", "Detention reviews"]
  },
  {
    id: "accountability",
    title: "Government Accountability",
    description: "Police complaints, CAS, agency issues",
    icon: Shield,
    color: "from-orange-500 to-orange-600",
    bgLight: "bg-orange-50",
    examples: ["Police complaints (SIU/OIPRD)", "CAS matters", "Agency misconduct"]
  }
];

const TriageSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (user) {
    return (
      <section id="triage" className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <CaseManager />
      </section>
    );
  }

  return (
    <section id="triage" className="py-20 bg-gradient-to-b from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="text-primary border-primary/30 mb-2">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Routing
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Smart Legal Triage
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us your situation in plain language. We'll map it to the right venue and guide you through the process.
          </p>
          <blockquote className="border-l-4 border-primary/60 pl-4 italic text-muted-foreground text-sm mt-8 max-w-2xl mx-auto bg-card/50 py-3 pr-4 rounded-r-lg">
            "Everyone has the right to a fair and public hearing by an independent and impartial tribunal." 
            <span className="block text-xs mt-1 font-medium text-primary/80">— Charter of Rights and Freedoms</span>
          </blockquote>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {venues.map((venue, index) => {
            const Icon = venue.icon;
            return (
              <Card 
                key={venue.id} 
                className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/30 hover:-translate-y-1 overflow-hidden"
                onClick={() => navigate(`/${venue.id}-journey`)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="space-y-4 pb-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${venue.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{venue.title}</CardTitle>
                  <CardDescription className="text-sm">{venue.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {venue.examples.map((example, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs font-normal">
                        {example}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Start here</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-card via-card to-muted/30 rounded-3xl p-10 shadow-2xl border-2 border-primary/10">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-xl">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Not Sure Where to Start?
            </h3>
            <p className="text-muted-foreground text-lg">
              Describe your legal situation in your own words. Our AI will determine 
              the best venue, recommend forms, and outline your next steps.
            </p>
            <Button 
              variant="cta" 
              size="lg" 
              className="group px-10 py-7 text-lg shadow-xl hover:scale-[1.02] transition-all"
              onClick={() => navigate("/triage")}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Smart Triage
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Free • No signup required • Results in 2 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TriageSection;