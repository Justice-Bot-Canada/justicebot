import { useState, useEffect } from "react";
import { Copy, DollarSign, Users, Gift, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
// ❌ REMOVED - Sonner causing runtime errors
// import { toast } from "sonner";
import { toast } from "@/lib/toast-stub";
import { useAuth } from "@/hooks/useAuth";

interface ReferralData {
  code: string;
  uses_count: number;
  total_credits_earned: number;
  referrals: Array<{
    id: string;
    status: string;
    credit_amount: number;
    created_at: string;
  }>;
  totalCredits: number;
}

export default function ReferralProgram() {
  const { user } = useAuth();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  const loadReferralData = async () => {
    if (!user) return;

    setLoading(true);

    // Get or create referral code
    let { data: codeData, error: codeError } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (codeError || !codeData) {
      // Create new referral code
      const code = generateReferralCode();
      const { data: newCode, error: createError } = await supabase
        .from('referral_codes')
        .insert({ user_id: user.id, code })
        .select()
        .single();

      if (createError) {
        console.error('Error creating referral code:', createError);
        toast.error('Failed to generate referral code');
        setLoading(false);
        return;
      }
      codeData = newCode;
    }

    // Get referrals
    const { data: referrals, error: referralsError } = await (supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false }) as any);

    if (referralsError) {
      console.error('Error loading referrals:', referralsError);
    }

    // Get total credits
    const { data: credits, error: creditsError } = await (supabase
      .from('user_credits')
      .select('amount')
      .eq('user_id', user.id) as any);

    const totalCredits = credits?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;

    setReferralData({
      code: codeData.code,
      uses_count: codeData.uses_count,
      total_credits_earned: Number(codeData.total_credits_earned),
      referrals: referrals || [],
      totalCredits,
    });

    setLoading(false);
  };

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralData?.code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform: string) => {
    const link = `${window.location.origin}?ref=${referralData?.code}`;
    const text = encodeURIComponent('Get $5 off legal help with Justice-Bot! Use my referral link:');
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(link)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
      email: `mailto:?subject=${text}&body=${text} ${link}`,
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <Gift className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-semibold mb-2">Sign in to refer friends</h3>
        <p className="text-muted-foreground">
          Earn $5 credit for every friend you refer. They get $5 off too!
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-6 bg-muted rounded mb-4 w-1/3" />
        <div className="h-24 bg-muted rounded mb-4" />
        <div className="h-32 bg-muted rounded" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <DollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-3xl font-bold text-primary mb-1">
            ${referralData?.totalCredits.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">Total Earned</p>
        </Card>
        <Card className="p-6 text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-3xl font-bold mb-1">
            {referralData?.uses_count}
          </div>
          <p className="text-sm text-muted-foreground">Friends Referred</p>
        </Card>
        <Card className="p-6 text-center">
          <Gift className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-3xl font-bold mb-1">
            ${(referralData?.uses_count || 0) * 5}
          </div>
          <p className="text-sm text-muted-foreground">Friends Saved</p>
        </Card>
      </div>

      {/* Referral Link Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Referral Link</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Share this link with friends. When they sign up and make their first payment, 
          you both get $5 credit!
        </p>
        
        <div className="flex gap-2 mb-4">
          <Input 
            value={`${window.location.origin}?ref=${referralData?.code}`}
            readOnly
            className="font-mono text-sm"
          />
          <Button onClick={copyReferralLink} className="flex-shrink-0 min-h-[44px]" aria-label={copied ? "Link copied" : "Copy referral link"}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" aria-hidden="true" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
                Copy Link
              </>
            )}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => shareOnSocial('twitter')}>
            Share on X
          </Button>
          <Button variant="outline" size="sm" onClick={() => shareOnSocial('facebook')}>
            Share on Facebook
          </Button>
          <Button variant="outline" size="sm" onClick={() => shareOnSocial('email')}>
            Email
          </Button>
        </div>
      </Card>

      {/* Referral History */}
      {referralData && referralData.referrals.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Referral History</h3>
          <div className="space-y-3">
            {referralData.referrals.map((referral) => (
              <div 
                key={referral.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={referral.status === 'credited' ? 'default' : 'secondary'}>
                      {referral.status}
                    </Badge>
                    <span className="text-sm">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">
                    +${referral.credit_amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* How it Works */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="text-lg font-semibold mb-4">How it Works</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-medium mb-1">Share Your Link</h4>
              <p className="text-sm text-muted-foreground">
                Send your unique referral link to friends who need legal help
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-medium mb-1">They Sign Up</h4>
              <p className="text-sm text-muted-foreground">
                Your friend creates an account and gets $5 off their first payment
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-medium mb-1">You Both Win</h4>
              <p className="text-sm text-muted-foreground">
                You get $5 credit added to your account automatically
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
