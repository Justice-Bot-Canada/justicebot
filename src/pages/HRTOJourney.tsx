import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { UserJourney } from "@/components/UserJourney";

const HRTOJourney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userSituation } = location.state || {};

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="HRTO Step-by-Step Journey - File Your Human Rights Complaint"
        description="Complete guide to filing an HRTO application. Get step-by-step instructions, deadlines, forms, and pro tips for your human rights complaint in Ontario."
        keywords="HRTO journey, human rights complaint steps, HRTO application guide, discrimination complaint process, Ontario human rights"
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
            
            <h1 className="text-3xl font-bold mb-2">HRTO Filing Journey</h1>
            <p className="text-muted-foreground">
              Your complete guide to fighting discrimination through the Human Rights Tribunal of Ontario
            </p>
          </div>

          <UserJourney 
            venue="hrto"
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

export default HRTOJourney;