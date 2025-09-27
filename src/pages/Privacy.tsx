import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li>Account information (email, name)</li>
              <li>Case details and legal documents you upload</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Storage and Security</h2>
            <p>Your data is stored securely using:</p>
            <ul>
              <li><strong>Database:</strong> Supabase (PostgreSQL) with encryption at rest</li>
              <li><strong>File Storage:</strong> Supabase Storage with access controls</li>
              <li><strong>Location:</strong> Data centers in Canada and US</li>
              <li><strong>Encryption:</strong> All data transmitted using TLS/SSL</li>
            </ul>
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
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>For privacy-related questions or requests:</p>
            <ul>
              <li>Email: privacy@justice-bot.com</li>
              <li>Response time: 30 days</li>
              <li>Address: [Your business address]</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;