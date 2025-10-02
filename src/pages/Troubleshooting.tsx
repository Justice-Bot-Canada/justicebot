import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Troubleshooting = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Troubleshooting & Help - Justice Bot"
        description="Get help with common issues and questions about using Justice Bot. Find solutions to technical problems and learn how to use our features."
        keywords="troubleshooting, help, support, FAQ, Justice Bot issues, technical support"
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Troubleshooting & Help</h1>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            Find solutions to common issues and get the most out of Justice Bot
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Common Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>I can't log in to my account</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>If you're having trouble logging in:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Check that your email address is correct</li>
                        <li>Make sure you've verified your email (check your inbox for a verification email)</li>
                        <li>Try using the "Forgot Password" option to reset your password</li>
                        <li>Clear your browser cache and cookies</li>
                        <li>Try using a different browser or incognito mode</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>My case analysis isn't loading</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>If your case analysis is taking too long or not loading:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Refresh the page and try again</li>
                        <li>Check your internet connection</li>
                        <li>Make sure you've provided all required information</li>
                        <li>If the issue persists, contact support with your case details</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>I can't upload documents</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>For document upload issues:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Check that your file is in a supported format (PDF, JPG, PNG, DOCX)</li>
                        <li>Ensure your file size is under 10MB</li>
                        <li>Try compressing large files before uploading</li>
                        <li>Check that you have a stable internet connection</li>
                        <li>Try using a different browser</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>My payment didn't go through</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>If you're having payment issues:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Verify your payment information is correct</li>
                        <li>Check that your card has sufficient funds</li>
                        <li>Try using a different payment method</li>
                        <li>Contact your bank to ensure the transaction wasn't blocked</li>
                        <li>If you were charged but don't see access, contact support immediately</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Forms aren't pre-filling correctly</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>If forms aren't pre-filling with your information:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Make sure you've completed your profile information</li>
                        <li>Verify that your case information is saved</li>
                        <li>Try refreshing the page</li>
                        <li>Clear your browser cache</li>
                        <li>Check that you're using the correct form for your case type</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>I need to update my case information</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>To update your case:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Go to your Dashboard</li>
                        <li>Select the case you want to update</li>
                        <li>Click "Edit Case" or the edit icon</li>
                        <li>Make your changes and save</li>
                        <li>Your case analysis will update automatically</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>How do I qualify for free access?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>To apply for low-income free access:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Go to the Pricing page</li>
                        <li>Click "Apply for Low-Income Access"</li>
                        <li>Fill out the qualification form</li>
                        <li>Submit proof of income or benefits</li>
                        <li>You'll receive a response within 24-48 hours</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>If you couldn't find a solution to your problem, we're here to help:</p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => navigate("/contact")}
                >
                  <Mail className="h-6 w-6" />
                  <span>Contact Support</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => navigate("/feedback")}
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>Send Feedback</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Troubleshooting;
