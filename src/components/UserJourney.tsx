import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Users, 
  DollarSign,
  MapPin,
  ArrowRight,
  ExternalLink,
  Lightbulb,
  Target,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  action?: () => void;
  actionText?: string;
  completed?: boolean;
}

interface UserJourneyProps {
  venue: 'hrto' | 'ltb' | 'small-claims' | 'family' | 'criminal';
  userSituation?: string;
  incidentDate?: Date;
  onStepComplete?: (stepId: string) => void;
}

const getJourneyData = (venue: string) => {
  switch (venue) {
    case 'hrto':
      return {
        title: "Your HRTO Journey: Fighting Discrimination",
        subtitle: "Step-by-step guide to filing a human rights complaint",
        criticalWarning: "⚠️ CRITICAL: You have only 1 year from the incident to file. This deadline cannot be extended!",
        helpfulLinks: [
          { title: "HRTO Official Guide", url: "https://www.sjto.gov.on.ca/hrto/application-process/" },
          { title: "Ontario Human Rights Code", url: "https://www.ohrc.on.ca/en/ontario-human-rights-code" },
          { title: "Sample Applications", url: "https://www.sjto.gov.on.ca/hrto/guides-and-samples/" }
        ],
        steps: [
          {
            id: 'assess-case',
            title: 'Assess Your Case Strength',
            description: 'Determine if your situation qualifies as discrimination under the Ontario Human Rights Code',
            timeEstimate: '30 minutes',
            priority: 'critical' as const,
            actionText: 'Start Case Assessment'
          },
          {
            id: 'gather-evidence',
            title: 'Gather Evidence & Documentation',
            description: 'Collect emails, witness statements, photos, and any documentation of discriminatory treatment',
            timeEstimate: '1-2 weeks',
            priority: 'critical' as const,
            actionText: 'Evidence Checklist'
          },
          {
            id: 'check-deadline',
            title: 'Verify 1-Year Deadline',
            description: 'Confirm you\'re within the 1-year filing deadline from the last incident',
            timeEstimate: '10 minutes',
            priority: 'critical' as const,
            actionText: 'Check Deadline'
          },
          {
            id: 'prepare-application',
            title: 'Prepare HRTO Application',
            description: 'Complete Form 1 with detailed facts, dates, and explanation of discrimination',
            timeEstimate: '2-4 hours',
            priority: 'high' as const,
            actionText: 'Start Application'
          },
          {
            id: 'file-application',
            title: 'File Your Application',
            description: 'Submit your completed application online through the HRTO portal',
            timeEstimate: '30 minutes',
            priority: 'high' as const,
            actionText: 'File Now'
          },
          {
            id: 'serve-respondent',
            title: 'Serve the Respondent',
            description: 'Deliver a copy of your application to the person/organization you\'re filing against',
            timeEstimate: '1-2 weeks',
            priority: 'medium' as const,
            actionText: 'Service Guide'
          }
        ]
      };
      
    case 'ltb':
      return {
        title: "Your LTB Journey: Protecting Tenant Rights",
        subtitle: "Navigate the Landlord and Tenant Board process",
        criticalWarning: null,
        helpfulLinks: [
          { title: "LTB Official Portal", url: "https://tribunalsontario.ca/ltb/" },
          { title: "Tenant Rights Guide", url: "https://www.ontario.ca/page/renting-ontario-your-rights" },
          { title: "LTB Forms Library", url: "https://tribunalsontario.ca/ltb/forms/" }
        ],
        steps: [
          {
            id: 'identify-issue',
            title: 'Identify Your LTB Issue Type',
            description: 'Determine which LTB form applies to your specific landlord-tenant problem',
            timeEstimate: '20 minutes',
            priority: 'high' as const,
            actionText: 'Issue Identifier'
          },
          {
            id: 'gather-evidence',
            title: 'Collect Evidence & Documents',
            description: 'Gather lease agreement, receipts, photos, emails, and communications with landlord',
            timeEstimate: '1 week',
            priority: 'high' as const,
            actionText: 'Evidence Checklist'
          },
          {
            id: 'complete-forms',
            title: 'Complete LTB Forms',
            description: 'Fill out appropriate forms (T2, T6, L1, etc.) with accurate details and legal language',
            timeEstimate: '2-3 hours',
            priority: 'high' as const,
            actionText: 'Start Forms'
          },
          {
            id: 'file-application',
            title: 'File Through Tribunals Ontario',
            description: 'Submit your application online and pay the $53 filing fee',
            timeEstimate: '30 minutes',
            priority: 'medium' as const,
            actionText: 'File Application'
          },
          {
            id: 'serve-documents',
            title: 'Serve the Other Party',
            description: 'Deliver copies of your application to your landlord or tenant',
            timeEstimate: '1 week',
            priority: 'medium' as const,
            actionText: 'Service Instructions'
          },
          {
            id: 'prepare-hearing',
            title: 'Prepare for Hearing',
            description: 'Organize evidence, prepare testimony, and review LTB hearing procedures',
            timeEstimate: '1-2 weeks',
            priority: 'medium' as const,
            actionText: 'Hearing Prep'
          }
        ]
      };
      
    case 'small-claims':
      return {
        title: "Your Small Claims Court Journey",
        subtitle: "Recover money or resolve disputes under $35,000",
        criticalWarning: "⚠️ Limitation Period: Most claims must be filed within 2 years of discovering the issue",
        helpfulLinks: [
          { title: "Small Claims Court Guide", url: "https://www.ontariocourts.ca/scj/small-claims/" },
          { title: "Court Forms", url: "https://www.ontariocourts.ca/scj/small-claims/forms/" },
          { title: "Self-Help Resources", url: "https://www.ontariocourts.ca/scj/small-claims/guides/" }
        ],
        steps: [
          {
            id: 'calculate-claim',
            title: 'Calculate Your Claim Amount',
            description: 'Determine exact damages, including interest and costs (maximum $35,000)',
            timeEstimate: '1-2 hours',
            priority: 'critical' as const,
            actionText: 'Damage Calculator'
          },
          {
            id: 'attempt-resolution',
            title: 'Try to Resolve Directly',
            description: 'Send demand letter or attempt negotiation before filing in court',
            timeEstimate: '1-2 weeks',
            priority: 'high' as const,
            actionText: 'Draft Demand Letter'
          },
          {
            id: 'gather-evidence',
            title: 'Prepare Evidence Package',
            description: 'Collect contracts, receipts, photos, correspondence, and witness statements',
            timeEstimate: '1-2 weeks',
            priority: 'high' as const,
            actionText: 'Evidence Guide'
          },
          {
            id: 'complete-claim',
            title: 'Complete Plaintiff\'s Claim',
            description: 'Fill out court forms with clear facts and legal basis for your claim',
            timeEstimate: '2-4 hours',
            priority: 'high' as const,
            actionText: 'Start Claim Form'
          },
          {
            id: 'file-claim',
            title: 'File at Courthouse',
            description: 'Submit your claim and pay filing fee ($102 for claims under $6,000)',
            timeEstimate: '1 hour',
            priority: 'medium' as const,
            actionText: 'Find Courthouse'
          },
          {
            id: 'serve-defendant',
            title: 'Serve the Defendant',
            description: 'Personally serve court documents to defendant within 6 months',
            timeEstimate: '1-2 weeks',
            priority: 'medium' as const,
            actionText: 'Service Guide'
          }
        ]
      };
      
    case 'criminal':
      return {
        title: "Your Criminal Law Journey",
        subtitle: "Navigate criminal charges and court proceedings",
        criticalWarning: "⚠️ URGENT: Criminal matters have strict deadlines. Contact duty counsel immediately if charged.",
        helpfulLinks: [
          { title: "Ontario Court of Justice", url: "https://www.ontariocourts.ca/ocj/" },
          { title: "Legal Aid Ontario", url: "https://www.legalaid.on.ca/" },
          { title: "CanLII Case Law", url: "https://www.canlii.org/en/on/" }
        ],
        steps: [
          {
            id: 'understand-charges',
            title: 'Understand Your Charges',
            description: 'Review the charges against you and understand potential penalties',
            timeEstimate: '1 hour',
            priority: 'critical' as const,
            actionText: 'Review Charges'
          },
          {
            id: 'legal-representation',
            title: 'Secure Legal Representation',
            description: 'Contact a criminal lawyer or apply for legal aid immediately',
            timeEstimate: '1-2 days',
            priority: 'critical' as const,
            actionText: 'Find Lawyer'
          },
          {
            id: 'gather-evidence',
            title: 'Collect Supporting Evidence',
            description: 'Gather documents, witness information, and any evidence supporting your case',
            timeEstimate: '1-2 weeks',
            priority: 'high' as const,
            actionText: 'Evidence Checklist'
          },
          {
            id: 'court-appearance',
            title: 'Prepare for Court Appearances',
            description: 'Understand court procedures and prepare for your first appearance',
            timeEstimate: '1 week',
            priority: 'high' as const,
            actionText: 'Court Prep Guide'
          }
        ]
      };
      
    case 'family':
      return {
        title: "Your Family Law Journey",
        subtitle: "Navigate divorce, custody, and child protection matters",
        criticalWarning: "⚠️ TIME-SENSITIVE: Child protection matters have urgent deadlines. Act quickly.",
        helpfulLinks: [
          { title: "Family Court Ontario", url: "https://www.ontariocourts.ca/scj/family/" },
          { title: "Ontario Family Law Forms", url: "https://www.ontariocourts.ca/scj/family/forms/" },
          { title: "CanLII Family Law", url: "https://www.canlii.org/en/on/onsc/" }
        ],
        steps: [
          {
            id: 'determine-issue-type',
            title: 'Identify Your Family Law Issue',
            description: 'Determine if you need divorce, custody, support, or child protection assistance',
            timeEstimate: '30 minutes',
            priority: 'high' as const,
            actionText: 'Issue Assessment'
          },
          {
            id: 'gather-documents',
            title: 'Collect Required Documents',
            description: 'Gather marriage certificate, financial records, and child-related documents',
            timeEstimate: '1-2 weeks',
            priority: 'high' as const,
            actionText: 'Document Checklist'
          },
          {
            id: 'complete-forms',
            title: 'Complete Court Forms',
            description: 'Fill out appropriate family law forms for your specific situation',
            timeEstimate: '2-4 hours',
            priority: 'high' as const,
            actionText: 'Start Forms'
          },
          {
            id: 'file-documents',
            title: 'File with Family Court',
            description: 'Submit completed forms and pay required court fees',
            timeEstimate: '1 hour',
            priority: 'medium' as const,
            actionText: 'File Forms'
          },
          {
            id: 'serve-other-party',
            title: 'Serve the Other Party',
            description: 'Properly serve court documents to spouse or other involved parties',
            timeEstimate: '1-2 weeks',
            priority: 'medium' as const,
            actionText: 'Service Guide'
          }
        ]
      };
      
    default:
      return {
        title: "Your Legal Journey",
        subtitle: "Step-by-step guidance for your legal matter",
        criticalWarning: null,
        helpfulLinks: [],
        steps: []
      };
  }
};

export const UserJourney: React.FC<UserJourneyProps> = ({
  venue,
  userSituation,
  incidentDate,
  onStepComplete
}) => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const journeyData = getJourneyData(venue);

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      onStepComplete?.(stepId);
    }
  };

  const getStepActions = (step: JourneyStep) => {
    switch (step.id) {
      case 'assess-case':
        return () => navigate('/assessment');
      case 'gather-evidence':
        return () => navigate('/dashboard');
      case 'file-application':
      case 'file-claim':
        return () => navigate(`/forms/${venue}`);
      case 'find-courthouse':
        return () => navigate('/tribunal-locator', { 
          state: { venue, userSituation } 
        });
      default:
        return undefined;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <Clock className="h-4 w-4 text-orange-600" />;
      default: return <Target className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{journeyData.title}</CardTitle>
          <CardDescription className="text-lg">
            {journeyData.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {journeyData.criticalWarning && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-semibold">
                {journeyData.criticalWarning}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-wrap gap-2">
            {journeyData.helpfulLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {link.title}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Journey Steps */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Step-by-Step Guide</TabsTrigger>
          <TabsTrigger value="checklist">Quick Checklist</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {journeyData.steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const action = getStepActions(step);
            
            return (
              <Card 
                key={step.id} 
                className={`${getPriorityColor(step.priority)} ${
                  isCompleted ? 'opacity-60' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="font-bold">{index + 1}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        {getPriorityIcon(step.priority)}
                        <Badge variant="outline" className="text-xs">
                          {step.timeEstimate}
                        </Badge>
                        {step.priority === 'critical' && (
                          <Badge variant="destructive" className="text-xs">
                            Critical
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-4">
                        {step.description}
                      </p>
                      
                      <div className="flex gap-2">
                        {action && (
                          <Button onClick={action} size="sm">
                            {step.actionText || 'Take Action'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                        
                        {!isCompleted && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStepComplete(step.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle>Quick Action Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {journeyData.steps.map((step) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={completedSteps.includes(step.id)}
                      onChange={() => handleStepComplete(step.id)}
                      className="w-4 h-4"
                    />
                    <span className={`${
                      completedSteps.includes(step.id) ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {step.title}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {step.timeEstimate}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Pro Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {venue === 'hrto' && (
                    <>
                      <li>• Be specific about dates, times, and people involved</li>
                      <li>• Explain how the treatment was connected to your protected characteristic</li>
                      <li>• Include all relevant evidence from the start</li>
                      <li>• Keep copies of everything you submit</li>
                    </>
                  )}
                  {venue === 'ltb' && (
                    <>
                      <li>• Take photos of any property damage or issues</li>
                      <li>• Keep detailed records of all communications</li>
                      <li>• Serve documents properly - get proof of service</li>
                      <li>• Attend mediation if offered - many cases settle</li>
                    </>
                  )}
                  {venue === 'small-claims' && (
                    <>
                      <li>• Be precise about the amount you're claiming</li>
                      <li>• Personal service is usually required for defendants</li>
                      <li>• Keep detailed records of your damages</li>
                      <li>• Consider costs - filing fees, service costs, etc.</li>
                    </>
                  )}
                  {venue === 'criminal' && (
                    <>
                      <li>• Never speak to police without a lawyer present</li>
                      <li>• Attend all court dates - failure to appear is a separate charge</li>
                      <li>• Keep all court documents and police paperwork</li>
                      <li>• Follow all bail conditions strictly</li>
                    </>
                  )}
                  {venue === 'family' && (
                    <>
                      <li>• Put children's best interests first in all decisions</li>
                      <li>• Keep detailed financial records and receipts</li>
                      <li>• Document all interactions with ex-spouse or CAS</li>
                      <li>• Consider mediation before going to court</li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Find Your Court/Tribunal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/tribunal-locator', { 
                    state: { venue, userSituation } 
                  })}
                  className="w-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Locate Filing Location
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};