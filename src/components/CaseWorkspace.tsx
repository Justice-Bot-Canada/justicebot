import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  FileText, 
  Scale, 
  FolderOpen, 
  BookOpen, 
  CheckCircle,
  Clock,
  Upload,
  Info,
  Target,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { CaseMeritScore } from "./CaseMeritScore";
import { EvidenceHub } from "./EvidenceHub";
import { EvidenceAnalyzer } from "./EvidenceAnalyzer";
import { FormsList } from "./FormsList";
import { toast } from "@/lib/toast-stub";

interface CaseData {
  id: string;
  title: string;
  description: string;
  province: string;
  venue: string;
  merit_score: number;
  status: string;
  created_at: string;
}

interface CaseWorkspaceProps {
  caseId: string;
  onBack: () => void;
}

// Case type configuration
const CASE_TYPE_CONFIG: Record<string, {
  label: string;
  fullName: string;
  color: string;
  forms: string[];
  filingSteps: string[];
  documentsNeeded: string[];
  deadlines: string[];
}> = {
  'HRTO': {
    label: 'Human Rights',
    fullName: 'Human Rights Tribunal of Ontario',
    color: 'bg-purple-500',
    forms: ['HRTO Application', 'Response Form', 'Request to Extend Time'],
    filingSteps: [
      'Complete the HRTO Application Form (Form 1)',
      'Attach supporting documents and evidence',
      'File within 1 year of the alleged discrimination',
      'Pay the filing fee (waived for individuals)',
      'Serve the respondent with a copy'
    ],
    documentsNeeded: [
      'Chronology of events',
      'Correspondence with respondent',
      'Medical records (if applicable)',
      'Employment records',
      'Witness statements'
    ],
    deadlines: [
      '1 year from incident to file application',
      '35 days for respondent to respond',
      '60 days for mediation scheduling'
    ]
  },
  'LTB': {
    label: 'Landlord Tenant',
    fullName: 'Landlord and Tenant Board',
    color: 'bg-green-500',
    forms: ['T2 - Tenant Rights', 'T6 - Maintenance', 'L1 - Eviction', 'L2 - Termination'],
    filingSteps: [
      'Identify the correct form (T2 for rights issues, T6 for repairs)',
      'Complete all sections of the form',
      'Attach evidence of issues (photos, letters)',
      'Pay filing fee ($53 for most applications)',
      'File online through Tribunals Ontario Portal'
    ],
    documentsNeeded: [
      'Lease agreement',
      'Photos/videos of issues',
      'Communication with landlord',
      'Repair requests (written)',
      'Rent receipts'
    ],
    deadlines: [
      'No strict deadline for T2/T6',
      '5 days to file certificate after L1',
      '14 days notice for most terminations'
    ]
  },
  'SMALL_CLAIMS': {
    label: 'Small Claims',
    fullName: 'Small Claims Court',
    color: 'bg-blue-500',
    forms: ['Plaintiff\'s Claim', 'Defence', 'Defendant\'s Claim'],
    filingSteps: [
      'Complete the Plaintiff\'s Claim form',
      'Calculate your damages (up to $35,000)',
      'Pay the filing fee ($102-$252)',
      'Serve the defendant within 6 months',
      'Attend settlement conference'
    ],
    documentsNeeded: [
      'Contracts or agreements',
      'Invoices and receipts',
      'Photos of damage',
      'Correspondence',
      'Expert estimates'
    ],
    deadlines: [
      '2 years from incident (limitation period)',
      '6 months to serve after filing',
      '20 days for defendant to file defence'
    ]
  },
  'FAMILY': {
    label: 'Family',
    fullName: 'Family Court',
    color: 'bg-pink-500',
    forms: ['Application (Form 8)', 'Answer (Form 10)', 'Financial Statement'],
    filingSteps: [
      'Complete the appropriate family court form',
      'File your financial statement (Form 13)',
      'Serve the other party',
      'Attend case conference',
      'Complete mandatory information program'
    ],
    documentsNeeded: [
      'Marriage certificate',
      'Financial statements',
      'Property valuations',
      'Income tax returns',
      'Child-related documents'
    ],
    deadlines: [
      '30 days to serve application',
      '30 days for respondent to answer',
      'Financial disclosure within 10 days'
    ]
  }
};

export function CaseWorkspace({ caseId, onBack }: CaseWorkspaceProps) {
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCaseData();
  }, [caseId]);

  const fetchCaseData = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();

      if (error) throw error;
      setCaseData(data);
    } catch (error) {
      console.error('Error fetching case:', error);
      toast.error('Failed to load case');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Case not found</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const caseType = caseData.venue?.toUpperCase() || 'LTB';
  const config = CASE_TYPE_CONFIG[caseType] || CASE_TYPE_CONFIG['LTB'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cases
          </Button>
          <div className="flex items-center gap-3">
            <Badge className={`${config.color} text-white`}>
              {config.label}
            </Badge>
            <h1 className="text-2xl font-bold">{caseData.title}</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {config.fullName} • {caseData.province}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/case-timeline?caseId=${caseId}`)}
          >
            <Clock className="h-4 w-4 mr-2" />
            Timeline
          </Button>
          <Button onClick={() => navigate(`/evidence?caseId=${caseId}`)}>
            <FolderOpen className="h-4 w-4 mr-2" />
            Evidence Hub
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config.color}/10`}>
                <Scale className={`h-5 w-5 text-${config.color.replace('bg-', '')}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Merit Score</p>
                <p className="text-xl font-bold">{caseData.merit_score || 0}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Case Type</p>
                <p className="text-xl font-bold">{config.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-xl font-bold capitalize">{caseData.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <BookOpen className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Forms Available</p>
                <p className="text-xl font-bold">{config.forms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forms">Forms & Filing</TabsTrigger>
          <TabsTrigger value="evidence">Evidence Book</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="guide">Filing Guide</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <CaseMeritScore 
              caseId={caseId}
              caseType={caseType}
              caseDescription={caseData.description}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Case Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="mt-1">{caseData.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tribunal/Court</p>
                  <p className="mt-1 font-medium">{config.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="mt-1">{new Date(caseData.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Your Next Steps for {config.label} Case
              </CardTitle>
              <CardDescription>
                Follow these steps to progress your case
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {config.filingSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forms Tab */}
        <TabsContent value="forms" className="space-y-6">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Forms for {config.fullName}:</strong> Below are the relevant forms for your case type. 
              Other forms have been filtered out to help you focus.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>{config.label} Forms</CardTitle>
              <CardDescription>
                Required and recommended forms for your {config.label} case
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {config.forms.map((form, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{form}</p>
                        <p className="text-sm text-muted-foreground">Official {config.fullName} form</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Preview</Button>
                      <Button size="sm">Generate</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filing Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Important Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {config.deadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <p className="text-sm">{deadline}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence" className="space-y-6">
          <Alert>
            <BookOpen className="h-4 w-4" />
            <AlertDescription>
              <strong>Build Your Evidence Book:</strong> Upload and organize documents that support your {config.label} case. 
              AI will help categorize and suggest how to present your evidence.
            </AlertDescription>
          </Alert>

          <EvidenceAnalyzer 
            caseId={caseId}
            caseType={caseType}
            caseDescription={caseData.description}
          />
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Alert>
            <FolderOpen className="h-4 w-4" />
            <AlertDescription>
              <strong>Document Hub:</strong> All your uploaded evidence and generated documents for this {config.label} case.
            </AlertDescription>
          </Alert>

          <EvidenceHub caseId={caseId} />
        </TabsContent>

        {/* Filing Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Filing Steps</CardTitle>
                <CardDescription>Step-by-step guide for {config.fullName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {config.filingSteps.map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="pt-1">
                        <p className="text-sm">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documents You'll Need</CardTitle>
                <CardDescription>Gather these before filing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {config.documentsNeeded.map((doc, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Critical Deadlines for {config.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {config.deadlines.map((deadline, index) => (
                  <div key={index} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <p className="text-sm font-medium">{deadline}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}