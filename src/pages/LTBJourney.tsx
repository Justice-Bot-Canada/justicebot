import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { UserJourney } from "@/components/UserJourney";

const LTBJourney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userSituation } = location.state || {};

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="LTB Step-by-Step Journey - File Your Landlord Tenant Board Application"
        description="Complete guide to filing an LTB application. Get step-by-step instructions, forms, deadlines, and expert tips for your landlord-tenant dispute in Ontario."
        keywords="LTB journey, landlord tenant board steps, LTB application guide, tenant rights process, Ontario LTB"
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
            
            <h1 className="text-3xl font-bold mb-2">LTB Filing Journey</h1>
            <p className="text-muted-foreground">
              Your complete guide to protecting tenant rights through the Landlord and Tenant Board
            </p>
          </div>

          <UserJourney 
            venue="ltb"
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

export default LTBJourney;