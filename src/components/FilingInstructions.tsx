import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ExternalLink, 
  FileText, 
  DollarSign, 
  Send, 
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Lightbulb
} from "lucide-react";

interface FilingInstructionsProps {
  venue: string;
  courtName?: string;
  filingUrl?: string;
  filingRequirements?: string[];
  serviceMethods?: string[];
  deadlineWarning?: string;
}

const getVenueSpecificInfo = (venue: string) => {
  switch (venue) {
    case 'hrto':
      return {
        portalName: "HRTO Online System",
        portalUrl: "https://www.sjto.gov.on.ca/hrto/",
        helpGuide: "https://www.sjto.gov.on.ca/hrto/application-process/",
        commonMistakes: [
          "Filing after the 1-year deadline",
          "Not providing enough detail about the discrimination",
          "Failing to explain how the incident relates to human rights grounds",
          "Not including relevant evidence or documentation"
        ],
        tips: [
          "Be specific about dates, times, and people involved",
          "Explain how the treatment was connected to your identity",
          "Include all relevant evidence from the start",
          "Keep copies of everything you submit"
        ]
      };
    case 'ltb':
      return {
        portalName: "Tribunals Ontario Portal",
        portalUrl: "https://tribunalsontario.ca/ltb/",
        helpGuide: "https://tribunalsontario.ca/ltb/help-information/",
        commonMistakes: [
          "Using the wrong form for your specific issue",
          "Not including required evidence (lease, receipts, photos)",
          "Missing the proper service requirements",
          "Not following up on deadlines after filing"
        ],
        tips: [
          "Choose the correct form - T2 for tenant rights, L1 for rent owing, etc.",
          "Take photos of any property damage or issues",
          "Keep detailed records of all communications",
          "Serve documents properly - get proof of service"
        ]
      };
    case 'small-claims':
      return {
        portalName: "Ontario Court Forms",
        portalUrl: "https://www.ontariocourts.ca/scj/small-claims/",
        helpGuide: "https://www.ontariocourts.ca/scj/small-claims/guides/",
        commonMistakes: [
          "Claiming more than the $35,000 limit",
          "Not calculating interest and costs properly",
          "Improper service on the defendant",
          "Missing limitation periods for your type of claim"
        ],
        tips: [
          "Be precise about the amount you're claiming",
          "Personal service is usually required for defendants",
          "Keep detailed records of your damages",
          "Consider costs - filing fees, service costs, etc."
        ]
      };
    default:
      return {
        portalName: "Court Registry",
        portalUrl: "",
        helpGuide: "",
        commonMistakes: [],
        tips: []
      };
  }
};

export const FilingInstructions: React.FC<FilingInstructionsProps> = ({
  venue,
  courtName,
  filingUrl,
  filingRequirements,
  serviceMethods,
  deadlineWarning
}) => {
  const venueInfo = getVenueSpecificInfo(venue);

  return (
    <div className="space-y-6">
      {/* Critical Deadline Warning */}
      {deadlineWarning && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-semibold">
            {deadlineWarning}
          </AlertDescription>
        </Alert>
      )}

      {/* Filing Portal Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            File Through {venueInfo.portalName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {venue === 'ltb' && "LTB applications must be filed through the Tribunals Ontario online portal."}
            {venue === 'hrto' && "HRTO applications can be filed online or by mail."}
            {venue === 'small-claims' && "Small claims can be filed in person or online in some locations."}
          </p>
          
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <a href={venueInfo.portalUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Access Filing Portal
              </a>
            </Button>
            {venueInfo.helpGuide && (
              <Button variant="outline" asChild>
                <a href={venueInfo.helpGuide} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Help Guide
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filing Requirements */}
      {filingRequirements && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Required Documents & Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {filingRequirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-1 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{requirement}</span>
                </li>
              ))}
            </ul>
            
            {venue === 'hrto' && (
              <Alert className="mt-4 border-blue-200 bg-blue-50">
                <DollarSign className="h-4 w-4" />
                <AlertDescription>
                  <strong>No filing fee required</strong> for HRTO applications. This process is free.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Service Requirements */}
      {serviceMethods && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              How to Serve Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              You must deliver a copy of your application to the other party:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {serviceMethods.map((method, index) => (
                <Badge key={index} variant="outline">
                  {method}
                </Badge>
              ))}
            </div>
            
            {venue === 'small-claims' && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Personal service required:</strong> For small claims, you must personally serve the defendant or use alternative service approved by the court.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Common Mistakes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Common Mistakes to Avoid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {venueInfo.commonMistakes.map((mistake, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm">{mistake}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Pro Tips for Success
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {venueInfo.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};