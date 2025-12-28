import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  User, 
  Image, 
  Globe, 
  Mail, 
  Download,
  Scale,
  Home,
  Users,
  Briefcase,
  Heart,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";

const Press = () => {
  const legalAreas = [
    { icon: Home, label: "Housing & Tenancy" },
    { icon: Users, label: "Family & Parenting" },
    { icon: Briefcase, label: "Income & Benefits" },
    { icon: Shield, label: "Disability & Accommodation" },
    { icon: Scale, label: "Employment" },
    { icon: Heart, label: "Human Rights" },
  ];

  const mediaAssets = [
    { icon: FileText, label: "Press Kit (PDF)", href: "#", description: "Download our media package" },
    { icon: User, label: "Founder Bio", href: "/about", description: "Background on Justice-Bot's creator" },
    { icon: Image, label: "Screenshots & Visuals", href: "#", description: "Product images for publications" },
    { icon: Globe, label: "Website", href: "https://www.justice-bot.com", description: "justice-bot.com" },
  ];

  return (
    <>
      <SEOHead
        title="Press & Media | Justice-Bot - Canadian Legal Navigation Tool"
        description="Media resources and press information for Justice-Bot, a Canadian civic-technology initiative improving legal literacy and navigation for self-represented individuals."
        keywords="Justice-Bot press, legal tech media, Canadian legal innovation, access to justice, legal literacy tool, civic technology"
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Press & Media
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Justice-Bot is a Canadian civic-technology initiative focused on improving legal literacy 
              and early legal navigation for people who are self-represented or unsure where to start.
            </p>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
              Built from lived experience, Justice-Bot helps people understand the nature of their legal issue, 
              identify appropriate pathways, and prepare for next steps — in plain language.
            </p>
            <p className="text-sm text-muted-foreground mt-4 italic">
              Justice-Bot does not provide legal advice or legal representation.
            </p>
          </div>

          {/* What Justice-Bot Is */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Scale className="h-6 w-6 text-primary" />
                What Justice-Bot Is
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Justice-Bot is a free legal navigation and legal-literacy tool designed to help people:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Understand what type of legal issue they are facing</li>
                <li>Identify relevant processes, services, or institutions</li>
                <li>Reduce early confusion and missed steps</li>
                <li>Prepare before engaging with clinics, courts, tribunals, or public agencies</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                It supports common everyday legal issues, including:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {legalAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <area.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{area.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What Justice-Bot Is NOT */}
          <Card className="mb-8 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-2xl">What Justice-Bot Is Not</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Justice-Bot is <strong>not a lawyer</strong></li>
                <li>• It does <strong>not provide legal advice</strong> or opinions</li>
                <li>• It does <strong>not replace</strong> lawyers, legal aid, clinics, courts, or tribunals</li>
                <li>• It does <strong>not make legal decisions</strong> for users</li>
              </ul>
              <p className="mt-4 text-muted-foreground italic">
                Its purpose is to improve understanding and access — not to substitute professional services.
              </p>
            </CardContent>
          </Card>

          {/* Why It Matters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Why It Matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Across Canada, more people are being forced to navigate legal systems without representation 
                due to rising costs, backlogs, and limited access to legal aid.
              </p>
              <p className="text-muted-foreground">
                Justice-Bot was created in response to this gap — as a grassroots, responsible civic-tech 
                approach to help people engage more effectively with existing systems rather than abandon them.
              </p>
            </CardContent>
          </Card>

          {/* Founder */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                Founder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Terri is a Canadian parent and self-represented litigant who built Justice-Bot after 
                navigating housing and legal processes without access to timely legal help.
              </p>
              <p className="text-muted-foreground">
                The project reflects a lived-experience response to the access-to-justice gap and focuses 
                on empowering people with knowledge and clarity during high-stress legal situations.
              </p>
              <p className="text-muted-foreground italic">
                Terri is based in Ontario.
              </p>
            </CardContent>
          </Card>

          {/* Status & Public Interest */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Status & Public Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Since launch, Justice-Bot has begun generating grassroots interest among front-line 
                family-serving, child-focused, and community support spaces, reflecting growing demand 
                for tools that help people understand legal systems earlier and more clearly.
              </p>
            </CardContent>
          </Card>

          {/* Media Assets */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Media Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {mediaAssets.map((asset, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <asset.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium text-foreground">{asset.label}</h3>
                      <p className="text-sm text-muted-foreground">{asset.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Media Contact */}
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                Media Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <a 
                  href="mailto:media@justice-bot.com" 
                  className="text-primary hover:underline font-medium text-lg"
                >
                  media@justice-bot.com
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                (press@justice-bot.com also accepted)
              </p>
              <p className="text-muted-foreground">
                For interviews, background, or clarification, please reach out by email.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link to="/">
              <Button size="lg" className="mr-4">
                Visit Justice-Bot
              </Button>
            </Link>
            <Link to="/clinics">
              <Button variant="outline" size="lg">
                For Clinics & Organizations
              </Button>
            </Link>
          </div>
        </main>

        {/* Footer Note */}
        <div className="bg-muted/50 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Justice-Bot is a civic-technology initiative. It does not provide legal advice.
          </p>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Press;
