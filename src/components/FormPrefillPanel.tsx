import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Sparkles, Download, ExternalLink, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast-stub';
import { useAuth } from '@/hooks/useAuth';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';

interface Form {
  id: string;
  form_code: string;
  title: string;
  description: string | null;
  tribunal_type: string;
  pdf_url: string | null;
  price_cents: number;
}

interface FormPrefillPanelProps {
  caseId: string;
  caseType: string;
  caseDescription: string;
}

export function FormPrefillPanel({ caseId, caseType, caseDescription }: FormPrefillPanelProps) {
  const { user } = useAuth();
  const { hasAccess } = usePremiumAccess();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [prefillingFormId, setPrefillingFormId] = useState<string | null>(null);
  const [prefilledData, setPrefilledData] = useState<Record<string, any>>({});
  const [purchasedFormIds, setPurchasedFormIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFormsForCaseType();
    if (user) {
      loadPurchasedForms();
    }
  }, [caseType, user]);

  const loadFormsForCaseType = async () => {
    try {
      setLoading(true);
      
      // Map case type to tribunal type for filtering
      const tribunalMapping: Record<string, string[]> = {
        'HRTO': ['HRTO', 'Human Rights'],
        'LTB': ['LTB', 'Landlord Tenant'],
        'SMALL_CLAIMS': ['Small Claims', 'Small Claims Court'],
        'FAMILY': ['Family', 'Family Court'],
        'SUPERIOR': ['Superior Court', 'Civil'],
        'CRIMINAL': ['Criminal', 'Ontario Court'],
        'LABOUR': ['Labour', 'OLRB'],
      };

      const tribunalTypes = tribunalMapping[caseType] || [caseType];

      const { data, error } = await supabase
        .from('forms')
        .select('id, form_code, title, description, tribunal_type, pdf_url, price_cents')
        .eq('is_active', true)
        .or(tribunalTypes.map(t => `tribunal_type.ilike.%${t}%`).join(','));

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error('Error loading forms:', error);
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const loadPurchasedForms = async () => {
    if (!user) return;

    try {
      const { data: entitlements } = await supabase
        .from('entitlements')
        .select('product_id')
        .eq('user_id', user.id);

      const formIds = new Set(
        entitlements
          ?.map(e => e.product_id)
          .filter(pid => pid?.startsWith('form_'))
          .map(pid => pid.replace('form_', '')) || []
      );

      setPurchasedFormIds(formIds);
    } catch (error) {
      console.error('Error loading purchased forms:', error);
    }
  };

  const handlePrefillForm = async (form: Form) => {
    if (!caseDescription || caseDescription.length < 10) {
      toast.error('Please add a case description first');
      return;
    }

    setPrefillingFormId(form.id);

    try {
      // Fetch evidence for this case to include in prefill
      const { data: evidence } = await supabase
        .from('evidence')
        .select('file_name, description, ocr_text')
        .eq('case_id', caseId)
        .limit(10);

      const evidenceText = evidence?.map(e => 
        `Document: ${e.file_name}\nDescription: ${e.description || 'N/A'}\nContent: ${e.ocr_text || 'N/A'}`
      ).join('\n\n') || '';

      // Get user profile for prefilling personal info
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, phone')
        .eq('id', user?.id)
        .single();

      // Define form fields based on form type (simplified - in production would come from DB)
      const formFields = [
        { id: 'applicant_name', label: 'Applicant Name', type: 'text' },
        { id: 'respondent_name', label: 'Respondent Name', type: 'text' },
        { id: 'incident_date', label: 'Date of Incident', type: 'date' },
        { id: 'description', label: 'Description of Events', type: 'textarea' },
        { id: 'address', label: 'Address', type: 'text' },
        { id: 'phone', label: 'Phone', type: 'text' },
        { id: 'email', label: 'Email', type: 'email' },
        { id: 'remedy_sought', label: 'Remedy Sought', type: 'textarea' },
      ];

      const triageData = `
Case Type: ${caseType}
Case Description: ${caseDescription}

Evidence Documents:
${evidenceText}
      `.trim();

      const { data, error } = await supabase.functions.invoke('prefill-form', {
        body: {
          triageData,
          formFields,
          userProfile: profile
        }
      });

      if (error) throw error;

      if (data?.prefilled_data) {
        setPrefilledData(prev => ({
          ...prev,
          [form.id]: data.prefilled_data
        }));
        toast.success(`Form ${form.form_code} pre-filled with your case data`);
      }
    } catch (error: any) {
      console.error('Error prefilling form:', error);
      toast.error(error.message || 'Failed to prefill form');
    } finally {
      setPrefillingFormId(null);
    }
  };

  const handleDownload = (form: Form) => {
    if (form.pdf_url) {
      window.open(form.pdf_url, '_blank');
      toast.success('Form download started');
    } else {
      toast.error('Download URL not available');
    }
  };

  const canAccessForm = (form: Form) => {
    if (hasAccess) return true;
    if (purchasedFormIds.has(form.id)) return true;
    if (form.price_cents === 0) return true;
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No forms found for {caseType}</p>
          <p className="text-sm mt-1">Check that your case type is correctly set</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Form Pre-Fill
          </CardTitle>
          <CardDescription>
            AI will analyze your case and evidence to pre-fill form fields automatically
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {forms.map((form) => {
          const hasPrefilledData = !!prefilledData[form.id];
          const isPrefilling = prefillingFormId === form.id;
          const hasFormAccess = canAccessForm(form);

          return (
            <Card key={form.id} className={hasPrefilledData ? 'border-green-500/50 bg-green-500/5' : ''}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{form.form_code}</Badge>
                      {hasPrefilledData && (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Pre-filled
                        </Badge>
                      )}
                      {!hasFormAccess && (
                        <Badge variant="outline">${(form.price_cents / 100).toFixed(2)}</Badge>
                      )}
                    </div>
                    <h4 className="font-medium">{form.title}</h4>
                    {form.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {form.description}
                      </p>
                    )}
                    
                    {hasPrefilledData && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-xs font-medium mb-2">Pre-filled Fields:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(prefilledData[form.id]).slice(0, 6).map(([key, value]) => (
                            <div key={key} className="truncate">
                              <span className="text-muted-foreground">{key}:</span>{' '}
                              <span className="font-medium">{String(value).substring(0, 30)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant={hasPrefilledData ? 'outline' : 'default'}
                      onClick={() => handlePrefillForm(form)}
                      disabled={isPrefilling}
                    >
                      {isPrefilling ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-1" />
                          {hasPrefilledData ? 'Re-fill' : 'Pre-fill with AI'}
                        </>
                      )}
                    </Button>

                    {hasFormAccess && form.pdf_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(form)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}

                    {!hasFormAccess && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.href = '/pricing'}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Unlock
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}