import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Scale, 
  FileText, 
  CreditCard, 
  User, 
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Gift,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import CaseManager from "@/components/CaseManager";
import CaseCalendar from "@/components/CaseCalendar";
import { DocumentAnalyzer } from "@/components/DocumentAnalyzer";
import { EvidenceHub } from "@/components/EvidenceHub";
import { BookOfDocumentsWizard } from "@/components/BookOfDocumentsWizard";
import CaseProgressTracker from "@/components/CaseProgressTracker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PremiumGate } from "@/components/PremiumGate";
import { LegalChatbot } from "@/components/LegalChatbot";
import { FormsList } from "@/components/FormsList";
import { DeadlineWidget } from "@/components/DeadlineWidget";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user } = useAuth();
  const { hasAccess, isFreeUser, userNumber } = usePremiumAccess();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [hasExistingCases, setHasExistingCases] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showBookWizard, setShowBookWizard] = useState(false);

  // Check if user has existing cases
  useEffect(() => {
    const checkExistingCases = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('cases')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (!error && data && data.length > 0) {
          setHasExistingCases(true);
        }
      } catch (error) {
        console.error('Error checking cases:', error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingCases();
  }, [user]);

  // Auth check is now handled by ProtectedRoute

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Legal Dashboard</h1>
          <p className="text-muted-foreground">
            {hasExistingCases 
              ? "Manage your cases, access forms, and track your progress" 
              : "Start by using AI Triage to understand your legal situation"}
          </p>
          
          {isFreeUser && userNumber && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Gift className="w-4 h-4" />
                <Badge variant="outline" className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                  FREE User #{userNumber}
                </Badge>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                You have lifetime free access to all premium features!
              </p>
            </div>
          )}

          {!hasExistingCases && (
            <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Welcome! Here's how to get started:
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Use <strong>AI Triage</strong> to describe your legal issue</li>
                <li>Create a case from the AI recommendations</li>
                <li>Upload evidence in the <strong>Documents</strong> tab</li>
                <li>Track deadlines in the <strong>Calendar</strong> tab</li>
                <li>Purchase and download forms when ready</li>
              </ol>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="triage" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">AI Triage</span>
              <span className="sm:hidden">Triage</span>
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">Cases</span>
              <span className="sm:hidden">Cases</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
              <span className="sm:hidden">Cal</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
              <span className="sm:hidden">Docs</span>
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Forms</span>
              <span className="sm:hidden">Forms</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
              <span className="sm:hidden">Pay</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
              <span className="sm:hidden">Acct</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="triage" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    AI Legal Assistant - Start Here
                  </CardTitle>
                  <CardDescription>
                    {hasExistingCases 
                      ? "Get help with your legal questions and explore new cases" 
                      : "Tell me about your legal issue and I'll guide you through the right pathway"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LegalChatbot />
                </CardContent>
              </Card>

              {activeCaseId && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Upload Evidence & Documents
                    </CardTitle>
                    <CardDescription>
                      After discussing your case, upload relevant documents, evidence, or correspondence for AI analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DocumentAnalyzer caseId={activeCaseId} />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="cases" className="mt-6">
            {activeCaseId ? (
              <div className="space-y-6">
                <CaseProgressTracker caseId={activeCaseId} />
                <CaseManager onCaseSelect={setActiveCaseId} />
              </div>
            ) : (
              <CaseManager onCaseSelect={setActiveCaseId} />
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <div className="space-y-6">
              <DeadlineWidget />
              {activeCaseId ? (
                <CaseCalendar caseId={activeCaseId} />
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="mb-2 font-medium">No case selected</p>
                    <p className="text-sm">Go to the <strong>Cases</strong> tab to create or select a case first</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            {activeCaseId ? (
              <div className="space-y-6">
                {/* Evidence Hub - Main document library */}
                <EvidenceHub caseId={activeCaseId} />
                
                {/* Book of Documents Builder Button */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Book of Documents
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Generate a professionally formatted book of documents with index and page numbers
                        </p>
                      </div>
                      <Button onClick={() => setShowBookWizard(true)}>
                        Build Book of Documents
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Book of Documents Wizard Dialog */}
                <BookOfDocumentsWizard 
                  caseId={activeCaseId} 
                  open={showBookWizard}
                  onOpenChange={setShowBookWizard}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="mb-2 font-medium">No case selected</p>
                  <p className="text-sm">Go to the <strong>Cases</strong> tab to create or select a case first.</p>
                  <p className="text-sm mt-2">Documents uploaded during triage will appear here once you select the case.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="forms" className="mt-6">
            <FormsList />
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Choose your preferred payment option</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">PayPal</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Secure payment with PayPal or credit card
                    </p>
                    <Button>Pay with PayPal</Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">E-Transfer</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Send payment directly to: payments@justice-bot.com
                    </p>
                    <Button variant="outline">Copy Email</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>Your recent transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">LTB Application Form</p>
                        <p className="text-sm text-muted-foreground">March 15, 2024</p>
                      </div>
                      <Badge variant="outline" className="text-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Paid
                      </Badge>
                    </div>
                    
                    <div className="text-center py-8 text-muted-foreground">
                      No previous purchases
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account Type</label>
                    <p className="text-sm text-muted-foreground">Standard User</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Member Since</label>
                    <p className="text-sm text-muted-foreground">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Case Progress Overview</CardTitle>
                  <CardDescription>Your legal journey at a glance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cases Created</span>
                      <span>0</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Forms Purchased</span>
                      <span>0</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active Cases</span>
                      <span>0</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;