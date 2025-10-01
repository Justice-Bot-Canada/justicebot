import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReferralProgram from "@/components/ReferralProgram";
import SEOHead from "@/components/SEOHead";
import { Gift, TrendingUp, Users, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Referrals() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Referral Program - Give $5, Get $5"
        description="Help friends get affordable legal help and earn credits. Share Justice-Bot referral link for unlimited earnings. It's a win-win!"
        keywords="referral program, earn credits, legal help referral, justice-bot rewards, legal tech incentives"
      />
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Gift className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Referral Program</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Give $5, Get $5
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Help your friends get affordable legal help and earn credits for yourself. 
              It's a win-win!
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <DollarSign className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Unlimited Earnings</h3>
              <p className="text-sm text-muted-foreground">
                No limit on how much you can earn through referrals
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Users className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Help Your Community</h3>
              <p className="text-sm text-muted-foreground">
                Share access to affordable legal help with friends and family
              </p>
            </Card>
            <Card className="p-6 text-center">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Instant Credits</h3>
              <p className="text-sm text-muted-foreground">
                Credits applied automatically when your referral signs up
              </p>
            </Card>
          </div>

          <ReferralProgram />

          {/* FAQ Section */}
          <Card className="p-8 mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">When do I get my referral credit?</h3>
                <p className="text-sm text-muted-foreground">
                  You receive your $5 credit as soon as your referred friend completes their first payment. 
                  The credit is automatically added to your account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How many people can I refer?</h3>
                <p className="text-sm text-muted-foreground">
                  There's no limit! Refer as many friends as you'd like and earn $5 for each successful referral.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How do I use my referral credits?</h3>
                <p className="text-sm text-muted-foreground">
                  Your credits are automatically applied to your next payment. You can view your current 
                  credit balance in your profile.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I refer someone who already has an account?</h3>
                <p className="text-sm text-muted-foreground">
                  No, the referral program is only for new users who sign up using your unique referral link.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
