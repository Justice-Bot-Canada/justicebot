import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, CreditCard, Users, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PremiumStatusProps {
  caseId?: string;
  formCode?: string;
  formData?: any;
}

export const PremiumStatus = ({ caseId, formCode, formData }: PremiumStatusProps) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isFreeUser, setIsFreeUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    checkUserStatus();
  }, [user]);

  const checkUserStatus = async () => {
    if (!user) return;

    try {
      // Check premium entitlements
      const { data: entitlements } = await supabase
        .from('entitlements')
        .select('product_id')
        .eq('user_id', user.id);

      setIsPremium(entitlements && entitlements.length > 0);

      // Check free tier eligibility
      const { data: freeEligible, error } = await supabase.rpc('check_free_tier_eligibility');
      if (error) throw error;
      setIsFreeUser(freeEligible === true);
    } catch (error) {
      console.error('Error checking user status:', error);
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
          description: "PDF generation requires a premium subscription or free tier access.",
          variant: "destructive",
        });
        return;
      }

      // Enhanced PDF download with proper file handling
      if (data?.content) {
        const pdfContent = data.content;
        const fileName = data.fileName || `${formCode}_${new Date().toISOString().split('T')[0]}.pdf`;
        
        // Create a more robust blob for PDF content
        const blob = new Blob([pdfContent], { 
          type: data.mimeType || 'application/pdf' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Professional PDF Generated",
          description: `Your ${formCode} form has been downloaded as ${fileName}`,
        });
      } else {
        throw new Error('No PDF content received');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed", 
        description: error.message || "Unable to generate PDF. Please try again.",
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
            <Gift className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Free Access Available!</h3>
            <p className="text-muted-foreground mb-4">
              Sign up now and get FREE access - limited to first 1000 users
            </p>
            <Button onClick={() => window.location.href = '/auth'} className="bg-green-600 hover:bg-green-700 min-h-[44px]" aria-label="Sign up for free access">
              <Users className="w-4 h-4 mr-2" aria-hidden="true" />
              Sign Up for FREE
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasAccess = isPremium || isFreeUser;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Your Plan Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <Badge 
              variant={hasAccess ? "default" : "secondary"}
              className={hasAccess ? (isFreeUser ? "bg-green-600" : "bg-blue-600") : ""}
            >
              {isFreeUser ? "🎉 FREE User" : isPremium ? "Premium Active" : "Basic Plan"}
            </Badge>
          </div>
          {!hasAccess && (
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

        {isFreeUser && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Gift className="w-4 h-4" />
              <span className="font-semibold">Congratulations!</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              You're one of our first 1000 users and have FREE access to all premium features!
            </p>
          </div>
        )}

        {hasAccess && caseId && formCode && (
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
                  Generate Professional PDF
                </>
              )}
            </Button>
          </div>
        )}

        {!hasAccess && (
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Upgrade to get access to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Professional PDF generation</li>
              <li>Smart form pre-filling</li>
              <li>Priority support</li>
              <li>Advanced case tracking</li>
            </ul>
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-700 dark:text-blue-300 text-xs">
              💡 Starting at just $9.99/month or $2.99/month for low-income applicants
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};