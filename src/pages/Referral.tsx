import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, XCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Referral() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Justice-Bot for Advocates, Clinics & Organizations"
        description="A practical tool for people navigating legal processes alone. Share Justice-Bot with clients who need orientation on tribunals, forms, and evidence organization."
        keywords="legal clinic referral, advocate tool, self-represented litigant help, tribunal orientation, legal aid alternative"
      />
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Main headline */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">For Advocates & Organizations</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              A practical tool for people navigating legal processes alone
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Justice-Bot helps self-represented individuals understand their legal situation, organize evidence, and prepare court-ready documents — without replacing legal advice.
            </p>
          </div>

          {/* Context for professionals */}
          <Card className="p-8 mb-8">
            <p className="text-muted-foreground mb-6">
              It is designed for people facing real deadlines, limited resources, and complex procedures, particularly in housing, family, and human rights matters.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">What happens when someone clicks your link</h2>
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>They answer a short triage about their situation</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>They receive orientation on the correct process and form</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>They can organize evidence and generate a court-ready Book of Documents</span>
              </div>
              <div className="flex items-start gap-3 text-muted-foreground">
                <span className="ml-8 text-sm italic">No account is required to start.</span>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">What Justice-Bot does not do</h2>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span>It does not provide legal advice</span>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span>It does not replace lawyers or clinics</span>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span>It does not file documents on someone's behalf</span>
              </div>
            </div>
          </Card>

          {/* Closing statement */}
          <Card className="p-8 mb-8 bg-muted/30 border-primary/20">
            <p className="text-lg text-center mb-6">
              Justice-Bot exists to reduce confusion, missed deadlines, and preventable errors — especially for people navigating the system alone.
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/triage">
                  Share Justice-Bot with someone who needs orientation
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Media quote */}
          <Card className="p-6 border-dashed">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">For Media</h3>
            <blockquote className="text-lg italic border-l-4 border-primary pl-4">
              "Justice-Bot doesn't give legal advice — it gives people a fighting chance to show up prepared."
            </blockquote>
            <p className="text-sm text-muted-foreground mt-4">
              Justice-Bot is a Canadian legal-tech platform designed for self-represented people navigating complex legal processes. It helps users understand which legal process applies to their situation, organize and summarize evidence, and generate court-ready documents in the format tribunals expect.
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
