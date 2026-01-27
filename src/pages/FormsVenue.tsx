import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, ArrowLeft, ExternalLink, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface FormRecord {
  id: string;
  form_code: string;
  title: string;
  description: string | null;
  tribunal_type: string;
  category: string;
  pdf_url: string | null;
  price_cents: number;
  is_active: boolean;
}

const venueDisplayNames: Record<string, string> = {
  'LTB': 'Landlord and Tenant Board',
  'HRTO': 'Human Rights Tribunal of Ontario',
  'SMALL_CLAIMS': 'Small Claims Court',
  'FAMILY': 'Family Court',
  'SUPERIOR': 'Superior Court of Justice',
  'CRIMINAL': 'Criminal Court',
};

const FormsVenue = () => {
  const { venue } = useParams<{ venue: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState<FormRecord[]>([]);
  const venueCode = venue?.toUpperCase() || '';
  const venueDisplayName = venueDisplayNames[venueCode] || venueCode;

  useEffect(() => {
    loadForms();
  }, [venueCode]);

  const loadForms = async () => {
    setLoading(true);
    try {
      // Query form_templates if it exists, otherwise fall back to forms table
      const { data: templates, error: templatesError } = await supabase
        .from('form_templates')
        .select(`
          id,
          enabled,
          form_source:form_sources(
            form_code,
            name,
            venue_code,
            jurisdiction,
            official_pdf_url
          )
        `)
        .eq('enabled', true);

      if (!templatesError && templates && templates.length > 0) {
        // Filter by venue_code
        const venueTemplates = templates.filter((t: any) => 
          t.form_source?.venue_code?.toUpperCase() === venueCode
        );
        
        setForms(venueTemplates.map((t: any) => ({
          id: t.id,
          form_code: t.form_source?.form_code || 'Unknown',
          title: t.form_source?.name || 'Untitled Form',
          description: null,
          tribunal_type: venueCode,
          category: t.form_source?.jurisdiction || 'Ontario',
          pdf_url: t.form_source?.official_pdf_url,
          price_cents: 0,
          is_active: t.enabled,
        })));
      } else {
        // Fall back to forms table
        const { data: formsData, error: formsError } = await supabase
          .from('forms')
          .select('*')
          .eq('is_active', true)
          .ilike('tribunal_type', `%${venueCode}%`);

        if (formsError) throw formsError;
        setForms(formsData || []);
      }
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectForm = (formCode: string) => {
    navigate(`/generate?venue=${venueCode}&form=${formCode}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{venueDisplayName} Forms | Justice-Bot</title>
        <meta name="description" content={`Access official ${venueDisplayName} forms. Generate pre-filled legal forms for your case.`} />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/forms')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{venueDisplayName} Forms</h1>
            <p className="text-muted-foreground">Select a form to generate for your case</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : forms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Forms Available</h3>
              <p className="text-muted-foreground mb-6">
                No forms are currently configured for {venueDisplayName}.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => navigate('/forms')}>
                  Browse All Venues
                </Button>
                <Button asChild>
                  <Link to="/admin/forms">Manage Forms (Admin)</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{form.form_code}</CardTitle>
                        <CardDescription className="mt-1">{form.title}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{form.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {form.description && (
                    <p className="text-sm text-muted-foreground mb-4">{form.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {form.price_cents > 0 ? (
                        <Badge variant="secondary">${(form.price_cents / 100).toFixed(2)}</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600">Free</Badge>
                      )}
                      {form.pdf_url && (
                        <a 
                          href={form.pdf_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Official PDF
                        </a>
                      )}
                    </div>
                    <Button onClick={() => handleSelectForm(form.form_code)}>
                      Select Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default FormsVenue;
