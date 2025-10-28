import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, X, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface UpsellModalProps {
  trigger: 'feature_limit' | 'success_milestone' | 'time_saved';
  context?: string;
}

export function UpsellModal({ trigger, context }: UpsellModalProps) {
  const { user } = useAuth();
  const { hasAccess } = usePremiumAccess();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user || hasAccess || dismissed) return;

    // Check if we've shown this prompt recently
    checkAndShowPrompt();
  }, [user, hasAccess, trigger]);

  const checkAndShowPrompt = async () => {
    try {
      // Check if we showed this prompt type in last 24 hours
      const { data: recentPrompts } = await supabase
        .from('upsell_prompts' as any)
        .select('*')
        .eq('user_id', user?.id)
        .eq('prompt_type', trigger)
        .gte('shown_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('shown_at', { ascending: false })
        .limit(1);

      if (recentPrompts && recentPrompts.length > 0) {
        return; // Don't show again
      }

      // Log that we're showing this prompt
      await supabase.from('upsell_prompts' as any).insert({
        user_id: user?.id,
        prompt_type: trigger,
        shown_at: new Date().toISOString()
      } as any);

      setOpen(true);
    } catch (error) {
      console.error('Error checking upsell prompt:', error);
    }
  };

  const handleDismiss = async () => {
    try {
      await supabase
        .from('upsell_prompts' as any)
        .update({ action_taken: 'dismissed' } as any)
        .eq('user_id', user?.id)
        .eq('prompt_type', trigger)
        .order('shown_at', { ascending: false })
        .limit(1);
    } catch (error) {
      console.error('Error logging dismiss:', error);
    }
    setOpen(false);
    setDismissed(true);
  };

  const handleUpgrade = async () => {
    try {
      await supabase
        .from('upsell_prompts' as any)
        .update({ action_taken: 'clicked', converted: false } as any)
        .eq('user_id', user?.id)
        .eq('prompt_type', trigger)
        .order('shown_at', { ascending: false })
        .limit(1);
    } catch (error) {
      console.error('Error logging click:', error);
    }
    setOpen(false);
    navigate('/pricing');
  };

  const getContent = () => {
    switch (trigger) {
      case 'feature_limit':
        return {
          title: "Unlock Full Access",
          description: "You've hit the free tier limit. Upgrade to Premium for unlimited access.",
          features: [
            "Unlimited AI legal analysis",
            "All forms and templates",
            "Deadline tracking",
            "Priority support"
          ]
        };
      case 'success_milestone':
        return {
          title: "You're Making Progress!",
          description: "You've saved 3+ hours with Justice-Bot. Imagine what you could do with Premium.",
          features: [
            "Advanced case analysis",
            "Custom document generation",
            "Automated reminders",
            "Expert legal guidance"
          ]
        };
      case 'time_saved':
        return {
          title: "Save Even More Time",
          description: `${context || 'Your case is complex'}. Premium features can help you move faster.`,
          features: [
            "AI-powered form filling",
            "Smart deadline management",
            "Evidence organization",
            "Strategic recommendations"
          ]
        };
    }
  };

  const content = getContent();

  if (!user || hasAccess) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
        
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center">{content.title}</DialogTitle>
          <DialogDescription className="text-center">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {content.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDismiss} className="flex-1">
            Maybe Later
          </Button>
          <Button onClick={handleUpgrade} className="flex-1">
            Upgrade Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
