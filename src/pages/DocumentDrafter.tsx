import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Copy } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DocumentDrafter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documentType, setDocumentType] = useState("");
  const [caseDetails, setCaseDetails] = useState("");
  const [recipientInfo, setRecipientInfo] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [draftedDocument, setDraftedDocument] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDraft = async () => {
    if (!user) {
      navigate("/");
      return;
    }

    if (!documentType || !caseDetails) {
      toast({
        title: "Missing Information",
        description: "Please select document type and provide case details",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("draft-legal-document", {
        body: {
          documentType,
          caseDetails,
          recipientInfo,
          additionalDetails,
        },
      });

      if (error) throw error;

      setDraftedDocument(data.document);
      toast({
        title: "Success",
        description: "Document drafted successfully",
      });
    } catch (error: any) {
      console.error("Error drafting document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to draft document",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draftedDocument);
    toast({
      title: "Copied",
      description: "Document copied to clipboard",
    });
  };

  const downloadDocument = () => {
    const blob = new Blob([draftedDocument], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${documentType}-draft.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SEOHead
        title="AI Document Drafter - Justice Bot"
        description="Use AI to draft legal documents including demand letters, affidavits, notices of application, and more."
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Document Drafter</h1>
          <p className="text-muted-foreground">
            Generate professional legal documents with AI assistance
          </p>
        </div>

        <Alert className="mb-6">
          <AlertDescription>
            <strong>Beta Feature:</strong> AI-generated documents are templates and require review by a legal professional.
            This is not legal advice.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Document Details</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="documentType">Document Type *</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demand-letter">Demand Letter</SelectItem>
                    <SelectItem value="affidavit">Affidavit</SelectItem>
                    <SelectItem value="notice-application">Notice of Application</SelectItem>
                    <SelectItem value="statement-claim">Statement of Claim</SelectItem>
                    <SelectItem value="response">Response to Legal Document</SelectItem>
                    <SelectItem value="settlement-offer">Settlement Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="caseDetails">Case Details *</Label>
                <Textarea
                  id="caseDetails"
                  value={caseDetails}
                  onChange={(e) => setCaseDetails(e.target.value)}
                  placeholder="Describe your case, key facts, dates, parties involved..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="recipientInfo">Recipient Information</Label>
                <Textarea
                  id="recipientInfo"
                  value={recipientInfo}
                  onChange={(e) => setRecipientInfo(e.target.value)}
                  placeholder="Name, address, contact information of recipient..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="additionalDetails">Additional Context</Label>
                <Textarea
                  id="additionalDetails"
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Any specific requirements, deadlines, or special circumstances..."
                  rows={3}
                />
              </div>

              <Button onClick={handleDraft} disabled={loading} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                {loading ? "Drafting..." : "Draft Document"}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Generated Document</h2>
              {draftedDocument && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadDocument}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>

            {draftedDocument ? (
              <div className="bg-muted p-4 rounded-md h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">{draftedDocument}</pre>
              </div>
            ) : (
              <div className="h-[600px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Your drafted document will appear here</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
