import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Wand2, CheckCircle } from "lucide-react";

const FormPrefillDemo = () => {
  const [extractedData, setExtractedData] = useState({
    applicantName: "John Smith",
    respondentName: "ABC Property Management",
    address: "123 Main Street, Toronto, ON",
    incidentDate: "March 15, 2024",
    claimAmount: "$2,500",
    phoneNumber: "(416) 555-0123"
  });

  const [isExtracting, setIsExtracting] = useState(false);

  const simulateExtraction = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            Smart Form Pre-filling
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload documents and let AI extract information to automatically fill legal forms
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drop lease agreements, police reports, correspondence, or other evidence
            </p>
            <Button onClick={simulateExtraction} disabled={isExtracting}>
              {isExtracting ? "Analyzing..." : "Upload & Analyze"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extracted Information</CardTitle>
          <p className="text-sm text-muted-foreground">
            AI automatically identified these form fields from your documents
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicantName">Applicant Name</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="applicantName" 
                  value={extractedData.applicantName} 
                  readOnly
                  className="bg-muted"
                />
                <Badge variant="secondary" className="text-xs">
                  Auto-filled
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="respondentName">Respondent Name</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="respondentName" 
                  value={extractedData.respondentName} 
                  readOnly
                  className="bg-muted"
                />
                <Badge variant="secondary" className="text-xs">
                  Auto-filled
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="address" 
                  value={extractedData.address} 
                  readOnly
                  className="bg-muted"
                />
                <Badge variant="secondary" className="text-xs">
                  Auto-filled
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incidentDate">Incident Date</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="incidentDate" 
                  value={extractedData.incidentDate} 
                  readOnly
                  className="bg-muted"
                />
                <Badge variant="secondary" className="text-xs">
                  Auto-filled
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="claimAmount">Claim Amount</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="claimAmount" 
                  value={extractedData.claimAmount} 
                  readOnly
                  className="bg-muted"
                />
                <Badge variant="secondary" className="text-xs">
                  Auto-filled
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="phoneNumber" 
                  value={extractedData.phoneNumber} 
                  readOnly
                  className="bg-muted"
                />
                <Badge variant="secondary" className="text-xs">
                  Auto-filled
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">AI Analysis Summary</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Identified landlord-tenant dispute from lease agreement</p>
              <p>• Extracted party names from correspondence</p>
              <p>• Found monetary amount from payment records</p>
              <p>• Detected incident date from timeline of events</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormPrefillDemo;