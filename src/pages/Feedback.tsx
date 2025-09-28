import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { FeedbackForm } from "@/components/FeedbackForm";
import { PaymentStatus } from "@/components/PaymentStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, CreditCard } from "lucide-react";

const Feedback = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Feedback & Payment Status - Justice Bot"
        description="Share your feedback with Justice Bot and check your payment history. Help us improve our legal assistance platform."
        keywords="feedback, payment status, user experience, Justice Bot, legal assistance feedback"
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Feedback & Account</h1>
            <p className="text-muted-foreground">
              Share your feedback and manage your account
            </p>
          </div>

          <Tabs defaultValue="feedback" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="feedback" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Feedback
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Status
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="feedback" className="mt-6">
              <FeedbackForm />
            </TabsContent>
            
            <TabsContent value="payments" className="mt-6">
              <PaymentStatus />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Feedback;