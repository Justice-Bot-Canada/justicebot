import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
// ❌ REMOVED - Sonner causing runtime errors
// import { toast } from "sonner";
import { toast } from "@/lib/toast-stub";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PathwayRecommendation } from "@/components/PathwayRecommendation";
import EnhancedSEO from "@/components/EnhancedSEO";
import CanonicalURL from "@/components/CanonicalURL";
import { Card } from "@/components/ui/card";
import { Loader2, Award } from "lucide-react";
import { RelatedPages } from "@/components/RelatedPages";
import { Badge } from "@/components/ui/badge";

export default function PathwayDecision() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState<any>(null);

  useEffect(() => {
    if (!caseId) {
      navigate('/dashboard');
      return;
    }
    loadCaseData();
  }, [caseId]);

  const loadCaseData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();

      if (error) throw error;
      
      if (!data) {
        toast.error('Case not found');
        navigate('/dashboard');
        return;
      }

      setCaseData(data);
    } catch (error) {
      console.error('Error loading case:', error);
      toast.error('Failed to load case data');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Generate pathways based on case type and province
  const generatePathways = () => {
    if (!caseData) return [];

    const province = caseData.province;
    const meritScore = caseData.merit_score || 0;
    const caseDescription = caseData.description?.toLowerCase() || '';
    
    // Auto-detect issue type from case data
    const isLandlordTenant = caseDescription.includes('rent') || caseDescription.includes('evict') || 
                             caseDescription.includes('landlord') || caseDescription.includes('tenant') ||
                             caseDescription.includes('maintenance') || caseDescription.includes('repair');
    
    const isHumanRights = caseDescription.includes('discrimin') || caseDescription.includes('harass') ||
                          caseDescription.includes('accessibility') || caseDescription.includes('rights');
    
    const isEmployment = caseDescription.includes('employ') || caseDescription.includes('work') ||
                         caseDescription.includes('job') || caseDescription.includes('wage');
    
    const isFamily = caseDescription.includes('custody') || caseDescription.includes('child') ||
                     caseDescription.includes('support') || caseDescription.includes('divorce');
    
    const isSmallClaims = caseDescription.includes('money') || caseDescription.includes('debt') ||
                          caseDescription.includes('damage') || caseDescription.includes('contract');
    
    // This is a simplified example - in production, this would use AI analysis
    const pathways = [];

    // Landlord Tenant Board pathway (Ontario specific) - PRIORITIZE if detected
    if (province === 'Ontario' && isLandlordTenant) {
      pathways.push({
        id: 'ltb',
        title: 'Landlord and Tenant Board (LTB)',
        description: 'File an application with the LTB for rent disputes, repairs, evictions, or maintenance issues.',
        suitability: 'excellent',
        recommended: true,
        timeframe: '4-8 weeks to hearing',
        cost: '$5.99 filing fee',
        successRate: meritScore >= 70 ? 85 : 65,
        pros: [
          'Less formal than court',
          'No lawyer required',
          'Faster resolution',
          'Expert adjudicators in rental law'
        ],
        cons: [
          'Limited to landlord-tenant matters',
          'Cannot enforce personal claims',
          'Must have proper documentation'
        ],
        recommendedForms: [
          { code: 'T2', name: 'Tenant Rights Application', formId: null },
          { code: 'T6', name: 'Maintenance & Repairs', formId: null },
          { code: 'L1', name: 'Non-Payment of Rent', formId: null }
        ],
        nextSteps: [
          'Gather all evidence (photos, emails, receipts)',
          'Complete the appropriate application form',
          'Pay the filing fee',
          'Serve the other party',
          'Attend the hearing'
        ]
      });
    } else if (province === 'Ontario') {
      pathways.push({
        id: 'ltb',
        title: 'Landlord and Tenant Board (LTB)',
        description: 'File an application with the LTB for rent disputes, repairs, evictions, or maintenance issues.',
        suitability: meritScore >= 70 ? 'excellent' : meritScore >= 50 ? 'good' : 'fair',
        recommended: false,
        timeframe: '4-8 weeks to hearing',
        cost: '$5.99 filing fee',
        successRate: meritScore >= 70 ? 85 : 65,
        pros: [
          'Less formal than court',
          'No lawyer required',
          'Faster resolution',
          'Expert adjudicators in rental law'
        ],
        cons: [
          'Limited to landlord-tenant matters',
          'Cannot enforce personal claims',
          'Must have proper documentation'
        ],
        recommendedForms: [
          { code: 'T2', name: 'Tenant Rights Application', formId: null },
          { code: 'T6', name: 'Maintenance & Repairs', formId: null },
          { code: 'L1', name: 'Non-Payment of Rent', formId: null }
        ],
        nextSteps: [
          'Gather all evidence (photos, emails, receipts)',
          'Complete the appropriate application form',
          'Pay the filing fee',
          'Serve the other party',
          'Attend the hearing'
        ]
      });
    }

    // Human Rights Tribunal - PRIORITIZE if discrimination detected
    if (isHumanRights) {
      pathways.push({
        id: 'hrto',
        title: 'Human Rights Tribunal of Ontario (HRTO)',
        description: 'File a complaint if you experienced discrimination in housing, employment, or services based on protected grounds.',
        suitability: 'excellent',
        recommended: true,
        timeframe: '6-12 months',
        cost: '$5.99 (free at tribunal)',
        successRate: meritScore >= 65 ? 75 : 55,
        pros: [
          'Free to file at tribunal',
          'Can award compensation',
          'Legal representation available',
          'Strong enforcement powers'
        ],
        cons: [
          'Longer process',
          'Must prove discrimination',
          'Emotional burden',
          'Complex legal test'
        ],
        recommendedForms: [
          { code: 'Form 1', name: 'Application under Code', formId: null },
          { code: 'Schedule A', name: 'Details of Discrimination', formId: null }
        ],
        nextSteps: [
          'Document all incidents with dates and witnesses',
          'File Form 1 with the HRTO',
          'Serve the respondent',
          'Prepare for mediation',
          'Attend hearing if needed'
        ]
      });
    } else {
      pathways.push({
        id: 'hrto',
        title: 'Human Rights Tribunal of Ontario (HRTO)',
        description: 'File a complaint if you experienced discrimination in housing, employment, or services based on protected grounds.',
        suitability: meritScore >= 65 ? 'good' : meritScore >= 45 ? 'fair' : 'poor',
        recommended: false,
        timeframe: '6-12 months',
        cost: '$5.99 (free at tribunal)',
        successRate: meritScore >= 65 ? 70 : 50,
        pros: [
          'Free to file at tribunal',
          'Can award compensation',
          'Legal representation available',
          'Strong enforcement powers'
        ],
        cons: [
          'Longer process',
          'Must prove discrimination',
          'Emotional burden',
          'Complex legal standards'
        ],
        recommendedForms: [
          { code: 'Form 1', name: 'Application Form', formId: null },
          { code: 'Package', name: 'Supporting Documentation', formId: null }
        ],
        nextSteps: [
          'Identify the protected ground',
          'Document all incidents with dates',
          'Try to resolve directly first',
          'Complete application form',
          'Submit within one year of incident'
        ]
      });
    }

    // Small Claims Court - PRIORITIZE if money dispute
    if (isSmallClaims) {
      pathways.push({
        id: 'small-claims',
        title: 'Small Claims Court',
        description: 'File a claim for monetary compensation up to $35,000 for disputes involving contracts, property damage, or unpaid debts.',
        suitability: 'excellent',
        recommended: true,
        timeframe: '3-6 months',
        cost: '$102-$275 filing fee',
        successRate: meritScore >= 60 ? 80 : 60,
        pros: [
          'Can claim up to $35,000',
          'Simpler procedures than Superior Court',
          'Decisions are enforceable',
          'Can hire a lawyer or paralegal'
        ],
        cons: [
          'Higher filing fees',
          'Must have monetary claim',
          'Need solid evidence',
          'Time-consuming process'
        ],
        recommendedForms: [
          { code: 'Claim', name: 'Plaintiff Claim Form', formId: null },
          { code: 'Defence', name: 'Defence Form', formId: null },
          { code: 'Affidavit', name: 'Affidavit of Service', formId: null }
        ],
        nextSteps: [
          'Calculate your damages',
          'Gather all supporting evidence',
          'Complete the Plaintiff Claim form',
          'Pay the filing fee',
          'Serve the defendant'
        ]
      });
    } else {
      pathways.push({
        id: 'small-claims',
        title: 'Small Claims Court',
        description: 'File a claim for monetary compensation up to $35,000 for disputes involving contracts, property damage, or unpaid debts.',
        suitability: meritScore >= 60 ? 'good' : 'fair',
        recommended: false,
        timeframe: '3-6 months',
        cost: '$102-$275 filing fee',
        successRate: meritScore >= 60 ? 75 : 55,
        pros: [
          'Can claim up to $35,000',
          'Simpler procedures than Superior Court',
          'Decisions are enforceable',
          'Can hire a lawyer or paralegal'
        ],
        cons: [
          'Higher filing fees',
          'Must have monetary claim',
          'Need solid evidence',
          'Time-consuming process'
        ],
        recommendedForms: [
          { code: 'Claim', name: 'Plaintiff Claim Form', formId: null },
          { code: 'Defence', name: 'Defence Form', formId: null },
          { code: 'Affidavit', name: 'Affidavit of Service', formId: null }
        ],
        nextSteps: [
          'Calculate your total claim amount',
          'Gather all contracts and receipts',
          'Try mediation first',
          'File plaintiff claim',
          'Serve the defendant properly'
        ]
      });
    }

    return pathways;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your case analysis...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Legal Pathway Decision Tool",
    "description": "Compare legal pathways including LTB, HRTO, and Small Claims Court with personalized recommendations"
  };

  const relatedPages = [
    {
      title: "Small Claims Court Guide",
      description: "Step-by-step filing instructions for monetary disputes",
      path: "/small-claims",
      icon: "calculator" as const
    },
    {
      title: "LTB Application Help",
      description: "Complete guide to Landlord Tenant Board filings",
      path: "/ltb-help",
      icon: "file" as const
    },
    {
      title: "HRTO Complaint Guide",
      description: "File human rights discrimination complaints",
      path: "/hrto-help",
      icon: "help" as const
    },
    {
      title: "Case Assessment",
      description: "Get a detailed merit score and strategy analysis",
      path: "/assessment",
      icon: "book" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <CanonicalURL />
      <EnhancedSEO
        title="Choose Your Legal Pathway - Compare LTB, HRTO & Small Claims Court"
        description="Get personalized legal pathway recommendations. Compare success rates, costs, timelines, and next steps for LTB, HRTO, and Small Claims Court in Ontario."
        keywords="legal pathway decision, LTB vs small claims, HRTO filing, Ontario legal options, legal venue comparison"
        structuredData={structuredData}
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Choose Your Legal Pathway</h1>
            <p className="text-muted-foreground">
              Based on your case details, we've analyzed the best legal options for you.
              {caseData.merit_score && (
                <span className="ml-2">
                  <Badge variant="outline" className="ml-2">
                    <Award className="w-3 h-3 mr-1" />
                    Merit Score: {caseData.merit_score}/100
                  </Badge>
                </span>
              )}
            </p>
          </div>

          {/* Case Summary Card */}
          <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold mb-2">Your Case Summary</h3>
            <p className="text-sm text-muted-foreground mb-1">
              <strong>Issue:</strong> {caseData.title}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Location:</strong> {caseData.province}{caseData.municipality && `, ${caseData.municipality}`}
            </p>
          </Card>

          {/* Pathway Recommendations */}
          <div className="space-y-6">
            {generatePathways().map((pathway) => (
              <PathwayRecommendation
                key={pathway.id}
                pathway={pathway}
                caseId={caseId!}
                caseData={caseData}
              />
            ))}
          </div>

          <div className="mt-8">
            <RelatedPages 
              pages={relatedPages}
              title="Next Steps"
              description="Continue building your case with these resources"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}