import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PremiumStatusProps {
  caseId?: string;
  formCode?: string;
  formData?: any;
}

export const PremiumStatus = ({ caseId, formCode, formData }: PremiumStatusProps) => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    checkPremiumStatus();
  }, [user]);

  const checkPremiumStatus = async () => {
    if (!user) return;

    try {
      const { data: entitlements } = await supabase
        .from('entitlements')
        .select('product_id')
        .eq('user_id', user.id);

      setIsPremium(entitlements && entitlements.length > 0);
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  const generatePDF = async () => {
    if (!user || !caseId || !formCode) {
      toast({
        title: "Missing Information",
        description: "Case and form information required for PDF generation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: {
          caseId,
          formCode,
          formData: formData || {}
        }
      });

      if (error) throw error;

      if (data?.requiresPayment) {
        toast({
          title: "Premium Feature",
          description: "PDF generation requires a premium subscription.",
          variant: "destructive",
        });
        return;
      }

      // Create and download the PDF
      const pdfContent = data.content;
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.fileName || 'legal_document.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "PDF Generated",
        description: "Your document has been downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Sign in to access premium features</p>
            <Button onClick={() => window.location.href = '/login'}>
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Premium Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <Badge variant={isPremium ? "default" : "secondary"}>
              {isPremium ? "Premium Active" : "Basic Plan"}
            </Badge>
          </div>
          {!isPremium && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/pricing'}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          )}
        </div>

        {isPremium && caseId && formCode && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Generate professional PDF documents for your legal forms
            </div>
            <Button 
              onClick={generatePDF}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                "Generating PDF..."
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF Document
                </>
              )}
            </Button>
          </div>
        )}

        {!isPremium && (
          <div className="text-sm text-muted-foreground">
            Upgrade to Premium for:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Professional PDF generation</li>
              <li>Smart form pre-filling</li>
              <li>Priority support</li>
              <li>Advanced case tracking</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};