import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, FileText, CheckCircle, ListChecks, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValuePreviewProps {
  /** The identified legal issue/venue */
  venue: string;
  /** Human-readable venue title */
  venueTitle: string;
  /** Recommended form name */
  formName?: string;
  /** Form code (e.g., "T2", "Form 1") */
  formCode?: string;
  /** Document structure preview items (locked) */
  documentStructure?: string[];
  /** Steps they'll follow (locked) */
  filingSteps?: string[];
  /** Additional classes */
  className?: string;
}

/**
 * ValuePreview - Shows users what they're getting BEFORE payment
 * 
 * Displays:
 * - Identified issue/venue
 * - Correct form name
 * - Locked preview of document structure
 * - Locked preview of filing steps
 * 
 * This component exists to show value before asking for payment.
 * Payment should feel like an unlock, not a gamble.
 */
export function ValuePreview({
  venue,
  venueTitle,
  formName,
  formCode,
  documentStructure = [],
  filingSteps = [],
  className
}: ValuePreviewProps) {
  return (
    <Card className={cn("border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-background", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-1 text-xs">
                Recommended Path
              </Badge>
              <CardTitle className="text-lg">{venueTitle}</CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Form Identification */}
        {(formName || formCode) && (
          <div className="bg-muted/50 rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Your form:</span>
            </div>
            <div className="flex items-center gap-2">
              {formCode && (
                <Badge variant="outline" className="font-mono">
                  {formCode}
                </Badge>
              )}
              {formName && (
                <span className="text-sm text-foreground">{formName}</span>
              )}
            </div>
          </div>
        )}

        {/* Document Structure Preview (Locked) */}
        {documentStructure.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ListChecks className="h-4 w-4 text-primary" />
              <span>Document sections:</span>
              <Lock className="h-3 w-3 text-muted-foreground ml-auto" />
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-dashed">
              <ul className="space-y-2">
                {documentStructure.slice(0, 3).map((section, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-foreground">{section}</span>
                  </li>
                ))}
                {documentStructure.length > 3 && (
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    <span>+ {documentStructure.length - 3} more sections</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Filing Steps Preview (Locked) */}
        {filingSteps.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ListChecks className="h-4 w-4 text-primary" />
              <span>Steps you'll follow:</span>
              <Lock className="h-3 w-3 text-muted-foreground ml-auto" />
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-dashed">
              <ol className="space-y-2">
                {filingSteps.slice(0, 2).map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-foreground">{step}</span>
                  </li>
                ))}
                {filingSteps.length > 2 && (
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lock className="h-3 w-3" />
                    </span>
                    <span>+ {filingSteps.length - 2} more steps (unlock to see)</span>
                  </li>
                )}
              </ol>
            </div>
          </div>
        )}

        {/* Value Summary */}
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Unlock to get your complete document package with all sections filled and ready to file.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ValuePreview;
