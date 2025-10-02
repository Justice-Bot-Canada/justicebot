import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EnhancedSEO from "@/components/EnhancedSEO";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { Shield, Users, Building2, ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccountabilityJourney = () => {
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState<string>("ON");

  const provinces = [
    { code: "ON", name: "Ontario" },
    { code: "BC", name: "British Columbia" },
    { code: "AB", name: "Alberta" },
    { code: "SK", name: "Saskatchewan" },
    { code: "MB", name: "Manitoba" },
    { code: "QC", name: "Quebec" },
    { code: "NB", name: "New Brunswick" },
    { code: "NS", name: "Nova Scotia" },
    { code: "PE", name: "Prince Edward Island" },
    { code: "NL", name: "Newfoundland and Labrador" },
    { code: "NT", name: "Northwest Territories" },
    { code: "YT", name: "Yukon" },
    { code: "NU", name: "Nunavut" }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Government Accountability - Police & CAS Matters",
    "description": "Choose your government accountability issue: Police complaints or Children's Aid Society (CAS) matters across Canada"
  };

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" },
    { name: "Government Accountability", url: "https://justice-bot.com/accountability-journey" }
  ];

  const accountabilityTypes = [
    {
      id: "police",
      title: "Police Accountability",
      description: "File complaints about police conduct (SIU, SIRT, IIO, ASIRT, etc.)",
      icon: Shield,
      color: "from-orange-500 to-orange-600",
      examples: ["Excessive force", "Unlawful arrest", "Police misconduct", "Serious injury by police"],
      route: `/accountability/${selectedProvince.toLowerCase()}/police`
    },
    {
      id: "cas",
      title: "Child Protection Services",
      description: "Navigate CAS/CFS involvement and child protection proceedings",
      icon: Users,
      color: "from-pink-500 to-pink-600",
      examples: ["CAS/CFS investigation", "Child apprehension", "Family court proceedings", "Access visits"],
      route: `/accountability/${selectedProvince.toLowerCase()}/cas`
    },
    {
      id: "government",
      title: "Other Government Bodies",
      description: "Complaints about provincial/territorial government services",
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      examples: ["Service denial", "Unfair treatment", "Systemic issues", "Policy complaints"],
      route: `/accountability/${selectedProvince.toLowerCase()}/government`
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Government Accountability
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your province and type of complaint to get step-by-step guidance
            </p>
          </div>

          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Select Your Province/Territory
              </CardTitle>
              <CardDescription>
                Complaint procedures vary by province. Choose your location first.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your province or territory" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.code} value={province.code}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
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

          <Card className="mt-8 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Province-Specific Processes</h3>
                  <p className="text-sm text-muted-foreground">
                    Each province has different oversight bodies and complaint procedures. The forms, timelines, and contact information are specific to <strong>{provinces.find(p => p.code === selectedProvince)?.name}</strong>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4 border-orange-200 bg-orange-50">
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
