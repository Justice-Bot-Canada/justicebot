import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Scale, 
  CheckCircle, 
  AlertTriangle, 
  ChevronDown, 
  ChevronRight,
  Compass,
  FileText,
  Clock,
  Shield,
  ArrowRight,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DecisionResult, MeritResult, Pathway, FormRecommendation, NextStep } from '@/types/decisionEngine';

interface CaseAssessmentScreenProps {
  result: DecisionResult;
  onGenerateForm: (form: FormRecommendation) => void;
  onUploadEvidence: () => void;
  isPremium?: boolean;
  caseId?: string;
}

// ==================
// MERIT SCORE CARD
// ==================
function MeritScoreCard({ merit }: { merit: MeritResult }) {
  const [showDetails, setShowDetails] = useState(false);

  const bandColors = {
    HIGH: 'text-green-600 bg-green-50 border-green-200',
    MEDIUM: 'text-amber-600 bg-amber-50 border-amber-200',
    LOW: 'text-red-600 bg-red-50 border-red-200',
  };

  const bandLabels = {
    HIGH: 'Strong Case',
    MEDIUM: 'Viable Case',
    LOW: 'Weak Case',
  };

  const bandDescriptions = {
    HIGH: 'Based on your evidence, your claims appear legally viable and supported.',
    MEDIUM: 'Your case has merit but could be strengthened with additional evidence.',
    LOW: 'Your case as presented has gaps. Understanding them is the first step to addressing them.',
  };

  const progressColor = merit.band === 'HIGH' ? 'bg-green-500' : merit.band === 'MEDIUM' ? 'bg-amber-500' : 'bg-red-500';

  return (
    <Card className={cn('border-2', bandColors[merit.band])}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Your Case Assessment
          </CardTitle>
          <div className={cn('flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold', bandColors[merit.band])}>
            <span className="text-3xl">{merit.score}</span>
            <span className="text-sm opacity-70">/ 100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Band label and progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge className={cn('text-sm px-3 py-1', bandColors[merit.band])}>
              {bandLabels[merit.band]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Confidence: {Math.round(merit.confidence * 100)}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn('h-full rounded-full transition-all', progressColor)} 
              style={{ width: `${merit.score}%` }} 
            />
          </div>
          <p className="text-sm text-muted-foreground">{bandDescriptions[merit.band]}</p>
        </div>

        {/* Why This Score - Always visible */}
        <div className="bg-background rounded-lg p-4 border">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Why You Got This Score
          </h4>
          
          {merit.reasons.length > 0 && (
            <div className="mb-3">
              <ul className="space-y-1.5">
                {merit.reasons.slice(0, 5).map((reason, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* What's Missing */}
        {merit.missing.length > 0 && (
          <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-200">
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              What's Missing
            </h4>
            <ul className="space-y-1.5">
              {merit.missing.slice(0, 4).map((item, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-amber-600 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Detailed Breakdown (collapsible) */}
        <Collapsible open={showDetails} onOpenChange={setShowDetails}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full pt-2 border-t">
            <ChevronDown className={cn('h-4 w-4 transition-transform', showDetails && 'rotate-180')} />
            View score breakdown
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3">
            <BreakdownItem label="Evidence Strength" value={merit.breakdown.evidence_strength} max={30} />
            <BreakdownItem label="Legal Fit" value={merit.breakdown.legal_fit} max={25} />
            <BreakdownItem label="Timeline Quality" value={merit.breakdown.timeline_quality} max={15} />
            <BreakdownItem label="Credibility" value={merit.breakdown.credibility} max={20} />
            {merit.breakdown.risk_flags < 0 && (
              <div className="flex items-center justify-between text-sm text-red-600">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Adjustments
                </span>
                <span className="font-medium">{merit.breakdown.risk_flags}</span>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

function BreakdownItem({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.max(0, (value / max) * 100);
  const color = pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ==================
// PATHWAY CARDS
// ==================
function PathwaySection({ pathways, onSelectPathway }: { 
  pathways: DecisionResult['pathways']; 
  onSelectPathway?: (pathway: Pathway) => void;
}) {
  const [expandedSecondary, setExpandedSecondary] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Compass className="h-5 w-5 text-primary" />
        Recommended Legal Pathway
      </h3>

      {/* Primary Pathway */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <Badge className="bg-primary text-primary-foreground mb-2">Primary Path</Badge>
              <h4 className="font-semibold text-lg">{pathways.primary.title}</h4>
            </div>
            <RiskBadge level={pathways.primary.risk_level} />
          </div>
          
          <ul className="space-y-1 mb-4">
            {pathways.primary.why.map((reason, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {pathways.primary.estimated_timeline && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {pathways.primary.estimated_timeline}
              </span>
            )}
            {pathways.primary.filing_fee && (
              <span>Filing: {pathways.primary.filing_fee}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Secondary Pathways */}
      {pathways.secondary.length > 0 && (
        <Collapsible open={expandedSecondary} onOpenChange={setExpandedSecondary}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronDown className={cn('h-4 w-4 transition-transform', expandedSecondary && 'rotate-180')} />
            {pathways.secondary.length} additional pathway{pathways.secondary.length > 1 ? 's' : ''} available
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3">
            {pathways.secondary.map((pathway, i) => (
              <Card key={i} className="border">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant="secondary" className="mb-1">Secondary</Badge>
                      <h4 className="font-medium">{pathway.title}</h4>
                    </div>
                    <RiskBadge level={pathway.risk_level} />
                  </div>
                  <p className="text-sm text-muted-foreground">{pathway.why[0]}</p>
                </CardContent>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Escalation Options */}
      {pathways.escalation.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">⚠️ Escalation Options</p>
          {pathways.escalation.map((pathway, i) => (
            <Card key={i} className="border border-amber-200 bg-amber-50/50">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Badge variant="outline" className="mb-1 border-amber-500 text-amber-700">Escalation</Badge>
                    <h4 className="font-medium">{pathway.title}</h4>
                  </div>
                </div>
                <ul className="text-sm text-muted-foreground">
                  {pathway.why.map((reason, j) => (
                    <li key={j}>• {reason}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RiskBadge({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const colors = {
    LOW: 'bg-green-100 text-green-700 border-green-200',
    MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
    HIGH: 'bg-red-100 text-red-700 border-red-200',
  };
  const labels = {
    LOW: 'Low Risk',
    MEDIUM: 'Medium Risk',
    HIGH: 'High Risk',
  };
  
  return <Badge variant="outline" className={colors[level]}>{labels[level]}</Badge>;
}

// ==================
// FORM RECOMMENDATIONS
// ==================
function FormRecommendationsSection({ 
  forms, 
  onGenerate,
  isPremium 
}: { 
  forms: FormRecommendation[];
  onGenerate: (form: FormRecommendation) => void;
  isPremium?: boolean;
}) {
  if (forms.length === 0) return null;

  const primary = forms.find(f => f.recommended_level === 'PRIMARY');
  const supporting = forms.filter(f => f.recommended_level === 'SUPPORTING');
  const optional = forms.filter(f => f.recommended_level === 'OPTIONAL');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        Recommended Forms
      </h3>

      {/* Primary Form - Prominent */}
      {primary && (
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge className="bg-green-600 text-white mb-2">Recommended</Badge>
                <h4 className="font-semibold text-lg">{primary.form_code} – {primary.label}</h4>
                
                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">What it does:</p>
                    <ul className="text-sm">
                      {primary.what_it_does.slice(0, 3).map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => onGenerate(primary)}
                className="ml-4 gap-2"
                size="lg"
              >
                <Sparkles className="h-4 w-4" />
                Generate {primary.form_code}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supporting Forms */}
      {supporting.length > 0 && (
        <div className="space-y-2">
          {supporting.map((form, i) => (
            <Card key={i} className="border">
              <CardContent className="py-3 flex items-center justify-between">
                <div>
                  <Badge variant="secondary" className="mb-1">Supporting</Badge>
                  <h4 className="font-medium">{form.form_code} – {form.label}</h4>
                  <p className="text-sm text-muted-foreground">{form.what_it_does[0]}</p>
                </div>
                <Button variant="outline" onClick={() => onGenerate(form)} className="gap-2">
                  <Zap className="h-4 w-4" />
                  Generate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Optional Forms (collapsed) */}
      {optional.length > 0 && (
        <Collapsible>
          <CollapsibleTrigger className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
            <ChevronDown className="h-4 w-4" />
            {optional.length} optional form{optional.length > 1 ? 's' : ''}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {optional.map((form, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm">{form.form_code} – {form.label}</span>
                <Button variant="ghost" size="sm" onClick={() => onGenerate(form)}>
                  Generate
                </Button>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

// ==================
// NEXT STEPS / PLAN OF ACTION
// ==================
function NextStepsSection({ steps, onStepAction }: { 
  steps: NextStep[];
  onStepAction?: (step: NextStep) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        Your Plan of Action
      </h3>

      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.step} className="flex items-center gap-4 p-3 rounded-lg border bg-background">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
              step.completed ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
            )}>
              {step.completed ? <CheckCircle className="h-5 w-5" /> : step.step}
            </div>
            <div className="flex-1">
              <p className={cn('font-medium', step.completed && 'line-through text-muted-foreground')}>
                {step.text}
              </p>
            </div>
            {!step.completed && step.action === 'GENERATE' && (
              <Button size="sm" variant="outline" onClick={() => onStepAction?.(step)}>
                Do Now
              </Button>
            )}
            {!step.completed && step.action === 'COLLECT' && (
              <Button size="sm" variant="outline" onClick={() => onStepAction?.(step)}>
                Upload
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================
// PAYWALL INFO
// ==================
function PaywallInfo() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="py-4">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h4 className="font-semibold mb-2">What's Included Free:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>✓ Full merit score and explanation</li>
              <li>✓ Recommended legal pathway</li>
              <li>✓ Evidence checklist</li>
              <li>✓ Plan of action</li>
            </ul>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Paid Unlocks:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>🔒 Auto-filled tribunal forms</li>
              <li>🔒 PDF/DOCX download</li>
              <li>🔒 Filing + service package</li>
              <li>🔒 Hearing prep guide</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================
// MAIN COMPONENT
// ==================
export function CaseAssessmentScreen({ 
  result, 
  onGenerateForm, 
  onUploadEvidence,
  isPremium = false,
  caseId
}: CaseAssessmentScreenProps) {
  const handleStepAction = (step: NextStep) => {
    if (step.action === 'COLLECT') {
      onUploadEvidence();
    } else if (step.action === 'GENERATE' && result.forms.length > 0) {
      onGenerateForm(result.forms[0]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Section 1: Merit Score - Always visible */}
      <MeritScoreCard merit={result.merit} />

      {/* Section 2: Legal Pathways */}
      <PathwaySection pathways={result.pathways} />

      {/* Section 3: Form Recommendations */}
      <FormRecommendationsSection 
        forms={result.forms} 
        onGenerate={onGenerateForm}
        isPremium={isPremium}
      />

      {/* Section 4: Plan of Action */}
      <NextStepsSection 
        steps={result.next_steps} 
        onStepAction={handleStepAction}
      />

      {/* Paywall Info - shown for non-premium users */}
      {!isPremium && <PaywallInfo />}
    </div>
  );
}

export default CaseAssessmentScreen;
