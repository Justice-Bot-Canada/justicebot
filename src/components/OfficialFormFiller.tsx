import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, FileText, Download, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast-stub';
import { getFormFields, getTribunalTypeFromFormCode, FormField } from '@/config/formFieldMappings';

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
  province?: string;
}

export function OfficialFormFiller({ form, caseId, prefilledData = {}, province = 'ON' }: OfficialFormFillerProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<PrefilledData>(prefilledData);
  const [filling, setFilling] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tribunalType = getTribunalTypeFromFormCode(form.form_code, province);
  const fields = getFormFields(province, tribunalType);

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
                <Badge variant="secondary">{tribunalType}</Badge>
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
