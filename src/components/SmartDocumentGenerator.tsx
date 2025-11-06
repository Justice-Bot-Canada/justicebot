import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText, Download, Copy } from 'lucide-react';
import { useSmartDocument, DocumentType, ToneType, CaseContext } from '@/hooks/useSmartDocument';
import { toast } from '@/hooks/use-toast';

export function SmartDocumentGenerator() {
  const { loading, document: generatedDoc, generateDocument, clearDocument } = useSmartDocument();
  
  const [documentType, setDocumentType] = useState<DocumentType>('demand_letter');
  const [tone, setTone] = useState<ToneType>('formal');
  const [caseContext, setCaseContext] = useState<CaseContext>({
    caseType: '',
    province: 'ON',
    parties: {
      applicant: '',
      respondent: '',
    },
    facts: '',
    issues: '',
    evidence: [],
    desiredOutcome: '',
  });

  const handleGenerate = async () => {
    if (!caseContext.facts || !caseContext.issues) {
      toast({
        title: "Missing Information",
        description: "Please provide case facts and key issues.",
        variant: "destructive",
      });
      return;
    }

    await generateDocument({ documentType, tone, caseContext });
  };

  const handleCopy = () => {
    if (generatedDoc) {
      navigator.clipboard.writeText(generatedDoc);
      toast({
        title: "Copied",
        description: "Document copied to clipboard",
      });
    }
  };

  const handleDownload = () => {
    if (generatedDoc) {
      const blob = new Blob([generatedDoc], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${documentType}_${Date.now()}.txt`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded",
        description: "Document saved successfully",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Smart Document Drafter</h1>
        <p className="text-muted-foreground">AI-powered legal document generation with customizable tone</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Document Configuration</CardTitle>
            <CardDescription>Select document type, tone, and provide case details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Document Type */}
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demand_letter">Demand Letter</SelectItem>
                  <SelectItem value="affidavit">Affidavit</SelectItem>
                  <SelectItem value="witness_statement">Witness Statement</SelectItem>
                  <SelectItem value="settlement_offer">Settlement Offer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(value) => setTone(value as ToneType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal - Professional & Neutral</SelectItem>
                  <SelectItem value="assertive">Assertive - Confident & Direct</SelectItem>
                  <SelectItem value="conciliatory">Conciliatory - Collaborative & Solution-Focused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Province */}
            <div className="space-y-2">
              <Label>Province</Label>
              <Select 
                value={caseContext.province} 
                onValueChange={(value) => setCaseContext({ ...caseContext, province: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ON">Ontario</SelectItem>
                  <SelectItem value="BC">British Columbia</SelectItem>
                  <SelectItem value="AB">Alberta</SelectItem>
                  <SelectItem value="QC">Quebec</SelectItem>
                  <SelectItem value="MB">Manitoba</SelectItem>
                  <SelectItem value="SK">Saskatchewan</SelectItem>
                  <SelectItem value="NS">Nova Scotia</SelectItem>
                  <SelectItem value="NB">New Brunswick</SelectItem>
                  <SelectItem value="PE">Prince Edward Island</SelectItem>
                  <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Case Type */}
            <div className="space-y-2">
              <Label>Case Type</Label>
              <Input
                placeholder="e.g., Landlord-Tenant, Small Claims, Human Rights"
                value={caseContext.caseType}
                onChange={(e) => setCaseContext({ ...caseContext, caseType: e.target.value })}
              />
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Applicant/Plaintiff</Label>
                <Input
                  placeholder="Your name"
                  value={caseContext.parties?.applicant}
                  onChange={(e) => setCaseContext({ 
                    ...caseContext, 
                    parties: { ...caseContext.parties, applicant: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Respondent/Defendant</Label>
                <Input
                  placeholder="Other party name"
                  value={caseContext.parties?.respondent}
                  onChange={(e) => setCaseContext({ 
                    ...caseContext, 
                    parties: { ...caseContext.parties, respondent: e.target.value }
                  })}
                />
              </div>
            </div>

            {/* Facts */}
            <div className="space-y-2">
              <Label>Case Facts *</Label>
              <Textarea
                placeholder="Describe what happened, when, and relevant background..."
                rows={4}
                value={caseContext.facts}
                onChange={(e) => setCaseContext({ ...caseContext, facts: e.target.value })}
              />
            </div>

            {/* Issues */}
            <div className="space-y-2">
              <Label>Key Issues *</Label>
              <Textarea
                placeholder="What are the main legal issues or disputes?"
                rows={3}
                value={caseContext.issues}
                onChange={(e) => setCaseContext({ ...caseContext, issues: e.target.value })}
              />
            </div>

            {/* Desired Outcome */}
            <div className="space-y-2">
              <Label>Desired Outcome</Label>
              <Textarea
                placeholder="What resolution are you seeking?"
                rows={2}
                value={caseContext.desiredOutcome}
                onChange={(e) => setCaseContext({ ...caseContext, desiredOutcome: e.target.value })}
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Document
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Document</CardTitle>
            <CardDescription>AI-generated document ready for review and customization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedDoc ? (
              <>
                <div className="flex gap-2 mb-4">
                  <Button onClick={handleCopy} variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button onClick={handleDownload} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button onClick={clearDocument} variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
                <div className="p-4 bg-muted rounded-lg max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm">{generatedDoc}</pre>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Your generated document will appear here</p>
                <p className="text-sm mt-2">Fill in the case details and click Generate Document</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
