import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  Users, 
  Heart, 
  Building2, 
  CheckCircle, 
  XCircle,
  Home,
  Baby,
  Briefcase,
  Shield,
  Accessibility,
  FileText,
  Mail,
  ExternalLink
} from "lucide-react";

const Clinics = () => {
  const whoWeHelp = [
    "Tenants, parents, workers, and families facing everyday legal problems",
    "People who do not qualify for legal representation or face long wait times",
    "Individuals experiencing barriers related to income, disability, language, or stress"
  ];

  const legalAreas = [
    { icon: Home, label: "Housing and tenancy matters" },
    { icon: Baby, label: "Family and parenting concerns" },
    { icon: Heart, label: "Income supports and benefits" },
    { icon: Accessibility, label: "Disability and accommodation issues" },
    { icon: Briefcase, label: "Employment and workplace issues" },
    { icon: Shield, label: "Human rights and administrative processes" }
  ];

  const howToShare = [
    "List Justice-Bot as a public self-help or pre-intake resource on your website",
    "Share the link in intake emails, resource sheets, or appointment confirmations",
    "Recommend it to clients who need help organizing information before intake",
    "Use it as a low-risk, low-effort way to support people you cannot immediately assist"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="For Clinics & Community Organizations | Justice-Bot"
        description="Partner with Justice-Bot to help your clients navigate legal issues. Free legal navigation tool for community legal clinics and advocacy organizations across Canada."
        keywords="legal clinic partnership, community legal services, access to justice, legal aid Canada, clinic resources"
        canonicalUrl="https://www.justice-bot.com/clinics"
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Building2 className="h-4 w-4" />
              For Clinics & Organizations
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              A Free Legal Navigation Tool for Your Clients
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Justice-Bot helps self-represented individuals understand their situation, 
              identify appropriate legal pathways, and prepare before engaging with clinics, 
              courts, tribunals, or public institutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="mailto:partnerships@justice-bot.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Partner With Us
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/partners">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* What We Are / Are Not */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CheckCircle className="h-6 w-6" />
                    What Justice-Bot IS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>A <strong>free Canadian legal navigation and legal-literacy tool</strong> designed to help people who are self-represented or unsure where to start when legal issues arise.</p>
                  <p>It provides <strong>plain-language guidance</strong> to help users understand their situation, identify appropriate legal pathways, and prepare before engaging with clinics, courts, tribunals, or public institutions.</p>
                </CardContent>
              </Card>

              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <XCircle className="h-6 w-6" />
                    What Justice-Bot is NOT
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground">
                  <p>Justice-Bot is <strong>not a lawyer</strong>, does not provide legal advice, and does not replace legal clinics or representation.</p>
                  <p>It is an <strong>early-stage support tool</strong> meant to reduce confusion and improve preparedness before clients reach your intake process.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Who We Help */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Who Justice-Bot Helps
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We serve the same communities you do — people facing legal challenges without adequate support.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {whoWeHelp.map((item, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">{item}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Legal Areas */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Legal Areas Supported
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {legalAreas.map((area, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 bg-background p-4 rounded-lg border"
                >
                  <area.icon className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{area.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Share */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  How Clinics & Organizations Can Share Justice-Bot
                </h2>
                <p className="text-muted-foreground">
                  Easy, low-effort ways to help more people before they reach your intake.
                </p>
              </div>
              <div className="space-y-4">
                {howToShare.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 bg-muted/50 p-4 rounded-lg"
                  >
                    <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      {index + 1}
                    </div>
                    <p className="text-foreground pt-1">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About the Founder */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-6 w-6 text-primary" />
                  About the Founder
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4">
                <p>
                  Justice-Bot was created by a self-represented Canadian parent who experienced first-hand 
                  the barriers faced by people navigating the justice system without representation.
                </p>
                <p>
                  The initiative is grounded in <strong>access to justice</strong>, <strong>inclusion</strong>, 
                  and <strong>legal empowerment</strong>.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Ready to Partner With Us?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              We'd love to discuss how Justice-Bot can support your clinic or organization's mission to expand access to justice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" asChild>
                <a href="mailto:partnerships@justice-bot.com">
                  <Mail className="mr-2 h-5 w-5" />
                  partnerships@justice-bot.com
                </a>
              </Button>
              <span className="text-primary-foreground/60">or visit</span>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                <a href="https://www.justice-bot.com" target="_blank" rel="noopener noreferrer">
                  www.justice-bot.com
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Clinics;
