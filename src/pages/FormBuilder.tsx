import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  FileText, 
  Sparkles,
  Eye,
  Download,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
// ❌ REMOVED - Sonner causing runtime errors
// import { toast } from "sonner";
import { toast } from "@/lib/toast-stub";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PremiumStatus } from "@/components/PremiumStatus";
import { useCaseProfile } from "@/hooks/useCaseProfile";

import type { Json } from '@/integrations/supabase/types';

interface FormInfo {
  id: string;
  form_code: string;
  title: string;
  description: string;
  tribunal_type: string;
  price_cents: number;
  form_fields: Json;
  filing_requirements: Json;
}

interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  help_text?: string;
}

const FormBuilder = () => {
  const { formId } = useParams<{ formId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const caseId = location.state?.caseId as string | undefined;
  const { caseProfile } = useCaseProfile(caseId);

  const [form, setForm] = useState<FormInfo | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, string | number | boolean | readonly string[]>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);

  const prefillData = location.state?.prefillData || "";
  const sections = ["Personal Info", "Case Details", "Supporting Evidence", "Review"];

  useEffect(() => {
    if (formId) {
      fetchForm();
    }
  }, [formId]);

  useEffect(() => {
    // Auto-fill from case profile or prefillData
    if (fields.length > 0 && Object.keys(formData).length === 0) {
      if (caseProfile) {
        autoFillFromProfile();
      } else if (prefillData) {
        autoFillForm();
      }
    }
  }, [fields, prefillData, caseProfile]);

  const fetchForm = async () => {
    if (!formId) return;

    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', formId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error("Form not found");
        navigate('/forms');
        return;
      }

      if (!data.pdf_url && !data.form_fields) {
        toast.error("This form is not yet available. Redirecting to forms library.");
        navigate('/forms');
        return;
      }
      
      if (!data) {
        toast.error("Form not found");
        navigate('/forms');
        return;
      }
      
      setForm(data);
      
      // Parse form fields or create default structure
      let formFields: FormField[] = [];
      if (Array.isArray(data.form_fields) && data.form_fields.length > 0) {
        // Try to use existing fields if they're properly formatted
        try {
          formFields = data.form_fields as unknown as FormField[];
        } catch {
          formFields = createDefaultFields(data.form_code);
        }
      } else {
        formFields = createDefaultFields(data.form_code);
      }
      setFields(formFields);
      
      // Initialize form data with empty values
      const initialData: Record<string, any> = {};
      formFields.forEach((field: FormField) => {
        initialData[field.name] = '';
      });
      setFormData(initialData);
      
    } catch (error) {
      console.error('Error fetching form:', error);
      toast.error('Failed to load form');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultFields = (formCode: string): FormField[] => {
    const baseFields: FormField[] = [
      { id: '1', name: 'applicant_name', label: 'Full Name', type: 'text', required: true },
      { id: '2', name: 'applicant_address', label: 'Address', type: 'textarea', required: true },
      { id: '3', name: 'applicant_phone', label: 'Phone Number', type: 'tel', required: true },
      { id: '4', name: 'applicant_email', label: 'Email', type: 'email', required: true },
    ];

    // Add form-specific fields based on form code
    if (formCode?.startsWith('T2')) {
      baseFields.push(
        { id: '5', name: 'respondent_name', label: 'Landlord/Property Manager Name', type: 'text', required: true },
        { id: '6', name: 'rental_address', label: 'Rental Property Address', type: 'textarea', required: true },
        { id: '7', name: 'issue_description', label: 'Description of Issue', type: 'textarea', required: true },
        { id: '8', name: 'remedy_sought', label: 'What remedy are you seeking?', type: 'textarea', required: true }
      );
    } else if (formCode?.includes('Form 1')) {
      baseFields.push(
        { id: '5', name: 'respondent_name', label: 'Respondent Name', type: 'text', required: true },
        { id: '6', name: 'incident_date', label: 'Date of Incident', type: 'date', required: true },
        { id: '7', name: 'discrimination_ground', label: 'Ground of Discrimination', type: 'select', 
          options: ['Race', 'Gender', 'Disability', 'Religion', 'Sexual Orientation', 'Other'], required: true },
        { id: '8', name: 'incident_description', label: 'Description of Discrimination', type: 'textarea', required: true }
      );
    } else {
      baseFields.push(
        { id: '5', name: 'case_description', label: 'Case Description', type: 'textarea', required: true },
        { id: '6', name: 'relief_sought', label: 'Relief Sought', type: 'textarea', required: true }
      );
    }

    return baseFields;
  };

  const autoFillFromProfile = () => {
    if (!caseProfile) return;
    
    setAutoFilling(true);
    const filled: Record<string, any> = { ...formData };

    // Fill common fields from profile
    if (caseProfile.parties?.tenant) filled['tenant_name'] = caseProfile.parties.tenant;
    if (caseProfile.parties?.landlord) filled['landlord_name'] = caseProfile.parties.landlord;
    if (caseProfile.location?.postalCode) filled['postal_code'] = caseProfile.location.postalCode;
    if (caseProfile.location?.municipality) filled['municipality'] = caseProfile.location.municipality;
    
    // Fill description with facts
    if (caseProfile.facts && caseProfile.facts.length > 0) {
      filled['issue_description'] = caseProfile.facts.join('. ');
    }

    // Fill keywords and flags
    if (caseProfile.keywords) {
      filled['keywords'] = caseProfile.keywords.join(', ');
    }

    setFormData(filled);
    setAutoFilling(false);
    toast.success("Form auto-filled from case profile");
  };

  const autoFillForm = async () => {
    if (!prefillData || autoFilling) return;
    
    setAutoFilling(true);
    toast.loading("AI is pre-filling your form...");
    
    try {
      // Get user profile for additional context
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      // Call AI pre-fill edge function
      const { data, error } = await supabase.functions.invoke('prefill-form', {
        body: {
          triageData: prefillData,
          formFields: fields.map(f => ({
            id: f.id,
            name: f.name,
            label: f.label,
            type: f.type,
            options: f.options
          })),
          userProfile: profile
        }
      });

      if (error) throw error;

      if (data?.success && data.prefilled_data) {
        // Map AI prefilled data to form fields
        const updatedData = { ...formData };
        Object.entries(data.prefilled_data).forEach(([fieldId, value]) => {
          const field = fields.find(f => f.id === fieldId || f.name === fieldId);
          if (field && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
            updatedData[field.name] = value;
          }
        });
        
        setFormData(updatedData);
        toast.success("Form pre-filled with AI! Review and edit as needed.");
      } else {
        throw new Error("Failed to pre-fill form");
      }
    } catch (error: unknown) {
      console.error('Auto-fill error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to pre-fill form. You can fill it manually.");
    } finally {
      setAutoFilling(false);
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const saveProgress = async () => {
    if (!user || !formId) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('form_usage')
        .upsert([{
          form_id: formId,
          user_id: user.id,
          field_data: formData as unknown as Json,
          completion_status: 'in_progress'
        }]);

      if (error) throw error;
      toast.success("Progress saved!");
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  const generatePDF = async () => {
    if (!user || !form) {
      toast.error("Please sign in to generate PDF");
      return;
    }

    // Check if form requires payment
    if (form.price_cents > 0) {
      // Check if user has purchased this form
      const { data: purchases, error: purchaseError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .eq('form_id', form.id)
        .eq('status', 'completed')
        .maybeSingle();

      if (purchaseError) {
        console.error('Purchase check error:', purchaseError);
      }

      if (!purchases) {
        // Show payment required message
        toast.error(`Payment required: $${(form.price_cents / 100).toFixed(2)} CAD`);
        
        // Navigate to payment
        try {
          const { data: paymentData, error: paymentCreateError } = await supabase
            .from('payments')
            .insert({
              user_id: user.id,
              form_id: form.id,
              amount: form.price_cents / 100,
              amount_cents: form.price_cents,
              currency: 'CAD',
              plan_type: 'form_purchase',
              status: 'pending',
              payment_id: `form_${form.id}_${Date.now()}`,
              payment_provider: 'paypal'
            })
            .select()
            .single();

          if (paymentCreateError) throw paymentCreateError;

          // Call payment function
          const { data: sessionData, error: sessionError } = await supabase.functions.invoke('create-form-payment', {
            body: {
              formId: form.id,
              paymentId: paymentData.id
            }
          });

          if (sessionError) throw sessionError;

          if (sessionData?.url) {
            window.open(sessionData.url, '_blank');
            toast.success("Complete payment to download your form");
          }
        } catch (error: any) {
          console.error('Payment error:', error);
          toast.error('Failed to process payment');
        }
        return;
      }
    }

    try {
      toast.loading("Generating official PDF form...");
      
      // Try official PDF filling first
      const { data, error } = await supabase.functions.invoke('fill-official-pdf', {
        body: {
          caseId: location.state?.caseId || 'temp',
          formCode: form.form_code,
          formData
        }
      });

      if (error) {
        console.error('Official PDF error:', error);
        
        // Fallback to custom PDF generation
        const { data: fallbackData, error: fallbackError } = await supabase.functions.invoke('generate-pdf', {
          body: {
            formData,
            formInfo: {
              form_code: form.form_code,
              title: form.title,
              tribunal_type: form.tribunal_type
            }
          }
        });


        if (fallbackError) throw fallbackError;
        
        if (fallbackData?.pdfUrl) {
          window.open(fallbackData.pdfUrl, '_blank');
          toast.success("Custom PDF generated successfully!");
        }
        return;
      }

      if (data?.pdfUrl) {
        window.open(data.pdfUrl, '_blank');
        toast.success("Official PDF form generated and saved!");
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const getFieldsBySection = (sectionIndex: number): FormField[] => {
    const fieldsPerSection = Math.ceil(fields.length / sections.length);
    const start = sectionIndex * fieldsPerSection;
    const end = start + fieldsPerSection;
    return fields.slice(start, end);
  };

  const renderField = (field: FormField) => {
    const rawValue = formData[field.name];
    const value = typeof rawValue === 'string' || typeof rawValue === 'number' ? rawValue : '';

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={String(value)}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="min-h-24"
          />
        );
      case 'select':
        return (
          <select
            value={String(value)}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full p-2 border border-input rounded-md bg-background"
          >
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      default:
        return (
          <Input
            type={field.type}
            value={String(value)}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  const progress = ((currentSection + 1) / sections.length) * 100;
  const currentFields = getFieldsBySection(currentSection);
  const isLastSection = currentSection === sections.length - 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-pulse">Loading form...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">Form Not Found</h1>
            <Button onClick={() => navigate('/')}>Return Home</Button>
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">{form.form_code}: {form.title}</h1>
                <p className="text-muted-foreground">{form.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={saveProgress} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                {prefillData && (
                  <Button variant="outline" onClick={autoFillForm} disabled={autoFilling}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {autoFilling ? 'Auto-filling...' : 'Auto-fill'}
                  </Button>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Section {currentSection + 1} of {sections.length}: {sections[currentSection]}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Form Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {sections[currentSection]}
                  </CardTitle>
                  {isLastSection && (
                    <CardDescription>
                      Review your information before generating the final form
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLastSection ? (
                    // Review section
                    <div className="space-y-6">
                      {sections.slice(0, -1).map((sectionName, idx) => (
                        <div key={idx}>
                          <h4 className="font-semibold mb-3">{sectionName}</h4>
                          <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                            {getFieldsBySection(idx).map(field => (
                              <div key={field.id}>
                                <span className="font-medium text-sm">{field.label}:</span>
                                <p className="text-sm text-muted-foreground">
                                  {formData[field.name] || 'Not provided'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="flex gap-4">
                        <Button onClick={generatePDF} className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Generate PDF
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Form
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Regular form fields
                    <div className="space-y-4">
                      {currentFields.map((field) => (
                        <div key={field.id}>
                          <Label htmlFor={field.name}>
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                          </Label>
                          <div className="mt-2">
                            {renderField(field)}
                          </div>
                          {field.help_text && (
                            <p className="text-sm text-muted-foreground mt-1">{field.help_text}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                      disabled={currentSection === 0}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    <Button
                      onClick={() => setCurrentSection(prev => Math.min(sections.length - 1, prev + 1))}
                      disabled={isLastSection}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <PremiumStatus />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Filing Deadlines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-warning mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Important</p>
                          <p className="text-xs text-muted-foreground">
                            Check official deadlines for your specific case type
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      Contact the tribunal for official guidance
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Get Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FormBuilder;