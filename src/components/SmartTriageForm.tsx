import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  Upload, 
  FileText, 
  X,
  Loader2,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle,
  Building2,
  Users,
  DollarSign,
  Heart,
  Scale,
  Briefcase,
  Shield,
  Gavel
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast-stub";
import { analytics, trackEvent } from "@/utils/analytics";
import { TurnstileWidget } from "@/components/TurnstileWidget";

interface FormRecommendation {
  formCode: string;
  formTitle: string;
  confidence: number;
  reason: string;
  tribunalType: string;
  priority: 'primary' | 'secondary' | 'optional';
}

interface TriageResult {
  venue: string;
  venueTitle: string;
  confidence: number;
  reasoning: string;
  urgentDeadlines: string[];
  recommendedForms: FormRecommendation[];
  nextSteps: string[];
  followUpQuestions?: string[];
  flags: string[];
  alternativeVenues?: { venue: string; reason: string }[];
}

interface SmartTriageFormProps {
  onTriageComplete: (result: TriageResult, description: string, province: string, evidenceCount?: number) => void;
  initialDescription?: string;
}

const venueIcons: Record<string, React.ElementType> = {
  ltb: Building2,
  hrto: Users,
  "small-claims": DollarSign,
  family: Heart,
  criminal: Gavel,
  labour: Briefcase,
  wsib: Shield,
  "superior-court": Scale,
  divisional: Scale,
};

const venueColors: Record<string, string> = {
  ltb: "bg-blue-50 text-blue-700 border-blue-200",
  hrto: "bg-purple-50 text-purple-700 border-purple-200",
  "small-claims": "bg-green-50 text-green-700 border-green-200",
  family: "bg-rose-50 text-rose-700 border-rose-200",
  criminal: "bg-red-50 text-red-700 border-red-200",
  labour: "bg-amber-50 text-amber-700 border-amber-200",
  wsib: "bg-orange-50 text-orange-700 border-orange-200",
  "superior-court": "bg-indigo-50 text-indigo-700 border-indigo-200",
  divisional: "bg-slate-50 text-slate-700 border-slate-200",
};

const SmartTriageForm: React.FC<SmartTriageFormProps> = ({ 
  onTriageComplete,
  initialDescription = ""
}) => {
  const [description, setDescription] = useState(initialDescription);
  const [province, setProvince] = useState("Ontario");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [evidenceDescriptions, setEvidenceDescriptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [turnstileError, setTurnstileError] = useState(false);

  // Suggested prompts based on common issues
  const suggestedPrompts = [
    "My landlord hasn't fixed the heating for 3 weeks",
    "I was fired after complaining about discrimination",
    "Someone owes me $5,000 and won't pay",
    "I need to file for divorce",
    "My employer isn't paying overtime",
    "CAS has contacted me about my children",
  ];

  const handleDropAccepted = useCallback((acceptedFiles: File[]) => {
    const remainingSlots = Math.max(0, 5 - uploadedFiles.length);
    const newFiles = acceptedFiles.slice(0, remainingSlots);

    if (newFiles.length === 0) {
      toast.error("No files were added (limit reached or file not accepted)");
      return;
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const fileType = file.type.includes("image")
        ? "Image"
        : file.type.includes("pdf")
          ? "PDF Document"
          : "Document";
      setEvidenceDescriptions((prev) => [...prev, `${fileType}: ${file.name}`]);
    });

    toast.success(`${newFiles.length} file(s) added`);
  }, [uploadedFiles.length]);

  const handleDropRejected = useCallback((rejections: any[]) => {
    if (!rejections?.length) {
      toast.error("File was not accepted");
      return;
    }

    const first = rejections[0];
    const fileName = first?.file?.name || "File";
    const errors = (first?.errors || []) as Array<{ code?: string; message?: string }>;

    const msg = errors
      .map((e) => {
        if (e.code === "file-too-large") return `${fileName} is too large (max 10MB)`;
        if (e.code === "file-invalid-type") return `${fileName} is not a supported file type`;
        if (e.code === "too-many-files") return "Too many files (max 5)";
        return e.message || "File rejected";
      })
      .join(", ");

    toast.error(msg);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: handleDropAccepted,
    onDropRejected: handleDropRejected,
    onFileDialogCancel: () => toast.error("File selection cancelled"),
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".bmp", ".tiff"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
      "text/rtf": [".rtf"],
      "application/rtf": [".rtf"],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setEvidenceDescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!description.trim() || description.length < 20) {
      toast.error("Please provide more detail about your legal issue (at least 20 characters)");
      return;
    }

    if (requiresVerification && !turnstileToken) {
      toast.error("Please complete the verification to continue");
      return;
    }

    // Track triage started - GA4 event (fires once)
    analytics.triageStartedGA4(province);
    analytics.triageStarted(province);
    analytics.triageStart();
    trackEvent("triage_submit", { province, description_length: description.length });

    setLoading(true);
    setAnalyzing(true);
    setProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 300);

    try {
      const { data, error } = await supabase.functions.invoke("smart-triage", {
        body: {
          description,
          province,
          evidenceDescriptions: evidenceDescriptions.length > 0 ? evidenceDescriptions : undefined,
          turnstileToken: turnstileToken || undefined,
        },
      });

      if (error) throw error;

      setProgress(100);

      // Small delay to show 100% progress
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Fire GA4 triage_completed event
      analytics.triageCompletedGA4(data?.venue || 'unknown', province, data?.merit_score);
      
      onTriageComplete(data, description, province, uploadedFiles.length);
      toast.success("Analysis complete!");
    } catch (error: any) {
      console.error("Triage error:", error);

      const msg = String(error?.message || "");
      const status = error?.status || error?.context?.status;

      if (status === 403 || msg.includes("Verification required")) {
        setRequiresVerification(true);
        setTurnstileToken(null);
        toast.error("Please complete the verification and try again.");
        return;
      }

      toast.error("Failed to analyze your case. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
      setAnalyzing(false);
      setProgress(0);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setDescription(prompt);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Smart Legal Triage
          </CardTitle>
          <CardDescription>
            Describe your situation in detail. Our AI will analyze your case and recommend the right legal pathway and forms.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description">What's happening? *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your legal issue in detail. Include dates, people involved, what happened, and what you're hoping to achieve..."
              className="min-h-40 resize-y"
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>The more detail you provide, the better our recommendations</span>
              <span>{description.length} characters</span>
            </div>
          </div>

          {/* Suggested Prompts */}
          {description.length < 20 && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Common issues (click to use):</Label>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="text-xs"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Province Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province">Province/Territory</Label>
              <select
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background"
                disabled={loading}
              >
                <option value="Ontario">Ontario</option>
                <option value="British Columbia">British Columbia</option>
                <option value="Alberta">Alberta</option>
                <option value="Quebec">Quebec</option>
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
          </div>

          {/* Evidence Upload */}
          <div className="space-y-2">
            <Label>Supporting Evidence (Optional)</Label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} disabled={loading} />
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {isDragActive ? "Drop files here..." : "Drag & drop evidence files, or click to select"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Images, PDFs, Word docs (max 5 files, 10MB each)
              </p>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 mt-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Analysis Progress */}
          {analyzing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Analyzing your case...</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {progress < 30 && "Reading your description..."}
                {progress >= 30 && progress < 60 && "Identifying legal issues..."}
                {progress >= 60 && progress < 90 && "Matching to appropriate venues and forms..."}
                {progress >= 90 && "Finalizing recommendations..."}
              </p>
            </div>
          )}

          {/* Verification (only shown if required by backend) */}
          {requiresVerification && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Please verify you’re human to continue.
              </div>
              {!turnstileError ? (
                <TurnstileWidget
                  onSuccess={(token) => {
                    setTurnstileToken(token);
                    toast.success("Verification complete");
                  }}
                  onError={() => {
                    setTurnstileError(true);
                    toast.error("Verification failed. Please refresh and try again.");
                  }}
                />
              ) : (
                <div className="text-sm text-destructive">
                  Verification unavailable right now.
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              description.trim().length < 20 ||
              (requiresVerification && !turnstileToken) ||
              (requiresVerification && turnstileError)
            }
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze My Case & Recommend Forms
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-4 flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Time-Sensitive</h4>
              <p className="text-xs text-muted-foreground">We'll flag urgent deadlines you need to know about</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Form Matching</h4>
              <p className="text-xs text-muted-foreground">Get specific forms recommended for your situation</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Multiple Options</h4>
              <p className="text-xs text-muted-foreground">We'll show alternative venues if applicable</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartTriageForm;
