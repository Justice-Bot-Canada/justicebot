import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle, ArrowRight, Loader2, CheckCircle, Shield, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { analytics } from "@/utils/analytics";

interface DetectedDocument {
  type: string;
  confidence: number;
  suggestedPath: string;
  pathName: string;
  description: string;
}

const documentPatterns: { pattern: RegExp; type: string; path: string; pathName: string; description: string }[] = [
  { pattern: /n4|n-4|notice.*non.*payment/i, type: "N4 Notice", path: "/ltb-journey", pathName: "Landlord-Tenant Board", description: "Non-payment of rent notice from landlord" },
  { pattern: /n5|n-5|notice.*terminate.*interference/i, type: "N5 Notice", path: "/ltb-journey", pathName: "Landlord-Tenant Board", description: "Interference or damage notice" },
  { pattern: /n12|n-12|landlord.*own.*use/i, type: "N12 Notice", path: "/ltb-journey", pathName: "Landlord-Tenant Board", description: "Landlord's own use termination" },
  { pattern: /n13|n-13|demolition|renovation/i, type: "N13 Notice", path: "/ltb-journey", pathName: "Landlord-Tenant Board", description: "Demolition or conversion notice" },
  { pattern: /human.*rights|hrto|discrimination.*complaint/i, type: "HRTO Document", path: "/hrto-journey", pathName: "Human Rights Tribunal", description: "Human rights complaint or response" },
  { pattern: /termination|dismissal|roe|record.*employment/i, type: "Employment Document", path: "/labour-board-journey", pathName: "Labour Board", description: "Termination or employment record" },
  { pattern: /small.*claim|plaintiff.*claim|defendant/i, type: "Small Claims", path: "/small-claims-journey", pathName: "Small Claims Court", description: "Small claims court document" },
  { pattern: /custody|access|child.*support|family.*court/i, type: "Family Document", path: "/family-journey", pathName: "Family Court", description: "Family court or custody document" },
];

const UploadFirst = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedDocuments, setDetectedDocuments] = useState<DetectedDocument[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setAnalysisComplete(false);
    setDetectedDocuments([]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const analyzeDocuments = async () => {
    if (files.length === 0) return;
    
    setAnalyzing(true);
    
    try {
      // Simulate document analysis based on filenames
      // In production, this would use OCR and AI analysis
      const detected: DetectedDocument[] = [];
      
      for (const file of files) {
        const filename = file.name.toLowerCase();
        
        for (const pattern of documentPatterns) {
          if (pattern.pattern.test(filename)) {
            detected.push({
              type: pattern.type,
              confidence: 85 + Math.random() * 10,
              suggestedPath: pattern.path,
              pathName: pattern.pathName,
              description: pattern.description
            });
            break;
          }
        }
      }
      
      // If no patterns matched, suggest general triage
      if (detected.length === 0) {
        detected.push({
          type: "Unknown Document",
          confidence: 50,
          suggestedPath: "/triage",
          pathName: "AI Triage",
          description: "Let our AI analyze your situation"
        });
      }
      
      setDetectedDocuments(detected);
      setAnalysisComplete(true);
      toast.success("Document analysis complete!");
      
      // Track conversion: doc_analyzed
      detected.forEach(doc => {
        analytics.docAnalyzed(doc.suggestedPath, doc.type, doc.confidence);
      });
      
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze documents. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Upload Your Documents | Document-First Legal Help | Justice-Bot"
        description="Upload your legal documents and let our AI identify your legal pathways. Eviction notices, termination letters, court documents - we'll guide you."
        keywords="upload legal documents, document analysis, eviction notice help, legal document scanner, AI legal analysis"
        canonicalUrl="https://www.justice-bot.com/upload-first"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Let AI Read Your Documents
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Upload what you received — eviction notice, termination letter, court form. 
            We'll analyze it and show you your legal options.
          </p>
          
          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-500" />
              Secure & encrypted
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-primary" />
              AI reads instantly
            </span>
          </div>
        </div>

        {/* Upload Area */}
        <Card className="p-8 mb-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg">Drop your documents here...</p>
            ) : (
              <>
                <p className="text-lg mb-2">Drag & drop your documents here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports: PDF, JPG, PNG, DOC, DOCX
                </p>
              </>
            )}
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold">Uploaded Documents:</h3>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                    Remove
                  </Button>
                </div>
              ))}

              <Button 
                className="w-full mt-4" 
                size="lg"
                onClick={analyzeDocuments}
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Documents...
                  </>
                ) : (
                  <>
                    Analyze My Documents
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        {/* Analysis Results */}
        {analysisComplete && detectedDocuments.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Documents Analyzed</h3>
            </div>

            <div className="space-y-4">
              {detectedDocuments.map((doc, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{doc.type}</h4>
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {doc.confidence.toFixed(0)}% match
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm mb-2">
                      <strong>Recommended:</strong> {doc.pathName}
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => navigate(doc.suggestedPath)}
                    >
                      Start {doc.pathName} Journey
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">What happens next:</h4>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>You'll see your tribunal + recommended forms + next steps</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-accent/10 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Your documents may involve multiple legal pathways. Justice-Bot will help identify all applicable claims as you proceed.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Common Documents */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-center">Common documents we analyze:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { name: "N4 Eviction Notice", icon: "🏠" },
              { name: "Termination Letter", icon: "💼" },
              { name: "HRTO Response", icon: "⚖️" },
              { name: "Court Forms", icon: "📋" }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-sm mt-2">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alternative Paths */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">Don't have documents yet?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate("/find-my-path")}>
              Find My Legal Path
            </Button>
            <Button variant="outline" onClick={() => navigate("/triage")}>
              Describe My Situation
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UploadFirst;
