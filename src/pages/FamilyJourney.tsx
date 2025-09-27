import React from "react";
import { UserJourney } from "@/components/UserJourney";
import SEOHead from "@/components/SEOHead";

const FamilyJourney = () => {
  return (
    <>
      <SEOHead 
        title="Family Law Journey - Justice Bot"
        description="Step-by-step guidance for divorce, custody, child protection, and family court matters in Ontario"
        keywords="family law, divorce, custody, child protection, family court, Ontario family law"
      />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <UserJourney 
            venue="family"
            userSituation="family law matter"
          />
        </div>
      </div>
    </>
  );
};

export default FamilyJourney;