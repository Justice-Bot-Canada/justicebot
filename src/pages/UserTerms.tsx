import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Scale, FileText, CreditCard, Phone } from "lucide-react";

/**
 * User Terms & Consumer Protection Page
 * A2I Compliance - Clear disclosure for self-represented litigant tools
 */
const UserTerms = () => {
  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="User Terms & Consumer Protection | Justice-Bot"
        description="Important consumer protection information for Justice-Bot users. Understand what we do and don't do, your rights, and our service limitations."
        keywords="legal tool terms, consumer protection, self-represented litigant, legal disclaimer"
        canonicalUrl="https://www.justice-bot.com/user-terms"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-10">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">User Terms & Consumer Protection</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Important information about Justice-Bot's services, your rights, and what to expect.
          </p>
        </div>

        <div className="space-y-6">
          {/* Critical Disclaimer */}
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                We Are NOT a Law Firm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>Justice-Bot Technologies Inc. is a legal information technology company, NOT a law firm.</strong></p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We do NOT provide legal advice</li>
                <li>We do NOT represent you in any legal matter</li>
                <li>We do NOT create a lawyer-client relationship</li>
                <li>We do NOT guarantee any legal outcome</li>
              </ul>
              <p className="font-medium">
                For legal advice specific to your situation, you must consult a qualified lawyer licensed in your jurisdiction.
              </p>
            </CardContent>
          </Card>

          {/* What We Actually Do */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                What Justice-Bot Does
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>Justice-Bot is a <strong>legal information and document preparation tool</strong> that helps self-represented individuals:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Understand legal documents</strong> — We explain what documents mean in plain language</li>
                <li><strong>Identify relevant tribunals/courts</strong> — We help you understand which body handles your type of issue</li>
                <li><strong>Find appropriate forms</strong> — We point you to official forms you may need</li>
                <li><strong>Organize your information</strong> — We help you prepare and organize your documents</li>
                <li><strong>Track deadlines</strong> — We provide procedural timeline information</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                All information is general in nature and may not apply to your specific circumstances.
              </p>
            </CardContent>
          </Card>

          {/* Limitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Important Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>No accuracy guarantee:</strong> While we strive for accuracy, laws change and information may be outdated or incomplete</li>
                <li><strong>No outcome guarantee:</strong> Using our tools does not guarantee success in any legal proceeding</li>
                <li><strong>Jurisdiction limits:</strong> Our information focuses on Canadian law and may not apply in other jurisdictions</li>
                <li><strong>AI limitations:</strong> AI-generated content may contain errors and should be verified independently</li>
                <li><strong>Not emergency help:</strong> For urgent legal matters, contact a lawyer or legal aid immediately</li>
              </ul>
            </CardContent>
          </Card>

          {/* Refund & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Pricing & Refunds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Free features:</strong> Account creation, document upload, basic explanations, and initial triage are free</li>
                <li><strong>Paid features:</strong> Court-ready document generation starts at $5.99 CAD</li>
                <li><strong>Refund policy:</strong> We offer refunds within 7 days if our service did not work as described. See our <a href="/payment-policy" className="text-primary hover:underline">Payment Policy</a></li>
                <li><strong>Low-income access:</strong> We offer reduced pricing for qualifying individuals. See <a href="/low-income-approval" className="text-primary hover:underline">Low Income Program</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact & Complaints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Contact & Complaints
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>If you have concerns about our service:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Email:</strong> <a href="mailto:support@justice-bot.com" className="text-primary hover:underline">support@justice-bot.com</a></li>
                <li><strong>Complaints:</strong> See our <a href="/complaint-process" className="text-primary hover:underline">Complaint Process</a></li>
                <li><strong>Feedback:</strong> <a href="/feedback" className="text-primary hover:underline">Submit Feedback</a></li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We are committed to resolving issues within 5 business days.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle>Your Rights as a User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <ul className="list-disc pl-5 space-y-2">
                <li>You may cancel your account and delete your data at any time</li>
                <li>You may request a copy of your data under PIPEDA</li>
                <li>You may file a complaint with the Privacy Commissioner of Canada</li>
                <li>You retain ownership of all documents you upload</li>
                <li>You may seek independent legal advice at any time</li>
              </ul>
            </CardContent>
          </Card>

          {/* Effective Date */}
          <div className="text-center text-sm text-muted-foreground pt-6">
            <p>Last updated: January 2026</p>
            <p className="mt-2">
              By using Justice-Bot, you acknowledge that you have read and understood these terms.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserTerms;
