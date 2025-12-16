import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, FileText, Clock, Gift, ArrowRight } from 'lucide-react';

interface UnfinishedWork {
  type: 'draft' | 'triage' | 'case';
  title: string;
  path: string;
  lastUpdated?: string;
}

export function ChurnPreventionNudge() {
  const { user } = useAuth();
  const { hasAccess } = usePremiumAccess();
  
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const [unfinishedWork, setUnfinishedWork] = useState<UnfinishedWork[]>([]);
  const [showDiscountOffer, setShowDiscountOffer] = useState(false);
  const [daysInactive, setDaysInactive] = useState(0);

  useEffect(() => {
    if (!user || hasAccess) return;

    const checkUnfinishedWork = async () => {
      const work: UnfinishedWork[] = [];

      // Check for saved triage in localStorage
      const savedTriage = localStorage.getItem('triageAnswers');
      if (savedTriage) {
        work.push({
          type: 'triage',
          title: 'Continue your case assessment',
          path: '/triage'
        });
      }

      // Check for incomplete cases in database
      const { data: cases } = await supabase
        .from('cases')
        .select('id, title, status, updated_at')
        .eq('user_id', user.id)
        .in('status', ['draft', 'pending', 'active'])
        .order('updated_at', { ascending: false })
        .limit(3);

      if (cases && cases.length > 0) {
        cases.forEach(c => {
          work.push({
            type: 'case',
            title: c.title || 'Untitled Case',
            path: `/journey?caseId=${c.id}`,
            lastUpdated: c.updated_at
          });
        });
      }

      // Check for draft documents
      const { data: docs } = await supabase
        .from('documents')
        .select('id, form_key, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(2);

      if (docs && docs.length > 0) {
        docs.forEach(d => {
          work.push({
            type: 'draft',
            title: `Draft: ${d.form_key}`,
            path: '/forms',
            lastUpdated: d.updated_at
          });
        });
      }

      setUnfinishedWork(work);

      // Check user inactivity for discount offer
      const { data: profile } = await supabase
        .from('profiles')
        .select('created_at, updated_at')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        const lastActivity = new Date(profile.updated_at || profile.created_at);
        const daysSince = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        setDaysInactive(daysSince);
        
        // Show discount after 3+ days inactive with unfinished work
        if (daysSince >= 3 && work.length > 0) {
          setShowDiscountOffer(true);
        }
      }
    };

    // Check if already dismissed this session
    const dismissedKey = `churn_nudge_dismissed_${user.id}`;
    if (sessionStorage.getItem(dismissedKey)) {
      setDismissed(true);
      return;
    }

    checkUnfinishedWork();
  }, [user, hasAccess]);

  const handleDismiss = () => {
    if (user) {
      sessionStorage.setItem(`churn_nudge_dismissed_${user.id}`, 'true');
    }
    setDismissed(true);
  };

  const handleClaimDiscount = () => {
    localStorage.setItem('promoCode', 'COMEBACK7');
    navigate('/pricing');
  };

  const handleContinueWork = (path: string) => {
    navigate(path);
  };

  // Don't show if dismissed, no user, has premium, or no unfinished work
  if (dismissed || !user || hasAccess || unfinishedWork.length === 0) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-primary/20 bg-background animate-in slide-in-from-bottom-4">
      <CardContent className="p-4">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Clock className="h-5 w-5" />
            <span className="font-semibold text-sm">Pick up where you left off</span>
          </div>

          <div className="space-y-2">
            {unfinishedWork.slice(0, 2).map((work, index) => (
              <button
                key={index}
                onClick={() => handleContinueWork(work.path)}
                className="w-full flex items-center gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted text-left text-sm transition-colors"
              >
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate flex-1">{work.title}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>

          {showDiscountOffer && (
            <div className="mt-3 p-3 rounded-md bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Welcome back offer!</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Get 50% off your first month with code <strong>COMEBACK7</strong>. 
                Valid for 7 days.
              </p>
              <Button 
                size="sm" 
                onClick={handleClaimDiscount}
                className="w-full"
              >
                Claim 50% Off
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
