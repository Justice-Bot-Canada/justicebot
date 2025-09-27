import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Liability = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8 text-destructive">Legal Liability & Disclaimers</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="bg-destructive/10 border-2 border-destructive/20 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold text-destructive mb-4">⚠️ CRITICAL LEGAL NOTICE</h2>
            <p className="font-semibold text-destructive">
              BY USING JUSTICE-BOT, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO ALL DISCLAIMERS BELOW.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">No Legal Advice</h2>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <ul className="space-y-2">
                <li><strong>Justice-Bot is NOT a law firm</strong> and does not provide legal advice</li>
                <li><strong>No attorney-client relationship</strong> is created by using this service</li>
                <li><strong>Information provided is educational only</strong> and should not be relied upon as legal advice</li>
                <li><strong>Always consult a qualified lawyer</strong> for legal advice specific to your situation</li>
                <li><strong>Laws change frequently</strong> - verify current requirements independently</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Complete Disclaimer of Liability</h2>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="font-bold text-red-800 mb-2">JUSTICE-BOT AND ITS OPERATORS ARE NOT LIABLE FOR:</p>
              <ul className="text-red-700 space-y-1">
                <li>• Any legal outcomes, case results, or court decisions</li>
                <li>• Missed deadlines, statute of limitations, or procedural failures</li>
                <li>• Errors, omissions, or inaccuracies in forms or information</li>
                <li>• Financial losses, legal fees, or damages of any kind</li>
                <li>• Rejection of documents by courts or tribunals</li>
                <li>• Technical failures, system downtime, or data loss</li>
                <li>• Third-party actions or decisions</li>
                <li>• Any consequences of using this service</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Use At Your Own Risk</h2>
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <p className="font-semibold text-orange-800">YOU ASSUME ALL RISKS WHEN USING JUSTICE-BOT INCLUDING:</p>
              <ul className="text-orange-700 mt-2">
                <li>Risk that information may be outdated, incomplete, or incorrect</li>
                <li>Risk that forms may not be accepted by courts</li>
                <li>Risk that deadlines may be missed</li>
                <li>Risk that legal strategies may be ineffective</li>
                <li>Risk of adverse legal consequences</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">No Warranties</h2>
            <p>Justice-Bot provides its services "AS IS" without any warranties:</p>
            <ul>
              <li><strong>No warranty of accuracy</strong> - Information may contain errors</li>
              <li><strong>No warranty of completeness</strong> - Information may be incomplete</li>
              <li><strong>No warranty of timeliness</strong> - Information may be outdated</li>
              <li><strong>No warranty of results</strong> - No guarantee of legal success</li>
              <li><strong>No warranty of availability</strong> - Service may be interrupted</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Limitation of Damages</h2>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="font-semibold text-blue-800">MAXIMUM LIABILITY LIMITATIONS:</p>
              <ul className="text-blue-700 mt-2">
                <li>Total liability limited to amounts you paid to Justice-Bot in the 12 months prior to the claim</li>
                <li>No liability for indirect, consequential, or punitive damages</li>
                <li>No liability for lost profits, business interruption, or opportunity costs</li>
                <li>No liability for emotional distress or personal injury</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Time-Sensitive Matters</h2>
            <div className="bg-red-100 border border-red-300 p-4 rounded-lg">
              <p className="font-bold text-red-800">⏰ URGENT LEGAL DEADLINES</p>
              <ul className="text-red-700 mt-2">
                <li>Legal deadlines are strictly enforced by courts</li>
                <li>Missing a deadline can result in loss of legal rights</li>
                <li>Justice-Bot cannot guarantee deadline compliance</li>
                <li>For urgent matters, consult a lawyer immediately</li>
                <li>Do not rely on Justice-Bot for time-critical legal actions</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
            <p>By using Justice-Bot, you agree to:</p>
            <ul>
              <li>Hold harmless Justice-Bot from any claims arising from your use of the service</li>
              <li>Indemnify Justice-Bot against any damages, losses, or legal fees</li>
              <li>Defend Justice-Bot against any lawsuits related to your use</li>
              <li>Cover all costs and expenses related to any claims</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">User Acknowledgment</h2>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <p className="font-semibold">By using Justice-Bot, you acknowledge that you:</p>
              <ul className="mt-2 space-y-1">
                <li>✓ Have read and understood all disclaimers</li>
                <li>✓ Understand this is not legal advice</li>
                <li>✓ Will verify all information independently</li>
                <li>✓ Will consult a lawyer when appropriate</li>
                <li>✓ Assume all risks of using this service</li>
                <li>✓ Agree to the liability limitations</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Governing Law & Jurisdiction</h2>
            <ul>
              <li>These disclaimers are governed by Canadian law</li>
              <li>Ontario courts have exclusive jurisdiction</li>
              <li>Any disputes must be resolved individually (no class actions)</li>
              <li>If any provision is invalid, the remainder remains in effect</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Emergency Legal Situations</h2>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="font-bold text-red-800">🚨 FOR LEGAL EMERGENCIES:</p>
              <ul className="text-red-700 mt-2">
                <li>Contact a lawyer immediately</li>
                <li>Do not rely on Justice-Bot for urgent matters</li>
                <li>Legal Aid Ontario: 1-800-668-8258</li>
                <li>Law Society Referral Service: 1-855-947-5255</li>
              </ul>
            </div>
          </section>

          <div className="text-center mt-12 p-6 bg-muted rounded-lg">
            <p className="font-semibold text-lg">
              Questions about these disclaimers? Contact: <a href="mailto:legal@justice-bot.com" className="text-primary">legal@justice-bot.com</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Liability;