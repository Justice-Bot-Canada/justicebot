import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FileText, Download, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast-stub';

interface Form {
  id: string;
  form_code: string;
  title: string;
  description: string | null;
  pdf_url: string | null;
}

interface PrefilledData {
  [key: string]: string | boolean;
}

interface OfficialFormFillerProps {
  form: Form;
  caseId: string;
  prefilledData?: PrefilledData;
}

// Common form fields for Ontario court forms
const FORM_FIELD_TEMPLATES: Record<string, { id: string; label: string; type: 'text' | 'textarea' | 'date' | 'checkbox'; required?: boolean }[]> = {
  default: [
    { id: 'applicant_name', label: 'Your Full Legal Name', type: 'text', required: true },
    { id: 'applicant_address', label: 'Your Address', type: 'text', required: true },
    { id: 'applicant_phone', label: 'Phone Number', type: 'text' },
    { id: 'applicant_email', label: 'Email Address', type: 'text' },
    { id: 'respondent_name', label: 'Respondent Name', type: 'text', required: true },
    { id: 'respondent_address', label: 'Respondent Address', type: 'text' },
    { id: 'incident_date', label: 'Date of Incident', type: 'date' },
    { id: 'description', label: 'Description of Events', type: 'textarea', required: true },
    { id: 'remedy_sought', label: 'Remedy Sought', type: 'textarea' },
  ],
  'LTB': [
    { id: 'applicant_name', label: 'Tenant Full Name', type: 'text', required: true },
    { id: 'applicant_address', label: 'Tenant Address', type: 'text', required: true },
    { id: 'applicant_phone', label: 'Tenant Phone', type: 'text' },
    { id: 'applicant_email', label: 'Tenant Email', type: 'text' },
    { id: 'respondent_name', label: 'Landlord Name', type: 'text', required: true },
    { id: 'respondent_address', label: 'Landlord Address', type: 'text' },
    { id: 'rental_address', label: 'Rental Unit Address', type: 'text', required: true },
    { id: 'monthly_rent', label: 'Monthly Rent Amount', type: 'text' },
    { id: 'lease_start', label: 'Lease Start Date', type: 'date' },
    { id: 'incident_date', label: 'Date Issue Started', type: 'date' },
    { id: 'description', label: 'Details of Issue', type: 'textarea', required: true },
  ],
  'HRTO': [
    { id: 'applicant_name', label: 'Applicant Full Name', type: 'text', required: true },
    { id: 'applicant_address', label: 'Applicant Address', type: 'text', required: true },
    { id: 'applicant_phone', label: 'Phone', type: 'text' },
    { id: 'applicant_email', label: 'Email', type: 'text' },
    { id: 'respondent_name', label: 'Respondent Organization/Person', type: 'text', required: true },
    { id: 'respondent_address', label: 'Respondent Address', type: 'text' },
    { id: 'discrimination_ground', label: 'Ground of Discrimination', type: 'text', required: true },
    { id: 'social_area', label: 'Social Area (employment, housing, services)', type: 'text', required: true },
    { id: 'incident_date', label: 'Date of Discrimination', type: 'date', required: true },
    { id: 'description', label: 'Detailed Description of Events', type: 'textarea', required: true },
    { id: 'remedy_sought', label: 'Remedy Sought', type: 'textarea' },
  ],
  'FAMILY': [
    { id: 'applicant_name', label: 'Your Full Legal Name', type: 'text', required: true },
    { id: 'applicant_address', label: 'Your Address', type: 'text', required: true },
    { id: 'spouse_name', label: 'Other Party Name', type: 'text', required: true },
    { id: 'marriage_date', label: 'Date of Marriage', type: 'date' },
    { id: 'separation_date', label: 'Date of Separation', type: 'date' },
    { id: 'children_names', label: 'Names of Children', type: 'textarea' },
    { id: 'matrimonial_home', label: 'Matrimonial Home Address', type: 'text' },
    { id: 'annual_income', label: 'Your Annual Income', type: 'text' },
    { id: 'description', label: 'Issues to be Resolved', type: 'textarea', required: true },
  ],
  'SMALL_CLAIMS': [
    { id: 'plaintiff', label: 'Plaintiff (Your) Full Name', type: 'text', required: true },
    { id: 'applicant_address', label: 'Your Address', type: 'text', required: true },
    { id: 'defendant', label: 'Defendant Name', type: 'text', required: true },
    { id: 'respondent_address', label: 'Defendant Address', type: 'text' },
    { id: 'amount_claimed', label: 'Amount Claimed ($)', type: 'text', required: true },
    { id: 'claim_date', label: 'Date of Claim Arising', type: 'date' },
    { id: 'description', label: 'Details of Claim', type: 'textarea', required: true },
  ],
};

export function OfficialFormFiller({ form, caseId, prefilledData = {} }: OfficialFormFillerProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<PrefilledData>(prefilledData);
  const [filling, setFilling] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Determine form type from form_code
  const getFormType = () => {
    const code = form.form_code.toUpperCase();
    if (code.includes('T1') || code.includes('T2') || code.includes('T6') || code.includes('L1') || code.includes('LTB')) return 'LTB';
    if (code.includes('HRTO') || code.includes('FORM 1') || code.includes('F1')) return 'HRTO';
    if (code.includes('FLR') || code.includes('FAMILY')) return 'FAMILY';
    if (code.includes('7A') || code.includes('9A') || code.includes('10A') || code.includes('SCC')) return 'SMALL_CLAIMS';
    return 'default';
  };

  const formType = getFormType();
  const fields = FORM_FIELD_TEMPLATES[formType] || FORM_FIELD_TEMPLATES.default;

  const handleFieldChange = (fieldId: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleGeneratePdf = async () => {
    // Validate required fields
    const missingRequired = fields.filter(f => f.required && !formData[f.id]);
    if (missingRequired.length > 0) {
      toast.error(`Please fill in: ${missingRequired.map(f => f.label).join(', ')}`);
      return;
    }

    setFilling(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('fill-official-pdf', {
        body: {
          caseId,
          formCode: form.form_code,
          formData
        }
      });

      if (fnError) throw fnError;

      if (data.requiresPayment) {
        toast.error('Premium access required for PDF generation');
        window.location.href = '/pricing';
        return;
      }

      if (data.fallbackToCustom) {
        // If official PDF not available, just download the blank form
        if (form.pdf_url) {
          window.open(form.pdf_url, '_blank');
          toast.success('Official form downloaded - please fill manually');
        } else {
          toast.error('Form PDF not available');
        }
        return;
      }

      if (data.pdfUrl) {
        setGeneratedPdfUrl(data.pdfUrl);
        toast.success('PDF generated successfully!');
      }
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setError(err.message || 'Failed to generate PDF');
      toast.error('Failed to generate PDF');
    } finally {
      setFilling(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <FileText className="h-4 w-4" />
          Fill & Download PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Fill Official Form: {form.form_code}
          </DialogTitle>
          <DialogDescription>
            Fill in the fields below and we'll generate a pre-filled official Ontario court form from ontariocourtforms.on.ca
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          {generatedPdfUrl ? (
            <Card className="border-green-500 bg-green-50 dark:bg-green-900/20">
              <CardContent className="py-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">PDF Generated Successfully!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your pre-filled {form.form_code} form is ready for download.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => window.open(generatedPdfUrl, '_blank')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" onClick={() => setGeneratedPdfUrl(null)}>
                    Edit & Regenerate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 py-4">
              {error && (
                <Card className="border-destructive bg-destructive/10">
                  <CardContent className="py-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">{error}</span>
                  </CardContent>
                </Card>
              )}

              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{formType}</Badge>
                <span className="text-sm text-muted-foreground">Form fields for {form.title}</span>
              </div>

              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="flex items-center gap-1">
                    {field.label}
                    {field.required && <span className="text-destructive">*</span>}
                  </Label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.id}
                      value={String(formData[field.id] || '')}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      rows={3}
                    />
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type === 'date' ? 'date' : 'text'}
                      value={String(formData[field.id] || '')}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}

              <div className="pt-4 border-t flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGeneratePdf} disabled={filling}>
                  {filling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Official PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
