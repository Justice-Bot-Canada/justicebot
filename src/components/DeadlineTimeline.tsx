import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarDays, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { addDays, addWeeks, addMonths, format, differenceInDays, isBefore } from "date-fns";

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  completed?: boolean;
  critical?: boolean;
  estimatedDuration?: string;
}

interface DeadlineTimelineProps {
  venue: string;
  incidentDate?: Date;
  onStepComplete?: (stepId: string) => void;
}

const generateTimeline = (venue: string, incidentDate: Date = new Date()): TimelineStep[] => {
  const today = new Date();
  
  switch (venue) {
    case 'hrto':
      const oneYearDeadline = addDays(incidentDate, 365);
      const isNearDeadline = differenceInDays(oneYearDeadline, today) <= 90;
      
      return [
        {
          id: 'gather-evidence',
          title: 'Gather Evidence & Documentation',
          description: 'Collect all relevant documents, emails, witness statements, and evidence',
          deadline: addWeeks(today, 2),
          estimatedDuration: '1-2 weeks',
          critical: isNearDeadline
        },
        {
          id: 'prepare-application',
          title: 'Prepare HRTO Application',
          description: 'Complete the Human Rights Application form with detailed facts',
          deadline: addWeeks(today, 4),
          estimatedDuration: '1-2 weeks'
        },
        {
          id: 'file-application',
          title: 'File Application with HRTO',
          description: 'Submit your completed application before the 1-year deadline',
          deadline: oneYearDeadline,
          estimatedDuration: '1 day',
          critical: true
        },
        {
          id: 'serve-respondent',
          title: 'Serve Respondent',
          description: 'Deliver copy of application to the other party within 30 days',
          deadline: addDays(oneYearDeadline, 30),
          estimatedDuration: '1-2 weeks'
        },
        {
          id: 'mediation',
          title: 'Attend Mediation (if ordered)',
          description: 'Participate in mediation to try to resolve the matter',
          deadline: addMonths(oneYearDeadline, 6),
          estimatedDuration: '1 day'
        }
      ];
      
    case 'ltb':
      return [
        {
          id: 'gather-evidence',
          title: 'Gather Evidence & Documentation',
          description: 'Collect lease, receipts, photos, communications with landlord',
          deadline: addWeeks(today, 1),
          estimatedDuration: '1 week'
        },
        {
          id: 'prepare-application',
          title: 'Prepare LTB Application',
          description: 'Complete the appropriate LTB form for your issue',
          deadline: addWeeks(today, 2),
          estimatedDuration: '3-5 days'
        },
        {
          id: 'file-application',
          title: 'File Application with LTB',
          description: 'Submit application and pay filing fee through Tribunals Ontario',
          deadline: addWeeks(today, 3),
          estimatedDuration: '1 day'
        },
        {
          id: 'serve-respondent',
          title: 'Serve Other Party',
          description: 'Deliver copy of application to landlord/tenant',
          deadline: addWeeks(today, 4),
          estimatedDuration: '1 week'
        },
        {
          id: 'hearing',
          title: 'Attend LTB Hearing',
          description: 'Present your case at the scheduled hearing',
          deadline: addMonths(today, 3),
          estimatedDuration: '2-4 hours'
        }
      ];
      
    case 'small-claims':
      return [
        {
          id: 'calculate-damages',
          title: 'Calculate Your Claim',
          description: 'Determine the exact amount you\'re claiming (max $35,000)',
          deadline: addWeeks(today, 1),
          estimatedDuration: '2-3 days'
        },
        {
          id: 'gather-evidence',
          title: 'Gather Supporting Evidence',
          description: 'Collect contracts, receipts, photos, and witness statements',
          deadline: addWeeks(today, 3),
          estimatedDuration: '2-3 weeks'
        },
        {
          id: 'file-claim',
          title: 'File Plaintiff\'s Claim',
          description: 'Submit claim form and pay filing fee at court office',
          deadline: addWeeks(today, 4),
          estimatedDuration: '1 day'
        },
        {
          id: 'serve-defendant',
          title: 'Serve the Defendant',
          description: 'Personally serve claim on defendant within 6 months',
          deadline: addMonths(today, 6),
          estimatedDuration: '1-2 weeks'
        },
        {
          id: 'trial',
          title: 'Attend Trial',
          description: 'Present your case to the judge',
          deadline: addMonths(today, 12),
          estimatedDuration: '1-2 hours'
        }
      ];
      
    default:
      return [];
  }
};

export const DeadlineTimeline: React.FC<DeadlineTimelineProps> = ({
  venue,
  incidentDate,
  onStepComplete
}) => {
  const timeline = generateTimeline(venue, incidentDate);
  const today = new Date();
  
  const getStepStatus = (step: TimelineStep) => {
    if (step.completed) return 'completed';
    if (isBefore(step.deadline, today)) return 'overdue';
    if (differenceInDays(step.deadline, today) <= 7) return 'urgent';
    if (differenceInDays(step.deadline, today) <= 30) return 'soon';
    return 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'urgent': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'soon': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'overdue': 
      case 'urgent': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Special warning for HRTO 1-year deadline
  const isHRTO = venue === 'hrto';
  const hrtoDeadline = incidentDate ? addDays(incidentDate, 365) : null;
  const daysUntilDeadline = hrtoDeadline ? differenceInDays(hrtoDeadline, today) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Filing Timeline & Deadlines
        </CardTitle>
        <CardDescription>
          Key steps and deadlines for your {venue.toUpperCase()} matter
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isHRTO && hrtoDeadline && daysUntilDeadline !== null && (
          <Alert className={daysUntilDeadline <= 90 ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>CRITICAL DEADLINE:</strong> You have {daysUntilDeadline} days left to file your HRTO application.
              {daysUntilDeadline <= 30 && " This deadline cannot be extended!"}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {timeline.map((step, index) => {
            const status = getStepStatus(step);
            const isLast = index === timeline.length - 1;
            
            return (
              <div key={step.id} className="relative">
                {!isLast && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
                )}
                
                <div className={`border rounded-lg p-4 ${getStatusColor(status)}`}>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getStatusIcon(status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{step.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {step.estimatedDuration}
                        </Badge>
                        {step.critical && (
                          <Badge variant="destructive" className="text-xs">
                            Critical
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm mb-3">{step.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4" />
                          <span>Due: {format(step.deadline, 'MMM d, yyyy')}</span>
                          <span className="text-muted-foreground">
                            ({differenceInDays(step.deadline, today)} days)
                          </span>
                        </div>
                        
                        {!step.completed && onStepComplete && (
                          <button
                            onClick={() => onStepComplete(step.id)}
                            className="text-sm text-primary hover:underline"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t">
          <h4 className="font-semibold mb-2">What happens next?</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            {venue === 'hrto' && (
              <>
                <li>• HRTO will review your application for completeness</li>
                <li>• You'll receive confirmation and case number</li>
                <li>• Respondent has 35 days to file their response</li>
                <li>• Mediation may be offered before proceeding to hearing</li>
              </>
            )}
            {venue === 'ltb' && (
              <>
                <li>• LTB will schedule a hearing date</li>
                <li>• You'll receive notice with hearing details</li>
                <li>• Other party can file a dispute to your application</li>
                <li>• Hearing typically occurs within 2-6 months</li>
              </>
            )}
            {venue === 'small-claims' && (
              <>
                <li>• Defendant has 20 days to file a defence</li>
                <li>• Settlement conference may be scheduled</li>
                <li>• If no settlement, trial will be scheduled</li>
                <li>• Judgment can be enforced if you win</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};