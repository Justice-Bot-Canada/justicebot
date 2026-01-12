import { AlertTriangle, Clock, FileWarning } from "lucide-react";

interface UrgencyBlockProps {
  venue?: string;
  variant?: 'subtle' | 'prominent';
}

const urgencyMessages: Record<string, { icon: React.ElementType; message: string; detail: string }> = {
  ltb: {
    icon: Clock,
    message: "LTB deadlines are strict",
    detail: "Missing a filing deadline can result in your case being dismissed or losing your right to dispute."
  },
  hrto: {
    icon: Clock,
    message: "1-year filing limit applies",
    detail: "Human rights complaints must be filed within one year of the incident. Earlier is better."
  },
  "small-claims": {
    icon: FileWarning,
    message: "Limitation periods apply",
    detail: "Most claims must be filed within 2 years. Filing the wrong form causes delays."
  },
  family: {
    icon: AlertTriangle,
    message: "Court orders have deadlines",
    detail: "Missing a response deadline can result in default orders against you."
  },
  default: {
    icon: Clock,
    message: "Filing deadlines apply in most cases",
    detail: "Wrong form = delays or dismissal. Early action improves outcomes."
  }
};

const UrgencyBlock = ({ venue, variant = 'subtle' }: UrgencyBlockProps) => {
  const urgency = urgencyMessages[venue || 'default'] || urgencyMessages.default;
  const Icon = urgency.icon;

  if (variant === 'prominent') {
    return (
      <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-700 dark:text-amber-300">
              {urgency.message}
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
              {urgency.detail}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4 text-amber-500" />
      <span>{urgency.message}</span>
    </div>
  );
};

export default UrgencyBlock;
