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
  Loader2,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { CaseMeritScore } from "./CaseMeritScore";
import { EvidenceHub } from "./EvidenceHub";
import { EvidenceAnalyzer } from "./EvidenceAnalyzer";
import { FormsList } from "./FormsList";
import { FormPrefillPanel } from "./FormPrefillPanel";
import { ExhibitBookExport } from "./ExhibitBookExport";
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
    forms: ['HRTO Form 1 - Application', 'Schedule A - Details', 'Form 2 - Response'],
    filingSteps: [
      'Complete the HRTO Application Form (Form 1)',
      'Complete Schedule A with detailed facts',
      'Attach supporting documents and evidence',
      'File within 1 year of the alleged discrimination',
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
    forms: ['Form 7A - Plaintiff\'s Claim', 'Form 9A - Defence', 'Form 11A - Affidavit of Service'],
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
    forms: ['Form 8 - Application', 'Form 10 - Answer', 'Form 13 - Financial Statement'],
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
  },
  'SUPERIOR': {
    label: 'Superior Court',
    fullName: 'Ontario Superior Court of Justice',
    color: 'bg-indigo-500',
    forms: ['Statement of Claim', 'Statement of Defence', 'Affidavit of Documents'],
    filingSteps: [
      'Draft your Statement of Claim',
      'Pay the filing fee ($229)',
      'Serve the defendant personally',
      'Wait for Statement of Defence (20-40 days)',
      'Complete documentary discovery'
    ],
    documentsNeeded: [
      'All relevant contracts',
      'Expert reports',
      'Financial records',
      'Witness statements',
      'Timeline of events'
    ],
    deadlines: [
      '2 years limitation period',
      '20 days (Ontario) or 40 days (outside) for defence',
      '30 days for affidavit of documents'
    ]
  },
  'CRIMINAL': {
    label: 'Criminal',
    fullName: 'Ontario Court of Justice - Criminal',
    color: 'bg-red-500',
    forms: ['Private Information', 'Bail Variation Request', 'Section 810 Peace Bond'],
    filingSteps: [
      'Consult with duty counsel',
      'Understand the charges',
      'Gather disclosure from Crown',
      'Prepare your defence',
      'Attend all court appearances'
    ],
    documentsNeeded: [
      'Disclosure from Crown',
      'Character references',
      'Employment records',
      'Any alibi evidence',
      'Witness contact information'
    ],
    deadlines: [
      'Arraignment within 90 days',
      '18-month trial deadline (s. 11(b))',
      'Bail review within 90 days'
    ]
  },
  'LABOUR': {
    label: 'Labour Board',
    fullName: 'Ontario Labour Relations Board',
    color: 'bg-orange-500',
    forms: ['Application for Certification', 'Unfair Labour Practice Complaint', 'Grievance Referral'],
    filingSteps: [
      'File your application online',
      'Provide supporting documentation',
      'Serve all other parties',
      'Attend pre-hearing conference',
      'Present your case at hearing'
    ],
    documentsNeeded: [
      'Employment contract',
      'Union correspondence',
      'Collective agreement',
      'Company policies',
      'Termination documents'
    ],
    deadlines: [
      '6 months for unfair labour practice',
      '30 days for certification votes',
      '35 days for grievance referrals'
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

  const caseType = caseData.venue?.toUpperCase() || '';
  const config = CASE_TYPE_CONFIG[caseType] || {
    label: 'Unknown',
    fullName: 'Unknown Case Type',
    color: 'bg-gray-500',
    forms: [],
    filingSteps: ['Update your case with the correct case type to see filing steps'],
    documentsNeeded: ['Update your case to see required documents'],
    deadlines: ['Update your case to see deadlines']
  };
  const hasValidCaseType = !!CASE_TYPE_CONFIG[caseType];

  return (
    <div className="space-y-6">
      {/* Warning if no case type set */}
      {!hasValidCaseType && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Case type not set:</strong> This case doesn't have a venue/case type assigned. 
            Forms and filing guidance shown may not be relevant. Please update your case with the correct venue type.
          </AlertDescription>
        </Alert>
      )}

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

      {/* Journey Progress Indicator */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Your Case Journey</p>
            <Badge variant="outline" className="text-xs">Follow these steps</Badge>
          </div>
          <div className="flex items-center gap-2">
            {[
              { step: 1, label: "Overview", tab: "overview" },
              { step: 2, label: "Upload", tab: "documents" },
              { step: 3, label: "Evidence", tab: "evidence" },
              { step: 4, label: "Forms", tab: "forms" },
              { step: 5, label: "Filing", tab: "guide" }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <button
                  onClick={() => setActiveTab(item.tab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === item.tab 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-background/20 flex items-center justify-center text-[10px]">
                    {item.step}
                  </span>
                  {item.label}
                </button>
                {index < 4 && <div className="w-4 h-0.5 bg-muted mx-1" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="gap-1">
            <Info className="h-3.5 w-3.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-1">
            <Upload className="h-3.5 w-3.5" />
            Upload Docs
          </TabsTrigger>
          <TabsTrigger value="evidence" className="gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            Evidence Book
          </TabsTrigger>
          <TabsTrigger value="forms" className="gap-1">
            <FileText className="h-3.5 w-3.5" />
            Forms & Filing
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-1">
            <Scale className="h-3.5 w-3.5" />
            Filing Guide
          </TabsTrigger>
        </TabsList>

        {/* Step 1: Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Alert className="border-primary/30 bg-primary/5">
            <Target className="h-4 w-4 text-primary" />
            <AlertDescription>
              <strong>Step 1 - Case Overview:</strong> Review your case details and merit score. 
              When ready, proceed to <button onClick={() => setActiveTab('documents')} className="text-primary font-medium underline">Upload Documents</button>.
            </AlertDescription>
          </Alert>

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
                Your Journey for {config.label} Case
              </CardTitle>
              <CardDescription>
                Follow these steps to build and file your case
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
              <Button 
                className="mt-4 w-full" 
                onClick={() => setActiveTab('documents')}
              >
                <Upload className="h-4 w-4 mr-2" />
                Continue to Upload Documents
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Documents Upload Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Alert className="border-blue-500/30 bg-blue-500/5">
            <Upload className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              <strong>Step 2 - Upload Documents:</strong> Upload all relevant documents for your {config.label} case. 
              Once uploaded, proceed to <button onClick={() => setActiveTab('evidence')} className="text-primary font-medium underline">Build Evidence Book</button> to organize them.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Documents Needed for {config.label}
              </CardTitle>
              <CardDescription>
                Upload these documents to strengthen your case
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3 mb-6">
                {config.documentsNeeded.map((doc, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{doc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <EvidenceHub caseId={caseId} />

          <div className="flex justify-end">
            <Button onClick={() => setActiveTab('evidence')}>
              Continue to Build Evidence Book
              <BookOpen className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>

        {/* Step 3: Evidence Book Tab */}
        <TabsContent value="evidence" className="space-y-6">
          <Alert className="border-green-500/30 bg-green-500/5">
            <BookOpen className="h-4 w-4 text-green-500" />
            <AlertDescription>
              <strong>Step 3 - Build Evidence Book:</strong> AI will analyze your documents and help organize them into a compelling evidence book. 
              When ready, proceed to <button onClick={() => setActiveTab('forms')} className="text-primary font-medium underline">Forms & Filing</button>.
            </AlertDescription>
          </Alert>

          <EvidenceAnalyzer 
            caseId={caseId}
            caseType={caseType}
            caseDescription={caseData.description}
          />

          {/* Premium Exhibit Book Export */}
          <ExhibitBookExport caseId={caseId} caseTitle={caseData.title} />

          <div className="flex justify-end">
            <Button onClick={() => setActiveTab('forms')}>
              Continue to Forms & Filing
              <FileText className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>

        {/* Step 4: Forms Tab */}
        <TabsContent value="forms" className="space-y-6">
          <Alert className="border-purple-500/30 bg-purple-500/5">
            <FileText className="h-4 w-4 text-purple-500" />
            <AlertDescription>
              <strong>Step 4 - Forms & Filing:</strong> AI will pre-fill your court forms using your evidence and CanLII case law. 
              Review and generate official forms, then proceed to <button onClick={() => setActiveTab('guide')} className="text-primary font-medium underline">Filing Guide</button>.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>{config.label} Forms</CardTitle>
              <CardDescription>
                AI-assisted form generation using your evidence and relevant case law from CanLII
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* AI Form Pre-fill Panel with real forms from database */}
              <FormPrefillPanel 
                caseId={caseId}
                caseType={caseType}
                caseDescription={caseData.description}
              />
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

          <div className="flex justify-end">
            <Button onClick={() => setActiveTab('guide')}>
              Continue to Filing Guide
              <Scale className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>

        {/* Step 5: Filing Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <Alert className="border-orange-500/30 bg-orange-500/5">
            <Scale className="h-4 w-4 text-orange-500" />
            <AlertDescription>
              <strong>Step 5 - Filing Guide:</strong> Complete guide for filing at {config.fullName}. 
              Follow these procedures for your specific courthouse or tribunal.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Filing Steps</CardTitle>
                <CardDescription>Step-by-step procedure for {config.fullName}</CardDescription>
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
                <CardTitle>Required Documents Checklist</CardTitle>
                <CardDescription>Ensure you have these before filing</CardDescription>
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

          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="py-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Ready to File?</h3>
              <p className="text-muted-foreground mb-4">
                You've completed all preparation steps. Generate your final forms and file with {config.fullName}.
              </p>
              <Button size="lg" onClick={() => setActiveTab('forms')}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Final Forms
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}