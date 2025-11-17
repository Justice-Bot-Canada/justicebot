import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  Scale, 
  FileText, 
  MapPin,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AssessmentStep {
  title: string;
  description: string;
  fields: string[];
}

const steps: AssessmentStep[] = [
  {
    title: "Your Situation",
    description: "Tell us about your legal issue in your own words",
    fields: ["title", "description"]
  },
  {
    title: "Location & Context",
    description: "Help us understand where and when this occurred",
    fields: ["province", "municipality", "law_section"]
  },
  {
    title: "Review & Submit",
    description: "Review your information before analysis",
    fields: []
  }
];

const CaseAssessment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    province: "",
    municipality: "",
    law_section: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Auth check is now handled by ProtectedRoute
    if (!formData.title || !formData.description || !formData.province) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cases')
        .insert({
          ...formData,
          user_id: user.id,
          status: 'analyzing'
        })
        .select()
        .single();

      if (error) throw error;

      // Start AI analysis
      const analysisResponse = await supabase.functions.invoke('analyze-legal-case', {
        body: {
          caseId: data.id,
          description: formData.description,
          province: formData.province,
          municipality: formData.municipality,
          lawSection: formData.law_section,
          evidenceFiles: []
        }
      });

      if (analysisResponse.error) {
        console.error('Analysis error:', analysisResponse.error);
      }

      // Auto-generate timeline events from case data
      // This is the MAGIC that connects triage → timeline
      const { generateTimelineFromCase } = await import('@/utils/timelineGenerator');
      await generateTimelineFromCase({
        id: data.id,
        title: formData.title,
        description: formData.description,
        province: formData.province,
        municipality: formData.municipality,
        law_section: formData.law_section,
        user_id: user.id
      });

      toast.success("Case created! Timeline events generated automatically.");
      
      // Navigate to pathway selection with the case ID and merit score
      navigate(`/pathway/${data.id}`);
    } catch (error) {
      console.error('Error submitting case:', error);
      toast.error('Failed to submit case');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Case Assessment</h1>
            <p className="text-muted-foreground">
              Let's gather information about your legal situation to provide the best guidance.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 0 && (
                <>
                  <div>
                    <Label htmlFor="title">Case Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Brief description of your issue"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe your situation in detail. Include relevant dates, people involved, and what happened."
                      className="mt-2 min-h-32"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      The more detail you provide, the better we can assess your case.
                    </p>
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div>
                    <Label htmlFor="province">Province/Territory *</Label>
                    <select
                      id="province"
                      value={formData.province}
                      onChange={(e) => handleInputChange("province", e.target.value)}
                      className="w-full mt-2 p-2 border border-input rounded-md bg-background"
                    >
                      <option value="">Select Province/Territory</option>
                      <option value="Ontario">Ontario</option>
                      <option value="Quebec">Quebec</option>
                      <option value="British Columbia">British Columbia</option>
                      <option value="Alberta">Alberta</option>
                      <option value="Manitoba">Manitoba</option>
                      <option value="Saskatchewan">Saskatchewan</option>
                      <option value="Nova Scotia">Nova Scotia</option>
                      <option value="New Brunswick">New Brunswick</option>
                      <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                      <option value="Prince Edward Island">Prince Edward Island</option>
                      <option value="Northwest Territories">Northwest Territories</option>
                      <option value="Nunavut">Nunavut</option>
                      <option value="Yukon">Yukon</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="municipality">City/Municipality</Label>
                    <Input
                      id="municipality"
                      value={formData.municipality}
                      onChange={(e) => handleInputChange("municipality", e.target.value)}
                      placeholder="Where did this occur?"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="law_section">Relevant Law or Regulation (if known)</Label>
                    <Input
                      id="law_section"
                      value={formData.law_section}
                      onChange={(e) => handleInputChange("law_section", e.target.value)}
                      placeholder="e.g., Residential Tenancies Act s.37"
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Optional: If you know of specific laws that apply to your situation.
                    </p>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Review Your Information</h3>
                    <div className="space-y-3 p-4 bg-secondary/20 rounded-lg">
                      <div>
                        <span className="font-medium">Title:</span>
                        <p className="text-sm text-muted-foreground">{formData.title}</p>
                      </div>
                      <div>
                        <span className="font-medium">Description:</span>
                        <p className="text-sm text-muted-foreground">{formData.description}</p>
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>
                        <p className="text-sm text-muted-foreground">
                          {formData.municipality ? `${formData.municipality}, ` : ""}{formData.province}
                        </p>
                      </div>
                      {formData.law_section && (
                        <div>
                          <span className="font-medium">Law Section:</span>
                          <p className="text-sm text-muted-foreground">{formData.law_section}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-primary mb-1">Ready for AI Analysis</p>
                        <p className="text-sm text-muted-foreground">
                          Our AI will analyze your case to determine the best legal pathway, 
                          calculate merit score, and provide personalized recommendations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Auth check is now handled by ProtectedRoute */}
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep === steps.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit for Analysis"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={
                      (currentStep === 0 && (!formData.title || !formData.description)) ||
                      (currentStep === 1 && !formData.province)
                    }
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CaseAssessment;