import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Clock, CheckCircle, Calendar } from "lucide-react";
import EnhancedSEO from "@/components/EnhancedSEO";

export default function Roadmap() {
  const quarters = [
    {
      quarter: "Q1 2025",
      status: "In Progress",
      color: "bg-blue-100 text-blue-800",
      icon: Clock,
      features: [
        { 
          name: "French Language Support", 
          description: "Full platform translation for Quebec users",
          status: "In Development"
        },
        { 
          name: "Mobile App (iOS/Android)", 
          description: "Native mobile apps with offline form access",
          status: "Beta Testing"
        },
        { 
          name: "Live Chat Support", 
          description: "Real-time assistance from legal support staff",
          status: "Planned"
        },
        { 
          name: "Enhanced AI Analysis", 
          description: "Improved case merit scoring with case law citations",
          status: "In Development"
        }
      ]
    },
    {
      quarter: "Q2 2025",
      status: "Planned",
      color: "bg-purple-100 text-purple-800",
      icon: Calendar,
      features: [
        { 
          name: "Family Law Expansion", 
          description: "Comprehensive divorce, custody, and support guidance",
          status: "Design Phase"
        },
        { 
          name: "Immigration Support", 
          description: "PR applications, work permits, appeals assistance",
          status: "Research Phase"
        },
        { 
          name: "Video Hearing Prep", 
          description: "Practice tools for virtual tribunal/court hearings",
          status: "Planned"
        },
        { 
          name: "Community Forum", 
          description: "User community for sharing experiences (moderated)",
          status: "Planned"
        }
      ]
    },
    {
      quarter: "Q3 2025",
      status: "Future",
      color: "bg-indigo-100 text-indigo-800",
      icon: Rocket,
      features: [
        { 
          name: "Lawyer Matching Network", 
          description: "Connect with vetted lawyers for complex cases",
          status: "Concept"
        },
        { 
          name: "Multi-Province Support", 
          description: "Expand beyond Ontario to BC, AB, and other provinces",
          status: "Research Phase"
        },
        { 
          name: "Court E-Filing Integration", 
          description: "Direct electronic filing to tribunals/courts",
          status: "Concept"
        },
        { 
          name: "Paralegal Collaboration", 
          description: "Review and advisory services from licensed paralegals",
          status: "Concept"
        }
      ]
    }
  ];

  const recentlyShipped = [
    {
      name: "Success Stories Page",
      date: "January 2025",
      description: "Real user testimonials and case outcomes"
    },
    {
      name: "Blog & Legal Guides",
      date: "January 2025",
      description: "Plain-language articles on legal processes"
    },
    {
      name: "Accessibility Improvements",
      date: "December 2024",
      description: "WCAG 2.1 AA compliance and screen reader support"
    },
    {
      name: "Enhanced Security",
      date: "December 2024",
      description: "Bank-level encryption and Canadian data residency"
    },
    {
      name: "Document Templates Library",
      date: "November 2024",
      description: "Professional templates for evidence, letters, and statements"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Product Roadmap - Justice-Bot"
        description="See what's coming to Justice-Bot. Mobile apps, French support, family law expansion, and more features to help Canadians navigate the legal system."
        canonicalUrl="https://justice-bot.com/roadmap"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Rocket className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Product Roadmap</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Building the Future of Accessible Justice
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're constantly improving Justice-Bot based on user feedback and legal system needs. 
            Here's what we're working on and what's coming next.
          </p>
        </div>

        {/* Recently Shipped */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold">Recently Shipped</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentlyShipped.map((item, index) => (
              <Card key={index} className="p-6 border-green-200 bg-green-50">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold">{item.name}</h3>
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <span className="text-xs text-green-700 font-medium">{item.date}</span>
              </Card>
            ))}
          </div>
        </section>

        {/* Quarterly Roadmap */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Coming Soon</h2>
          <div className="space-y-12">
            {quarters.map((quarter, qIndex) => {
              const Icon = quarter.icon;
              return (
                <div key={qIndex}>
                  <div className="flex items-center gap-4 mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">{quarter.quarter}</h3>
                    </div>
                    <Badge className={quarter.color}>{quarter.status}</Badge>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {quarter.features.map((feature, fIndex) => (
                      <Card key={fIndex} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold">{feature.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {feature.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature Request */}
        <section className="mb-16">
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Have a Feature Request?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Justice-Bot is built for the community, by the community. We prioritize features 
                based on user needs and feedback. Tell us what would help you most.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a 
                  href="/feedback" 
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-8 py-3 font-semibold hover:bg-primary/90 transition-colors"
                >
                  Submit Feature Request
                </a>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Contact Product Team
                </a>
              </div>
            </div>
          </Card>
        </section>

        {/* Commitment */}
        <section>
          <Card className="p-8 bg-muted/30">
            <h2 className="text-2xl font-bold mb-4">Our Commitment to Users</h2>
            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Transparent Development</h3>
                <p className="text-sm">
                  We update this roadmap monthly and communicate changes via email newsletter. 
                  Premium subscribers get early access to new features.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">User-Driven Priorities</h3>
                <p className="text-sm">
                  Feature requests from users are reviewed weekly. The most requested features 
                  get moved up in our development queue.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Quality First</h3>
                <p className="text-sm">
                  We won't rush features. Every release is thoroughly tested with real users 
                  to ensure accuracy and usability.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Always Free Tier</h3>
                <p className="text-sm">
                  We'll always maintain a free tier with essential features. Access to justice 
                  shouldn't depend on ability to pay.
                </p>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
