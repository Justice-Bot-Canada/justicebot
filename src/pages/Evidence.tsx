import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EvidenceBuilder from "@/components/EvidenceBuilder";
import { PremiumGate } from "@/components/PremiumGate";

const Evidence = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId');

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-4">Please sign in to access the Evidence Builder</p>
            <Button onClick={() => navigate("/")}>Return Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!caseId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">No Case Selected</h1>
            <p className="text-muted-foreground mb-4">Please select a case to manage evidence</p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Evidence Management</h1>
            <p className="text-muted-foreground">
              Build a comprehensive Book of Documents for your legal case
            </p>
          </div>

          <PremiumGate feature="Evidence Management">
            <EvidenceBuilder 
              caseId={caseId} 
              onUpdate={() => {
                // Refresh case data if needed
              }}
            />
          </PremiumGate>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Evidence;