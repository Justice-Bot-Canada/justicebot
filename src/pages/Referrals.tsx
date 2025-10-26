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

          {/* Eligibility Section */}
          <Card className="p-8 mt-12 border-primary/20">
            <h2 className="text-2xl font-bold mb-6 text-center">Eligibility & Program Details</h2>
            <div className="space-y-4 mb-8">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">✓</span> Who Can Participate?
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• All registered Justice-Bot users in good standing</li>
                  <li>• Both free and paid subscribers eligible to refer</li>
                  <li>• No minimum account age required</li>
                </ul>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">✓</span> Referral Standards
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  We maintain high standards for our referral program:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Referrals must be genuine — spam or fake accounts will result in credit forfeiture</li>
                  <li>• Credits earned through fraudulent means will be revoked and may result in account suspension</li>
                  <li>• We reserve the right to audit referrals and adjust credits if terms are violated</li>
                  <li>• Referrals should be to people who would genuinely benefit from Justice-Bot services</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3 text-center">Affiliate Disclosure</h3>
              <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
                Justice-Bot's referral program provides monetary credits as an incentive for users to share our service. 
                Credits earned through referrals are applied to your Justice-Bot account and can be used toward any paid 
                features or subscriptions. This is a performance-based program where you earn credits only when referred 
                users complete their first payment. We are transparent about this relationship and ensure all users 
                understand the terms before participating.
              </p>
            </div>
          </Card>

          {/* FAQ Section */}
          <Card className="p-8 mt-8">
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
              <div>
                <h3 className="font-semibold mb-2">What happens if my referral violates terms?</h3>
                <p className="text-sm text-muted-foreground">
                  Fraudulent referrals or spam activity will result in credit forfeiture. Repeated violations may lead to account suspension.
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
