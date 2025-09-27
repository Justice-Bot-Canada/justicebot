import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy & Data Protection</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          {/* HIPAA-Level Security Notice */}
          <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg mb-8 not-prose">
            <h2 className="text-xl font-bold text-blue-800 mb-3">🔒 Enterprise-Grade Security & Privacy Protection</h2>
            <p className="text-blue-700 font-semibold mb-2">
              Justice-Bot implements HIPAA-level security standards to protect your sensitive legal information:
            </p>
            <ul className="text-blue-700 space-y-1">
              <li>• End-to-end encryption for all data transmission and storage</li>
              <li>• Multi-factor authentication and access controls</li>
              <li>• Regular security audits and penetration testing</li>
              <li>• Compliance with PIPEDA, GDPR, and privacy best practices</li>
              <li>• Canadian data residency with strict jurisdictional controls</li>
            </ul>
          </div>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect & Legal Basis</h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Personal Information (Required for Service)</h3>
              <ul className="space-y-1">
                <li><strong>Account Data:</strong> Email, name, phone (consent & contract performance)</li>
                <li><strong>Legal Documents:</strong> Case files, evidence, correspondence (legitimate interest)</li>
                <li><strong>Payment Data:</strong> Billing info processed by Stripe (contract performance)</li>
                <li><strong>Identity Verification:</strong> For low-income program eligibility (legal compliance)</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Technical Information (Automatic Collection)</h3>
              <ul className="space-y-1">
                <li><strong>Usage Analytics:</strong> Anonymized platform usage patterns (legitimate interest)</li>
                <li><strong>System Logs:</strong> Error logs, security events (system integrity)</li>
                <li><strong>Device Data:</strong> IP address, browser type, session data (service delivery)</li>
                <li><strong>Cookies:</strong> Essential cookies only - no tracking or advertising</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Advanced Data Security & Protection</h2>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-green-800 mb-2">🔐 Military-Grade Security Measures</h3>
              <ul className="text-green-700 space-y-1">
                <li><strong>Encryption:</strong> AES-256 encryption at rest, TLS 1.3 in transit</li>
                <li><strong>Database:</strong> PostgreSQL with Row Level Security (RLS) policies</li>
                <li><strong>Access Control:</strong> Zero-trust architecture with role-based permissions</li>
                <li><strong>Monitoring:</strong> 24/7 security monitoring and incident response</li>
                <li><strong>Backup:</strong> Encrypted daily backups with 30-day retention</li>
                <li><strong>Infrastructure:</strong> SOC 2 Type II certified cloud providers</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🇨🇦 Canadian Data Sovereignty</h3>
              <ul className="text-blue-700 space-y-1">
                <li><strong>Primary Storage:</strong> Canadian data centers (Toronto, Montreal)</li>
                <li><strong>Backup Storage:</strong> Encrypted replicas in Canadian facilities only</li>
                <li><strong>No Cross-Border:</strong> Data never leaves Canadian jurisdiction without consent</li>
                <li><strong>Government Access:</strong> Only under valid Canadian court orders</li>
                <li><strong>Processing Location:</strong> All AI/ML processing performed in Canada</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide legal guidance and document preparation services</li>
              <li>Process payments and manage subscriptions</li>
              <li>Improve our services through analytics</li>
              <li>Communicate with you about your account and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information. We may share information:</p>
            <ul>
              <li>With service providers (Supabase, Stripe) under strict data agreements</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer (with notice)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p>We retain your information:</p>
            <ul>
              <li>Account data: Until you delete your account</li>
              <li>Case files: 7 years after last activity (legal requirement)</li>
              <li>Payment records: As required by tax and accounting laws</li>
              <li>Analytics data: Aggregated and anonymized</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights (PIPEDA Compliance)</h2>
            <p>Under Canadian privacy law, you have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent where applicable</li>
              <li>File a complaint with the Privacy Commissioner</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies and Analytics</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Maintain your login session</li>
              <li>Remember your preferences</li>
              <li>Analyze usage patterns (anonymized)</li>
              <li>Improve website performance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Breach Response & Incident Management</h2>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-red-800 mb-2">🚨 Breach Notification Protocol</h3>
              <p className="text-red-700 mb-2">In the unlikely event of a data breach:</p>
              <ul className="text-red-700 space-y-1">
                <li>• Immediate containment within 1 hour of discovery</li>
                <li>• Privacy Commissioner notification within 72 hours</li>
                <li>• User notification within 72 hours if high risk to rights</li>
                <li>• Forensic investigation and remediation plan</li>
                <li>• Annual security audit and penetration testing</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">AI & Machine Learning Data Use</h2>
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">🤖 Artificial Intelligence Transparency</h3>
              <ul className="text-purple-700 space-y-1">
                <li><strong>AI Processing:</strong> Limited to case analysis and document preparation</li>
                <li><strong>No Training Data:</strong> Your documents are never used to train AI models</li>
                <li><strong>Anonymization:</strong> All AI inputs are anonymized and encrypted</li>
                <li><strong>Human Oversight:</strong> AI recommendations require human review</li>
                <li><strong>Data Retention:</strong> AI processing logs deleted after 90 days</li>
                <li><strong>Third-Party AI:</strong> Only Canadian or EU-based AI providers used</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Our Privacy Team</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold mb-2">Data Protection Officer & Privacy Inquiries:</p>
              <ul>
                <li><strong>Email:</strong> privacy@justice-bot.com | dpo@justice-bot.com</li>
                <li><strong>Phone:</strong> 1-888-JUSTICE (for urgent privacy matters)</li>
                <li><strong>Mail:</strong> Privacy Officer, Justice-Bot Technologies Inc.<br/>
                    P.O. Box 12345, Toronto, ON M5V 3A1, Canada</li>
                <li><strong>Response Time:</strong> 72 hours for urgent matters, 30 days for standard requests</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;