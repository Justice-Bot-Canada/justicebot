import { FileText, CheckCircle, Clock, ArrowRight, Scale } from "lucide-react";

interface BeforeYouPayExplanationProps {
  /** What the document/product is */
  productName: string;
  /** Why it matters - the core benefit */
  whyItMatters: string;
  /** What problem it solves */
  problemItSolves: string;
  /** What they get immediately after paying */
  immediateDeliverable: string;
  /** Optional: venue/tribunal name for context */
  venue?: string;
  /** Variant: compact for inline use, full for standalone */
  variant?: 'compact' | 'full';
}

/**
 * BeforeYouPayExplanation - Mandatory component above ALL payment buttons
 * 
 * Explains in plain language:
 * - What the document is
 * - Why it matters  
 * - What problem it solves
 * - What user gets immediately after paying
 * 
 * No legal jargon. No marketing fluff.
 */
export function BeforeYouPayExplanation({
  productName,
  whyItMatters,
  problemItSolves,
  immediateDeliverable,
  venue,
  variant = 'full'
}: BeforeYouPayExplanationProps) {
  if (variant === 'compact') {
    return (
      <div className="bg-muted/50 rounded-lg p-4 space-y-3 border">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-medium text-sm text-foreground">{productName}</p>
            <p className="text-xs text-muted-foreground">{problemItSolves}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ArrowRight className="h-3 w-3" />
          <span>{immediateDeliverable}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-lg p-5 space-y-4 border border-border">
      <h4 className="font-semibold text-foreground flex items-center gap-2">
        <Scale className="h-4 w-4 text-primary" />
        What you're unlocking
      </h4>
      
      <div className="space-y-3">
        {/* What it is */}
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">{productName}</p>
            {venue && (
              <p className="text-xs text-muted-foreground">For {venue}</p>
            )}
          </div>
        </div>
        
        {/* Why it matters */}
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground">{whyItMatters}</p>
        </div>
        
        {/* Problem it solves */}
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground">{problemItSolves}</p>
        </div>
        
        {/* Immediate deliverable */}
        <div className="flex items-start gap-3 bg-primary/5 rounded-md p-3">
          <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">After payment:</p>
            <p className="text-sm text-muted-foreground">{immediateDeliverable}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeforeYouPayExplanation;
