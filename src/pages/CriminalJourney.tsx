import React from "react";
import { UserJourney } from "@/components/UserJourney";
import SEOHead from "@/components/SEOHead";

const CriminalJourney = () => {
  return (
    <>
      <SEOHead 
        title="Criminal Law Journey - Justice Bot"
        description="Step-by-step guidance for navigating criminal charges and court proceedings in Ontario"
        keywords="criminal law, criminal charges, court proceedings, Ontario criminal law, legal representation"
      />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <UserJourney 
            venue="criminal"
            userSituation="criminal charges"
          />
        </div>
      </div>
    </>
  );
};

export default CriminalJourney;