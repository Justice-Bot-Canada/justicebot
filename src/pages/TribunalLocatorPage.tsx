import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TribunalLocator from "@/components/TribunalLocator";

const TribunalLocatorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extract parameters from URL
  const venue = searchParams.get('venue') || undefined;
  const province = searchParams.get('province') || 'Ontario';
  const municipality = searchParams.get('municipality') || 'Toronto';
  const description = searchParams.get('description') || '';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Court & Tribunal Locator</h1>
            <p className="text-muted-foreground">
              Find the nearest courts and tribunals for your legal matter
            </p>
          </div>

          <TribunalLocator
            venue={venue}
            userProvince={province}
            userMunicipality={municipality}
            caseDescription={description}
            onCourtSelected={(court) => {
              console.log("Selected court:", court);
              // You can add additional logic here, like saving to user preferences
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TribunalLocatorPage;