import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Terms of Service"
        description="Justice-Bot Terms of Service - Legal disclaimers, service description, and user agreements for our AI-powered legal assistance platform."
        canonicalUrl="https://justice-bot.com/terms"
      />
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Critical Legal Disclaimers & User Acknowledgment</h2>
            <div className="bg-red-50 border-2 border-red-300 p-6 rounded-lg mb-4">
              <p className="font-bold text-red-800 text-lg mb-3">⚠️ MANDATORY USER ACKNOWLEDGMENT ⚠️</p>
              <p className="font-semibold text-red-700 mb-3">
                BY USING JUSTICE-BOT, YOU EXPLICITLY ACKNOWLEDGE AND AGREE TO THE FOLLOWING:
              </p>
              <ul className="text-red-700 space-y-2 font-medium">
                <li>✓ Justice-Bot is NOT a law firm and provides NO legal advice</li>
                <li>✓ No attorney-client relationship exists or will be created</li>
                <li>✓ Information is educational only and may be inaccurate or outdated</li>
                <li>✓ You assume ALL legal and financial risks of using this service</li>
                <li>✓ You will consult qualified legal counsel for all legal matters</li>
                <li>✓ You understand legal deadlines are strict and missing them can be catastrophic</li>
                <li>✓ You indemnify Justice-Bot against all claims arising from your use</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="font-semibold text-yellow-800">🚨 EMERGENCY LEGAL SITUATIONS</p>
              <p className="text-yellow-700 mt-2">
                For urgent legal matters, immediately contact: Legal Aid Ontario (1-800-668-8258) or 
                Law Society Lawyer Referral Service (1-855-947-5255). Do not rely on Justice-Bot for time-critical legal issues.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
            <p>Justice-Bot provides:</p>
            <ul>
              <li>Legal information and guidance tools</li>
              <li>Document preparation assistance</li>
              <li>Case organization and triage</li>
              <li>Forms and templates for legal proceedings</li>
            </ul>
            <p>We do NOT provide legal advice, representation, or attorney services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
            <p>By using Justice-Bot, you agree to:</p>
            <ul>
              <li>Provide accurate and truthful information</li>
              <li>Verify all information independently</li>
              <li>Consult with a qualified lawyer when needed</li>
              <li>Meet all legal deadlines and requirements</li>
              <li>Use the service lawfully and ethically</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Subscription and Billing</h2>
            <h3 className="text-xl font-semibold mb-2">Regular Subscriptions</h3>
            <ul>
              <li>Monthly: $59.99/month, billed monthly</li>
              <li>Annual: $150/year, billed annually</li>
              <li>Automatic renewal unless cancelled</li>
              <li>Cancel anytime through your account</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2 mt-4">Per-Form Purchases</h3>
            <ul>
              <li>Regular: $5.99 per form</li>
              <li>Low-income (approved): $0.99 per form</li>
              <li>One-time payment, no refunds after download</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">Low-Income Program</h3>
            <ul>
              <li>Annual subscription: $25/year (with approval)</li>
              <li>Income verification required</li>
              <li>Subject to annual re-verification</li>
              <li>False information may result in account termination</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Refund Policy</h2>
            <ul>
              <li><strong>Subscriptions:</strong> Cancel anytime, no pro-rated refunds</li>
              <li><strong>Forms:</strong> No refunds after successful download/access</li>
              <li><strong>Technical issues:</strong> Contact support within 7 days</li>
              <li><strong>Unauthorized charges:</strong> Report immediately</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Comprehensive Limitation of Liability & Indemnification</h2>
            <div className="bg-red-50 border-2 border-red-300 p-6 rounded-lg">
              <p className="font-bold text-red-800 text-lg mb-3">🛡️ MAXIMUM LEGAL PROTECTION CLAUSE</p>
              <div className="text-red-700 space-y-2">
                <p className="font-semibold">JUSTICE-BOT AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR:</p>
                <ul className="ml-4 space-y-1">
                  <li>• Any legal outcomes, case results, settlements, or judgments</li>
                  <li>• Missed deadlines, statute of limitations, or procedural failures</li>
                  <li>• Errors, omissions, or inaccuracies in any content or forms</li>
                  <li>• Direct, indirect, incidental, consequential, or punitive damages</li>
                  <li>• Lost profits, business interruption, or opportunity costs</li>
                  <li>• Legal fees, court costs, or professional service expenses</li>
                  <li>• Data loss, security breaches, or system failures</li>
                  <li>• Third-party actions or government decisions</li>
                  <li>• Any damages exceeding amounts paid in the prior 12 months</li>
                </ul>
                <div className="mt-4 p-3 bg-red-100 rounded border">
                  <p className="font-bold text-red-800">MANDATORY INDEMNIFICATION:</p>
                  <p className="text-red-700">You agree to defend, indemnify, and hold harmless Justice-Bot from any claims, lawsuits, damages, losses, costs, or expenses (including attorney fees) arising from your use of this service or violation of these terms.</p>
                </div>
              </div>
              <p className="font-bold text-red-800 mt-4 text-center">
                📋 <a href="/liability" className="underline">READ COMPLETE LIABILITY DISCLAIMERS</a> 📋
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <ul>
              <li>Justice-Bot owns all platform content and code</li>
              <li>Forms and templates are for your personal use only</li>
              <li>You retain ownership of your uploaded documents</li>
              <li>We may use anonymized data to improve services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Account Termination</h2>
            <p>We may terminate accounts for:</p>
            <ul>
              <li>Violation of these terms</li>
              <li>Fraudulent activity</li>
              <li>Abuse of the service</li>
              <li>Non-payment</li>
            </ul>
            <p>Upon termination, access to paid content ends immediately.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p>We may update these terms with 30 days notice. Continued use constitutes acceptance of changes.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p>These terms are governed by Canadian law. Disputes resolved in Ontario courts.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <ul>
              <li>Support: support@justice-bot.com</li>
              <li>Legal: legal@justice-bot.com</li>
              <li>Response time: 1-2 business days</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;