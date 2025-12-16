import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TriageDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DISCOUNT_DURATION_HOURS = 48;
const DISCOUNT_CODE = 'TRIAGE50';
const DISCOUNT_PERCENT = 50;

export const TriageDiscountModal = ({ isOpen, onClose }: TriageDiscountModalProps) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isOpen) return;

    // Get or set expiry time
    let expiryTime = localStorage.getItem('triage_discount_expiry');
    if (!expiryTime) {
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + DISCOUNT_DURATION_HOURS);
      expiryTime = expiry.toISOString();
      localStorage.setItem('triage_discount_expiry', expiryTime);
      localStorage.setItem('triage_discount_code', DISCOUNT_CODE);
    }

    const updateTimer = () => {
      const now = new Date();
      const expiry = new Date(expiryTime!);
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        localStorage.removeItem('triage_discount_expiry');
        localStorage.removeItem('triage_discount_code');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClaimOffer = () => {
    localStorage.setItem('promoCode', DISCOUNT_CODE);
    onClose();
    navigate('/pricing');
  };

  const isExpired = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Special Offer Unlocked!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">
              Congratulations on completing your case assessment!
            </p>
            <p className="text-2xl font-bold text-primary">
              {DISCOUNT_PERCENT}% OFF Your First Month
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Use code: <span className="font-mono font-bold text-foreground">{DISCOUNT_CODE}</span>
            </p>
          </div>

          {!isExpired && (
            <div className="flex items-center justify-center gap-2 py-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <Clock className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Expires in:</span>
              <span className="font-mono font-bold text-destructive">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Unlimited form access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>AI-powered form prefilling</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Case merit analysis</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={handleClaimOffer} className="flex-1">
              Claim {DISCOUNT_PERCENT}% Off
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            This exclusive offer is only available for users who completed triage today.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
