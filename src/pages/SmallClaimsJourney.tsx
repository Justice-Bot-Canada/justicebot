import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { UserJourney } from "@/components/UserJourney";

const SmallClaimsJourney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userSituation } = location.state || {};

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Small Claims Court Journey - File Your Claim Under $35,000"
        description="Complete guide to filing a small claims court action. Get step-by-step instructions, forms, deadlines, and strategies for your monetary dispute in Ontario."
        keywords="small claims court journey, small claims process, court claim steps, Ontario small claims, lawsuit under 35000"
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Small Claims Court Journey</h1>
            <p className="text-muted-foreground">
              Your complete guide to recovering money through Small Claims Court
            </p>
          </div>

          <UserJourney 
            venue="small-claims"
            userSituation={userSituation}
            onStepComplete={(stepId) => {
              console.log("Step completed:", stepId);
            }}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SmallClaimsJourney;