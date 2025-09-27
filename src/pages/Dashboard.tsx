import { useState } from "react";
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
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CaseManager from "@/components/CaseManager";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("cases");

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
              <p className="text-muted-foreground mb-4">Please sign in to access your dashboard.</p>
              <Button>Sign In</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Legal Dashboard</h1>
          <p className="text-muted-foreground">Manage your cases, access forms, and track your progress</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cases" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Cases
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="mt-6">
            <CaseManager />
          </TabsContent>

          <TabsContent value="forms" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Application to Landlord & Tenant Board
                  </CardTitle>
                  <CardDescription>File disputes about rent, evictions, or repairs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="secondary">Form A1 - Tenant Application</Badge>
                    <Badge variant="secondary">Form A2 - Landlord Application</Badge>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price: $5.99</span>
                      <Button size="sm">
                        Purchase <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Human Rights Application
                  </CardTitle>
                  <CardDescription>File discrimination or human rights complaints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="secondary">Form 1 - Application</Badge>
                    <Badge variant="secondary">Supporting Documents Guide</Badge>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price: $5.99</span>
                      <Button size="sm">
                        Purchase <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Small Claims Court
                  </CardTitle>
                  <CardDescription>File claims under $35,000</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="secondary">Plaintiff's Claim</Badge>
                    <Badge variant="secondary">Defence Form</Badge>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price: $5.99</span>
                      <Button size="sm">
                        Purchase <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Low Income Support
                  </CardTitle>
                  <CardDescription>Reduced pricing with income verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="outline" className="text-primary">All Forms: $0.99</Badge>
                    <Badge variant="outline" className="text-primary">Annual Access: $25.99</Badge>
                    <Button size="sm" variant="outline">
                      Apply for Support <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                      Send payment directly to: admin@justice-bot.com
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

          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account Type</label>
                    <p className="text-sm text-muted-foreground">Standard User</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Member Since</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
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