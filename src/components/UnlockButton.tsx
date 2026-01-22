import { Button } from "@/components/ui/button";
import { Unlock, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface UnlockButtonProps {
  /** What is being unlocked */
  unlockLabel: string;
  /** Price to display */
  price?: string;
  /** Is the button in loading state */
  isLoading?: boolean;
  /** Click handler */
  onClick: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'default' | 'lg' | 'sm';
  /** Additional classes */
  className?: string;
  /** Show arrow icon */
  showArrow?: boolean;
}

/**
 * UnlockButton - Replaces all "Buy" / "Purchase" buttons
 * 
 * Uses "Unlock" language which:
 * - Aligns with user intent (they want access, not ownership)
 * - Reduces fear (unlock feels reversible, buy feels permanent)
 * - Emphasizes value (they're unlocking something that exists)
 */
export function UnlockButton({
  unlockLabel,
  price,
  isLoading = false,
  onClick,
  disabled = false,
  size = 'lg',
  className,
  showArrow = true
}: UnlockButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      size={size}
      className={cn(
        "w-full font-semibold",
        size === 'lg' && "py-6 text-base",
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Unlock className="mr-2 h-5 w-5" />
          <span>
            Unlock {unlockLabel}
            {price && <span className="ml-2 opacity-90">— {price}</span>}
          </span>
          {showArrow && <ArrowRight className="ml-2 h-5 w-5" />}
        </>
      )}
    </Button>
  );
}

export default UnlockButton;
