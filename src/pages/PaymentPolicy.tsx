import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, RefreshCw, Shield, Clock } from "lucide-react";
import EnhancedSEO from "@/components/EnhancedSEO";

export default function PaymentPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Payment & Refund Policy - Justice-Bot"
        description="Transparent pricing and fair refund policy. Learn about Justice-Bot's payment terms, cancellation policy, and money-back guarantee for legal services."
        canonicalUrl="https://justice-bot.com/payment-policy"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Payment & Refund Policy</h1>
          <p className="text-xl text-muted-foreground">
            Clear, transparent pricing with fair refund terms. No hidden fees, no surprises.
          </p>
          <p className="text-muted-foreground mt-4">
            <strong>Last Updated:</strong> January 2025
          </p>
        </div>

        {/* Key Highlights */}
        <div className="grid gap-4 md:grid-cols-4 mb-12">
          <Card className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-bold mb-1">No Hidden Fees</h3>
            <p className="text-sm text-muted-foreground">All costs disclosed upfront</p>
          </Card>
          <Card className="p-6 text-center">
            <RefreshCw className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-bold mb-1">Easy Cancellation</h3>
            <p className="text-sm text-muted-foreground">Cancel anytime online</p>
          </Card>
          <Card className="p-6 text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-bold mb-1">Secure Payment</h3>
            <p className="text-sm text-muted-foreground">PCI-DSS compliant</p>
          </Card>
          <Card className="p-6 text-center">
            <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-bold mb-1">7-Day Guarantee</h3>
            <p className="text-sm text-muted-foreground">Full refund within 7 days</p>
          </Card>
        </div>

        {/* Pricing Structure */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Pricing Structure</h2>
          
          <div className="space-y-4 mb-8">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Free Tier</h3>
                  <p className="text-muted-foreground">Basic legal information and guidance</p>
                </div>
                <Badge variant="secondary">$0 CAD</Badge>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Access to legal information library</li>
                <li>✓ Basic AI chatbot assistance</li>
                <li>✓ Document checklists</li>
                <li>✓ Court location finder</li>
              </ul>
            </Card>

            <Card className="p-6 border-primary">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Monthly Subscription</h3>
                  <p className="text-muted-foreground">Full access to platform features</p>
                </div>
                <Badge className="bg-primary">$5.99 CAD/month</Badge>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>✓ Everything in Free tier</li>
                <li>✓ Unlimited AI legal analysis</li>
                <li>✓ Document generation & auto-fill</li>
                <li>✓ Case progress tracking</li>
                <li>✓ Priority support</li>
                <li>✓ Evidence organization tools</li>
              </ul>
              <p className="text-xs text-muted-foreground">
                Billed monthly. Cancel anytime. Prorated refunds available.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">One-Time Forms</h3>
                  <p className="text-muted-foreground">Purchase specific legal forms as needed</p>
                </div>
                <Badge variant="outline">$9.99 - $29.99 CAD</Badge>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Professional court-ready documents</li>
                <li>✓ Automatic form completion from your case data</li>
                <li>✓ Filing instructions included</li>
                <li>✓ Lifetime access to purchased forms</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Accepted Payment Methods</h2>
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3">Credit & Debit Cards</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Visa</li>
                  <li>✓ Mastercard</li>
                  <li>✓ American Express</li>
                  <li>✓ Discover</li>
                  <li>✓ Interac Debit (Canadian cards)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3">Digital Wallets</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ PayPal</li>
                  <li>✓ Apple Pay</li>
                  <li>✓ Google Pay</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Security:</strong> All payments are processed through PCI-DSS Level 1 compliant 
                payment processors (Stripe/PayPal). We never store your full credit card information.
              </p>
            </div>
          </Card>
        </section>

        {/* Refund Policy */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Refund Policy</h2>
          
          <Card className="p-6 mb-4 bg-green-50 border-green-200">
            <h3 className="font-bold text-green-800 mb-3">7-Day Money-Back Guarantee</h3>
            <p className="text-green-700 mb-3">
              If you're not satisfied with Justice-Bot within the first 7 days of your subscription, 
              we'll provide a full refund—no questions asked.
            </p>
            <p className="text-sm text-green-600">
              Simply email support@justice-bot.com or use the cancellation button in your account settings.
            </p>
          </Card>

          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold mb-3">Monthly Subscription Refunds</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Within 7 days:</strong> Full refund, no questions asked</li>
                <li><strong>After 7 days:</strong> Prorated refund for unused portion of the month</li>
                <li><strong>Cancellation:</strong> Access continues until end of billing period</li>
                <li><strong>Processing time:</strong> 5-10 business days to original payment method</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-3">One-Time Form Purchase Refunds</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Before download:</strong> Full refund available</li>
                <li><strong>Technical issues:</strong> Full refund if form doesn't work as described</li>
                <li><strong>After download:</strong> No refund (digital product limitation)</li>
                <li><strong>Exceptions:</strong> Case-by-case review for extenuating circumstances</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Cancellation */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Cancellation Policy</h2>
          <Card className="p-6">
            <h3 className="font-bold mb-3">How to Cancel Your Subscription</h3>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">1. Online Cancellation (Instant)</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Log in to your Justice-Bot account</li>
                  <li>Go to Settings → Subscription</li>
                  <li>Click "Cancel Subscription"</li>
                  <li>Confirm cancellation</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">2. Email Cancellation</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Email: support@justice-bot.com</li>
                  <li>Subject: "Cancel Subscription"</li>
                  <li>Include your account email</li>
                  <li>Processed within 24 hours</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-blue-700">
                  <strong>Important:</strong> After cancellation, you'll retain access until the end of your 
                  current billing period. You will not be charged for subsequent periods.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Billing Questions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Common Billing Questions</h2>
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold mb-2">When will I be charged?</h3>
              <p className="text-muted-foreground">
                Subscription charges occur on the same day each month based on your signup date. 
                You'll receive an email receipt for every charge.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-muted-foreground">
                Yes! Changes take effect immediately. If upgrading mid-month, you'll be charged a 
                prorated amount. Downgrades are processed at the end of the current billing period.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-2">What if my payment fails?</h3>
              <p className="text-muted-foreground">
                We'll retry the payment 3 times over 7 days and send email notifications. If payment 
                continues to fail, your account will be downgraded to the free tier, but your data 
                remains saved.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-2">Do you offer discounts or special pricing?</h3>
              <p className="text-muted-foreground">
                Yes! We have a low-income program offering 50-100% discounts for eligible users. 
                We also offer student discounts and nonprofit organization rates. Contact us for details.
              </p>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10">
            <h2 className="text-2xl font-bold mb-4">Questions About Billing?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help with any payment or refund questions.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground">support@justice-bot.com</p>
                <p className="text-sm text-muted-foreground">Response within 24 hours</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Billing Inquiries</h3>
                <p className="text-muted-foreground">billing@justice-bot.com</p>
                <p className="text-sm text-muted-foreground">Response within 48 hours</p>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
