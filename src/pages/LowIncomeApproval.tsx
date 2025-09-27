import { useState } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LowIncomeApproval = () => {
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
        .from('legal-docs')
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
          income_amount: parseInt(formData.income_amount),
          household_size: parseInt(formData.household_size),
          employment_status: formData.employment_status,
          additional_info: formData.additional_info,
          proof_file_path: filePath,
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
              <Button onClick={() => window.location.href = '/'}>
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
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Low-Income Program Application</h1>
            <p className="text-muted-foreground">
              Access Justice-Bot for just $25/year if you qualify for our low-income program
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>
                Please provide accurate information and proof of income for verification
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  <strong>Eligibility Guidelines:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Individual: Annual income under $30,000 CAD</li>
                    <li>• Family of 2: Annual income under $45,000 CAD</li>
                    <li>• Family of 3+: Annual income under $60,000 CAD</li>
                    <li>• Students, unemployed, or receiving government assistance may qualify</li>
                  </ul>
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