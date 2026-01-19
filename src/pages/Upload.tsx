import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Upload as UploadIcon, FileText, ArrowRight, Loader2, CheckCircle, Shield, AlertTriangle, Sparkles, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import { MeritScoreBadge, getMeritBand, getMeritColor } from "@/components/MeritScoreBadge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { analytics, trackEvent } from "@/utils/analytics";
import { useAuth } from "@/hooks/useAuth";

/**
 * Upload - Linear Funnel Entry Point (P0)
 * 
 * Single flow: Upload document → Get explanation (free) → Generate form ($5.99)
 * NO alternate CTAs, NO parallel paths
 */

interface AnalysisResult {
  venue: string;
  venueTitle: string;
  explanation: string;
  nextSteps: string[];
  recommendedForm: string;
  meritSignal: 'strong' | 'moderate' | 'needs-review';
  meritScore: number; // 0-100 numeric score
  urgentDeadlines: string[];
}

const FORM_PRICE_ID = 'price_1SYLdJL0pLShFbLttpxYfuas'; // $5.99 form generation

const Upload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string>('');
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Track funnel entry
  useEffect(() => {
    analytics.funnelStart('/upload');
    trackEvent('upload_page_view', { source: 'funnel_entry' });
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setAnalysisResult(null);
      setShowPaymentStep(false);
      trackEvent('document_selected', { 
        fileType: selectedFile.type, 
        fileSize: Math.round(selectedFile.size / 1024) 
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 1,
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0]?.message || 'File rejected';
      toast.error(error);
    }
  });

  const analyzeDocument = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      // Step 1: Read file content
      const reader = new FileReader();
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
      });

      setUploadProgress(30);
      setAnalyzing(true);

      // Step 2: Call AI triage to analyze document
      const { data: triageData, error: triageError } = await supabase.functions.invoke('smart-triage', {
        body: {
          description: `Please analyze this uploaded document and determine the legal pathway:\n\nFile: ${file.name}\nType: ${file.type}\n\nContent preview: ${fileContent.substring(0, 10000)}`,
          province: 'Ontario',
          documents: [{
            name: file.name,
            type: file.type,
            size: file.size
          }]
        }
      });

      setUploadProgress(70);

      if (triageError) {
        console.error('Triage error:', triageError);
        throw new Error('Failed to analyze document');
      }

      // Calculate numeric merit score from confidence
      const confidence = triageData?.confidence || 50;
      const meritScore = typeof confidence === 'number' ? Math.round(confidence) : 50;
      const meritSignal = meritScore >= 70 ? 'strong' : meritScore >= 40 ? 'moderate' : 'needs-review';

      // Process result
      const result: AnalysisResult = {
        venue: triageData?.venue || 'general',
        venueTitle: triageData?.venueTitle || 'Legal Document',
        explanation: triageData?.reasoning || 'Your document has been reviewed.',
        nextSteps: triageData?.nextSteps || ['Review the explanation', 'Generate your response form'],
        recommendedForm: triageData?.recommendedForms?.[0]?.formCode || 'general-response',
        meritSignal: meritSignal as 'strong' | 'moderate' | 'needs-review',
        meritScore: meritScore,
        urgentDeadlines: triageData?.urgentDeadlines || []
      };

      setAnalysisResult(result);
      setUploadProgress(100);
      
      // Track successful analysis - this is "view product"
      analytics.viewItem('form_generation', 'Legal Form Generation', 5.99);
      trackEvent('document_analyzed', {
        venue: result.venue,
        meritSignal: result.meritSignal,
        hasDeadlines: result.urgentDeadlines.length > 0
      });

      toast.success("Document analyzed! See your explanation below.");

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze document. Please try again.');
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const handleGenerateForm = async () => {
    // Fire view_item when they see the payment option (product view)
    analytics.viewItem('form_generation', 'Legal Form Generation', 5.99);
    
    if (!user) {
      // Save intent and redirect to auth
      sessionStorage.setItem('upload_intent', JSON.stringify({
        fileName: file?.name,
        analysisResult
      }));
      navigate('/welcome?redirect=/upload&intent=generate');
      return;
    }

    setShowPaymentStep(true);
    
    // Fire add_to_cart
    analytics.addToCart('form_generation', 'Legal Form Generation', 5.99);
    trackEvent('form_generation_clicked', { venue: analysisResult?.venue });
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please sign in to continue');
      return;
    }

    setProcessingPayment(true);
    
    // Fire begin_checkout
    analytics.beginCheckout('form_generation', 'Legal Form Generation', 5.99);
    trackEvent('checkout_started', { 
      product: 'form_generation',
      price: 5.99,
      venue: analysisResult?.venue 
    });

    try {
      const { data, error } = await supabase.functions.invoke('create_checkout', {
        body: {
          priceId: FORM_PRICE_ID,
          mode: 'payment',
          successUrl: `${window.location.origin}/documents-unlocked?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/upload`,
          metadata: {
            product: 'form_generation',
            venue: analysisResult?.venue || 'general',
            fileName: file?.name
          }
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Unable to start payment. Please try again.');
      setProcessingPayment(false);
    }
  };

  const getMeritBadge = (signal: string) => {
    switch (signal) {
      case 'strong':
        return <Badge className="bg-green-100 text-green-800">Strong Case Potential</Badge>;
      case 'moderate':
        return <Badge className="bg-yellow-100 text-yellow-800">Moderate - Worth Pursuing</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Needs Review</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EnhancedSEO
        title="Upload Your Legal Document | Justice-Bot"
        description="Upload your legal document and get a plain-language explanation in minutes. Eviction notices, court forms, legal letters - we explain what it means and what to do next."
        keywords="upload legal document, explain legal notice, eviction notice help, legal document scanner"
        canonicalUrl="https://www.justice-bot.com/upload"
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`flex items-center gap-2 ${!analysisResult ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${!analysisResult ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>1</div>
            <span className="text-sm font-medium hidden sm:inline">Upload</span>
          </div>
          <div className="w-8 h-px bg-muted-foreground/30" />
          <div className={`flex items-center gap-2 ${analysisResult && !showPaymentStep ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${analysisResult && !showPaymentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>2</div>
            <span className="text-sm font-medium hidden sm:inline">Explanation</span>
          </div>
          <div className="w-8 h-px bg-muted-foreground/30" />
          <div className={`flex items-center gap-2 ${showPaymentStep ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${showPaymentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>3</div>
            <span className="text-sm font-medium hidden sm:inline">Generate Form</span>
          </div>
        </div>

        {/* Step 1: Upload */}
        {!analysisResult && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Upload Your Legal Document</CardTitle>
              <CardDescription>
                We'll explain what it means in plain language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <UploadIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-lg">Drop your document here...</p>
                ) : (
                  <>
                    <p className="text-lg mb-2">Drag & drop your document here</p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      PDF, JPG, PNG, DOC, DOCX • Up to 100MB
                    </p>
                  </>
                )}
              </div>

              {file && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                      Remove
                    </Button>
                  </div>

                  {uploading && (
                    <Progress value={uploadProgress} className="h-2" />
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={analyzeDocument}
                    disabled={uploading || analyzing}
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        Get My Explanation
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-4 border-t">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Secure & encrypted
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Free explanation
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Explanation (FREE) */}
        {analysisResult && !showPaymentStep && (
          <div className="space-y-6">
            {/* PROMINENT MERIT SCORE - Decision Anchor */}
            <MeritScoreBadge 
              score={analysisResult.meritScore} 
              showExplanation={true}
              compact={false}
            />

            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Document Analyzed
                  </CardTitle>
                </div>
                <CardDescription>
                  Here's what your document means in plain language
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Urgent deadlines */}
                {analysisResult.urgentDeadlines.length > 0 && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription>
                      <strong>Important Deadline:</strong> {analysisResult.urgentDeadlines[0]}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Venue identification */}
                <div className="p-4 bg-background rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">This document relates to:</p>
                  <p className="text-lg font-semibold">{analysisResult.venueTitle}</p>
                </div>

                {/* Plain language explanation */}
                <div className="p-4 bg-background rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-2">What this means:</p>
                  <p className="text-sm leading-relaxed">{analysisResult.explanation}</p>
                </div>

                {/* Next steps preview */}
                <div className="p-4 bg-background rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-2">Recommended next steps:</p>
                  <ul className="space-y-2">
                    {analysisResult.nextSteps.slice(0, 3).map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* CTA to generate form */}
            <Card className="border-primary">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-shrink-0">
                    <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-lg mb-1">Ready to respond?</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate your pre-filled legal form based on this document
                    </p>
                  </div>
                  <Button size="lg" onClick={handleGenerateForm} className="w-full sm:w-auto">
                    Generate My Form — $5.99
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button variant="ghost" onClick={() => setAnalysisResult(null)} className="w-full">
              ← Upload a different document
            </Button>
          </div>
        )}

        {/* Step 3: Payment */}
        {showPaymentStep && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Generate Your Legal Form</CardTitle>
              <CardDescription>
                One-time payment • Instant access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-4">
                <p className="text-4xl font-bold">$5.99</p>
                <p className="text-sm text-muted-foreground">One-time payment</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Pre-filled legal form based on your document</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Correct tribunal/court form selected for you</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Step-by-step filing instructions</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Instant PDF download</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handlePayment}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay $5.99 & Generate'
                )}
              </Button>

              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Secure payment via Stripe
                </span>
              </div>

              <Button variant="ghost" onClick={() => setShowPaymentStep(false)} className="w-full">
                ← Back to explanation
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Upload;
