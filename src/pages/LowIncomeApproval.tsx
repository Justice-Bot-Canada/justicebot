import { useState } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LowIncomeApproval = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    income_amount: "",
    household_size: "",
    employment_status: "",
    additional_info: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": "Low-Income Legal Assistance Program",
    "description": "Financial assistance program providing affordable access to legal services for low-income Canadians. Get full access to Justice-Bot for just $25/year.",
    "provider": {
      "@type": "Organization",
      "name": "Justice-Bot"
    },
    "serviceType": "Legal Aid",
    "areaServed": "Canada",
    "offers": {
      "@type": "Offer",
      "price": "25",
      "priceCurrency": "CAD",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "eligibleRegion": "CA"
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "File Required",
        description: "Please upload proof of income",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `income-proof/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('income-proof')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Insert application data
      const { error: insertError } = await supabase
        .from('low_income_applications')
        .insert({
          user_id: user.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          annual_income: parseInt(formData.income_amount),
          household_size: parseInt(formData.household_size),
          employment_status: formData.employment_status,
          proof_of_income_url: filePath,
          status: 'pending'
        });

      if (insertError) throw insertError;

      setSubmitted(true);
      toast({
        title: "Application Submitted",
        description: "We'll review your application within 3-5 business days",
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title="Application Submitted - Low-Income Legal Assistance"
          description="Your low-income program application has been submitted. We'll review within 3-5 business days and notify you via email."
          keywords="legal aid application, low income legal help, financial assistance submitted"
          canonicalUrl="https://justice-bot.com/low-income"
        />
        <Header />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Application Submitted</CardTitle>
              <CardDescription>
                Thank you for applying for our low-income program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                We'll review your application within 3-5 business days and notify you via email. 
                If approved, you'll receive instructions on how to access the discounted pricing.
              </p>
              <Button onClick={() => navigate('/')}>
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Low-Income Legal Assistance Program - $25/Year"
        description="Apply for affordable legal help if you qualify for our low-income program. Get full access to Justice-Bot legal services for just $25/year. Income verification required for individuals under $30K, families under $45-60K. OW/ODSP recipients and students may qualify."
        keywords="low income legal help Canada, affordable legal services Ontario, legal aid application, financial assistance legal help, Ontario Works legal help, ODSP legal services, student legal aid"
        canonicalUrl="https://justice-bot.com/low-income"
        structuredData={structuredData}
      />
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Breadcrumbs items={[
            { label: "Low-Income Program" }
          ]} />
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Low-Income Legal Assistance Program</h1>
            <p className="text-muted-foreground text-lg">
              Access Justice-Bot for just $25/year if you qualify for our low-income program. 
              We believe everyone deserves access to legal help, regardless of their financial situation.
            </p>
          </div>

          <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Who Qualifies for Our Low-Income Program?
              </h2>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <p><strong>✓ Individuals:</strong> Annual household income under $30,000 CAD</p>
                <p><strong>✓ Couples/2-person households:</strong> Annual household income under $45,000 CAD</p>
                <p><strong>✓ Families (3+ members):</strong> Annual household income under $60,000 CAD</p>
                <p><strong>✓ Social Assistance Recipients:</strong> Ontario Works (OW) or ODSP beneficiaries</p>
                <p><strong>✓ Students:</strong> Full-time students with limited income</p>
                <p><strong>✓ Employment Insurance:</strong> Those receiving EI benefits</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>
                Please provide accurate information and proof of income for verification. 
                <strong className="block mt-2 text-primary">Review Time: 3-5 business days</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h3 className="font-semibold mb-2">What You'll Get When Approved:</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Access to ALL legal forms ($25/year instead of $5.99 per form)</li>
                  <li>✓ Unlimited document generation and downloads</li>
                  <li>✓ AI-powered legal analysis and guidance</li>
                  <li>✓ Case tracking and deadline reminders</li>
                  <li>✓ Priority customer support</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  <strong>Refund Policy:</strong> If your application is denied, any payment will be fully refunded. 
                  <a href="/payment-policy" className="text-primary hover:underline ml-1">View full policy</a>
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="household_size">Household Size *</Label>
                    <Input
                      id="household_size"
                      name="household_size"
                      type="number"
                      min="1"
                      value={formData.household_size}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="income_amount">Annual Income (CAD) *</Label>
                    <Input
                      id="income_amount"
                      name="income_amount"
                      type="number"
                      min="0"
                      value={formData.income_amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="employment_status">Employment Status *</Label>
                    <Input
                      id="employment_status"
                      name="employment_status"
                      value={formData.employment_status}
                      onChange={handleInputChange}
                      placeholder="e.g., Unemployed, Part-time, Student"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="additional_info">Additional Information</Label>
                  <Textarea
                    id="additional_info"
                    name="additional_info"
                    value={formData.additional_info}
                    onChange={handleInputChange}
                    placeholder="Any additional context about your financial situation"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="proof_file">Proof of Income *</Label>
                  <div className="mt-2">
                    <Input
                      id="proof_file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileChange}
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload recent tax return, pay stub, benefit statement, or other income verification (PDF, images, or documents)
                    </p>
                  </div>
                  {selectedFile && (
                    <div className="flex items-center mt-2 p-2 bg-muted rounded">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="text-sm">{selectedFile.name}</span>
                    </div>
                  )}
                </div>

                <div className="text-sm text-muted-foreground p-4 bg-muted rounded">
                  <strong>Eligibility Criteria:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• <strong>Individual:</strong> Annual income under $30,000 CAD</li>
                    <li>• <strong>Family of 2:</strong> Annual income under $45,000 CAD</li>
                    <li>• <strong>Family of 3+:</strong> Annual income under $60,000 CAD</li>
                    <li>• Students, unemployed, or receiving Ontario Works/ODSP may qualify</li>
                  </ul>
                  <p className="mt-3 text-xs">
                    <strong>Accepted Documentation:</strong> Recent tax return (Notice of Assessment), pay stubs (last 3 months), 
                    benefit statements (OW/ODSP), student financial aid confirmation, or Employment Insurance statements.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LowIncomeApproval;