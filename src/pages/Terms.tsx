import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Important Legal Disclaimer</h2>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="font-semibold text-yellow-800">WARNING: This is Information, Not Legal Advice</p>
              <ul className="text-yellow-700 mt-2">
                <li>Justice-Bot is NOT a law firm and does NOT provide legal advice</li>
                <li>No lawyer-client relationship is created by using this service</li>
                <li>The information provided is for educational purposes only</li>
                <li>Legal deadlines are strict - consult a lawyer for time-sensitive matters</li>
                <li>For emergencies or urgent legal matters, contact a lawyer immediately</li>
              </ul>
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
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="font-semibold text-red-800">IMPORTANT LIABILITY LIMITATIONS</p>
              <ul className="text-red-700 mt-2">
                <li>Justice-Bot is not liable for legal outcomes or missed deadlines</li>
                <li>You use this service at your own risk</li>
                <li>Maximum liability limited to amounts paid to us in the past 12 months</li>
                <li>No warranty that information is complete or current</li>
                <li>Laws change frequently - verify current requirements</li>
                <li>No liability for consequential, indirect, or punitive damages</li>
                <li>User must indemnify Justice-Bot against any claims</li>
              </ul>
              <p className="font-bold text-red-800 mt-2">
                See our <a href="/liability" className="underline">Legal Liability page</a> for complete disclaimers.
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