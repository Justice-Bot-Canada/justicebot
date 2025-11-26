import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Scale, Heart, BookOpen } from "lucide-react";
import EnhancedSEO from "@/components/EnhancedSEO";

export default function Team() {
  const team = [
    {
      name: "Justice-Bot Legal Team",
      role: "Legal Research & Methodology",
      credentials: "Developed by self-represented litigants with extensive tribunal experience",
      bio: "Our methodology is built on real-world experience navigating Ontario's legal system. We've been through the process ourselves and understand the challenges faced by self-represented individuals.",
      focus: ["Tenant Rights", "Human Rights", "Family Law", "Small Claims"]
    }
  ];

  const advisors = [
    {
      icon: Scale,
      title: "Legal Framework",
      description: "Our guidance is based on current Ontario legislation, tribunal rules, and court procedures as published by official government sources."
    },
    {
      icon: BookOpen,
      title: "Plain Language Approach",
      description: "We translate complex legal concepts into clear, actionable steps that anyone can understand and follow."
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Your information is protected with bank-level encryption and secure storage. We never share your data with third parties."
    },
    {
      icon: Heart,
      title: "Community-Driven",
      description: "Justice-Bot was created by people who've navigated the system ourselves. We're committed to making justice accessible to all."
    }
  ];

  const methodology = [
    {
      step: "1. Research",
      description: "We analyze official tribunal rules, court procedures, and legal precedents from authoritative sources."
    },
    {
      step: "2. Simplify",
      description: "Complex legal language is translated into plain English with clear explanations and examples."
    },
    {
      step: "3. Structure",
      description: "Legal processes are broken down into step-by-step pathways that guide you through each stage."
    },
    {
      step: "4. Validate",
      description: "Our forms and guidance are cross-referenced with official tribunal and court websites to ensure accuracy."
    },
    {
      step: "5. Update",
      description: "We regularly review and update our content to reflect changes in legislation and tribunal procedures."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Our Team & Methodology - Built by Self-Rep Litigants | Justice-Bot"
        description="Meet the Justice-Bot team: real people who successfully navigated Ontario courts as self-represented litigants. Learn our methodology for making legal help accessible: LTB, HRTO, Family & Small Claims Court expertise."
        keywords="Justice-Bot team, self-represented litigant, Ontario legal methodology, legal tech team, tribunal experience, court navigation experts"
        canonicalUrl="https://justice-bot.com/team"
        breadcrumbs={[
          { name: "Home", url: "https://justice-bot.com/" },
          { name: "Team", url: "https://justice-bot.com/team" }
        ]}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Built by People Who've Been There</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Justice-Bot was created by individuals who've successfully navigated Ontario's legal system as 
            self-represented litigants. We understand the challenges because we've lived them.
          </p>
        </div>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid gap-6 md:grid-cols-1 max-w-3xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="p-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-semibold mb-2">{member.role}</p>
                    <Badge variant="secondary" className="mb-4">{member.credentials}</Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {member.focus.map((area, i) => (
                      <Badge key={i} variant="outline">{area}</Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Approach */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Approach</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {advisors.map((advisor, index) => {
              const Icon = advisor.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold">{advisor.title}</h3>
                    <p className="text-sm text-muted-foreground">{advisor.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-16">
          <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Methodology</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
              We follow a rigorous process to ensure every piece of guidance, form, and instruction 
              on Justice-Bot is accurate, up-to-date, and easy to understand.
            </p>
            
            <div className="space-y-6 max-w-3xl mx-auto">
              {methodology.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{item.step}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transparency Section */}
        <section className="mb-16">
          <Card className="p-8 bg-primary/5 border-primary/20">
            <h2 className="text-2xl font-bold mb-4">Transparency & Sources</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong>Legal Information Sources:</strong> All guidance is based on publicly available 
                information from official government websites including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Landlord and Tenant Board (LTB) - tribunalsontario.ca/ltb</li>
                <li>Human Rights Tribunal of Ontario (HRTO) - tribunalsontario.ca/hrto</li>
                <li>Ontario Court of Justice - ontariocourts.ca</li>
                <li>Small Claims Court - ontario.ca/smallclaims</li>
                <li>Legal Aid Ontario - legalaid.on.ca</li>
              </ul>
              <p className="pt-4">
                <strong>What We're Not:</strong> Justice-Bot is not a law firm and does not provide legal advice. 
                We provide information, tools, and guidance to help you represent yourself. Complex cases may 
                require consultation with a licensed lawyer or paralegal.
              </p>
            </div>
          </Card>
        </section>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Questions About Our Approach?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're committed to transparency. If you have questions about our methodology, 
            sources, or how we develop our guidance, we'd love to hear from you.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-8 py-3 font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
