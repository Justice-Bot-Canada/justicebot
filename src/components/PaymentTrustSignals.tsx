import { Shield, CreditCard, Clock, MapPin, UserCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentTrustSignalsProps {
  /** Show one-time payment message (vs subscription) */
  showOneTimePayment?: boolean;
  /** Show instant access message */
  showInstantAccess?: boolean;
  /** Show no hidden fees message */
  showNoHiddenFees?: boolean;
  /** Show Canadian-specific message */
  showCanadianBuilt?: boolean;
  /** Show self-represented user message */
  showSelfRepresented?: boolean;
  /** Variant: horizontal (inline), vertical (stacked), minimal (icons only) */
  variant?: 'horizontal' | 'vertical' | 'minimal';
  /** Additional classes */
  className?: string;
}

/**
 * PaymentTrustSignals - Consistent trust messaging near payment decisions
 * 
 * Must be visible near every payment button to:
 * - Reduce purchase anxiety
 * - Build trust with vulnerable users
 * - Clarify what they're getting
 */
export function PaymentTrustSignals({
  showOneTimePayment = true,
  showInstantAccess = true,
  showNoHiddenFees = true,
  showCanadianBuilt = true,
  showSelfRepresented = false,
  variant = 'vertical',
  className
}: PaymentTrustSignalsProps) {
  const signals = [
    showOneTimePayment && {
      icon: CreditCard,
      text: "One-time payment",
      subtext: "No subscription, no recurring charges"
    },
    showInstantAccess && {
      icon: Clock,
      text: "Instant access",
      subtext: "Available immediately after payment"
    },
    showNoHiddenFees && {
      icon: Lock,
      text: "No hidden fees",
      subtext: "The price you see is the price you pay"
    },
    showCanadianBuilt && {
      icon: MapPin,
      text: "Built for Canadian courts and tribunals",
      subtext: "Province-specific forms and procedures"
    },
    showSelfRepresented && {
      icon: UserCheck,
      text: "Designed for self-represented users",
      subtext: "No lawyer required"
    },
  ].filter(Boolean);

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center justify-center gap-4 text-xs text-muted-foreground", className)}>
        {showOneTimePayment && (
          <div className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            <span>One-time</span>
          </div>
        )}
        {showInstantAccess && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Instant access</span>
          </div>
        )}
        {showNoHiddenFees && (
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>No hidden fees</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground", className)}>
        {signals.map((signal, i) => {
          if (!signal) return null;
          const Icon = signal.icon;
          return (
            <div key={i} className="flex items-center gap-1.5">
              <Icon className="h-4 w-4 text-green-600" />
              <span>{signal.text}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {signals.map((signal, i) => {
        if (!signal) return null;
        const Icon = signal.icon;
        return (
          <div key={i} className="flex items-start gap-2">
            <Icon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm text-foreground">{signal.text}</span>
              {signal.subtext && (
                <p className="text-xs text-muted-foreground">{signal.subtext}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * LegalDisclaimer - Required near payment decisions
 * Clear, non-scary, honest about what we are and aren't
 */
export function LegalDisclaimer({ className }: { className?: string }) {
  return (
    <div className={cn(
      "text-xs text-muted-foreground text-center p-3 bg-muted/30 rounded-lg border border-border/50",
      className
    )}>
      <p>
        <strong>Justice-Bot provides legal information and document preparation tools.</strong>
        <br />
        It does not provide legal advice or replace a lawyer.
      </p>
    </div>
  );
}

export default PaymentTrustSignals;
