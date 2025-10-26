import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Shield, Scale, Users, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="About Justice-Bot - Our Mission & Team"
        description="Learn about Justice-Bot's mission to provide accessible, affordable legal help for all Canadians. Meet our team and understand our commitment to legal equity."
        keywords="about justice-bot, legal help mission, affordable legal services, legal equity"
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About Justice-Bot</h1>
          
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-muted-foreground mb-8">
              Justice-Bot was created to bridge the justice gap in Canada. We believe everyone deserves access to clear, affordable legal guidance—regardless of income or education.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-6">
              <Scale className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
              <p className="text-muted-foreground">
                To democratize legal help by translating complex legal processes into plain language, automating document preparation, and providing smart guidance through Ontario's tribunal and court systems.
              </p>
            </Card>

            <Card className="p-6">
              <Heart className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-3">Our Values</h2>
              <ul className="text-muted-foreground space-y-2">
                <li>• Accessibility for all income levels</li>
                <li>• Plain language, no legal jargon</li>
                <li>• Transparency in pricing and process</li>
                <li>• Privacy and security first</li>
              </ul>
            </Card>
          </div>

          <div className="bg-muted/30 rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
            <p className="text-muted-foreground mb-4">
              Justice-Bot is built by a team with deep experience in legal technology, artificial intelligence, and advocacy. Our advisors include former tribunal members, legal aid lawyers, and technology experts committed to access to justice.
            </p>
            <p className="text-muted-foreground mb-4">
              We work closely with legal experts to ensure our guidance aligns with current law and procedure. All our content references official sources from the Landlord and Tenant Board, Human Rights Tribunal of Ontario, and Ontario courts.
            </p>
            <p className="text-muted-foreground font-semibold mb-4">
              <Shield className="inline w-5 h-5 mr-2" />
              Important: Justice-Bot is not a law firm and does not provide legal advice. We are a self-help tool designed to assist you in preparing your case and understanding your options.
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
              <p className="text-sm text-yellow-900 dark:text-yellow-200">
                <strong>⚠️ Brand Disclaimer:</strong> Justice-Bot (Canada) is an independent platform focused on Ontario legal help. 
                We are not affiliated with justicebot.org or any other "JusticeBot" services operating internationally.
              </p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Our Commitment to You</h2>
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Expert-Reviewed Content</h3>
                  <p className="text-sm text-muted-foreground">All our legal guidance is reviewed by qualified legal professionals with tribunal and court experience.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Privacy Protected</h3>
                  <p className="text-sm text-muted-foreground">Your data is encrypted and never shared. We comply with PIPEDA and maintain strict confidentiality.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Scale className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Constantly Updated</h3>
                  <p className="text-sm text-muted-foreground">We monitor changes in legislation and tribunal rules to keep our guidance current and accurate.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Our Service?</h2>
            <p className="text-muted-foreground mb-6">
              We're here to help. Reach out to learn more about how Justice-Bot can assist with your legal journey.
            </p>
            <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
