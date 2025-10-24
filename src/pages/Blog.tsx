import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, ArrowRight, Mail } from "lucide-react";
import EnhancedSEO from "@/components/EnhancedSEO";
import { useState } from "react";
import { toast } from "sonner";

export default function Blog() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    // TODO: Integrate with email service
    setTimeout(() => {
      toast.success("Thanks for subscribing! Check your email for the free checklist.");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  const articles = [
    {
      id: "tenant-tribunal-preparation",
      title: "How to Prepare for Your First Landlord-Tenant Board Hearing",
      excerpt: "A step-by-step guide to preparing evidence, organizing documents, and presenting your case effectively at the LTB.",
      date: "2025-01-15",
      readTime: "8 min read",
      category: "Tenant Rights",
      slug: "/blog/tenant-tribunal-preparation"
    },
    {
      id: "small-claims-filing",
      title: "Filing a Small Claims Court Case in Ontario: Complete Walkthrough",
      excerpt: "Everything you need to know about filing in Small Claims Court, from forms to fees to timelines.",
      date: "2025-01-10",
      readTime: "10 min read",
      category: "Small Claims",
      slug: "/blog/small-claims-filing"
    },
    {
      id: "evidence-organization",
      title: "How to Organize Evidence Like a Lawyer",
      excerpt: "Learn professional techniques for organizing documents, photos, emails, and witness statements for maximum impact.",
      date: "2025-01-05",
      readTime: "6 min read",
      category: "Legal Tips",
      slug: "/blog/evidence-organization"
    },
    {
      id: "human-rights-complaint",
      title: "Filing a Human Rights Complaint in Ontario: What to Expect",
      excerpt: "A detailed guide to the HRTO process, from filing your application to preparing for mediation and hearing.",
      date: "2024-12-28",
      readTime: "12 min read",
      category: "Human Rights",
      slug: "/blog/human-rights-complaint"
    }
  ];

  const categories = ["All", "Tenant Rights", "Small Claims", "Human Rights", "Legal Tips", "Family Law"];

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Legal Help Blog - Plain Language Legal Guides | Justice-Bot"
        description="Free plain-language articles about Ontario tribunals, courts, and legal processes. Learn how to represent yourself effectively in tenant disputes, small claims, human rights cases, and more."
        canonicalUrl="https://justice-bot.com/blog"
        keywords="legal help blog, self-represented litigant, tenant rights Ontario, small claims court guide, human rights complaint, legal tips Canada"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section with Lead Magnet */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Legal Help You Can Actually Understand</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Plain-language guides, step-by-step instructions, and real tips from people who've 
              successfully navigated Ontario's legal system.
            </p>
            
            {/* Lead Magnet */}
            <Card className="p-6 bg-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg">Get Our Free Tenant Hearing Checklist</h3>
                  <p className="text-sm text-muted-foreground">
                    10 must-do steps before your LTB hearing + new articles delivered to your inbox
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Subscribing..." : "Get Checklist"}
                </Button>
              </form>
              
              <p className="text-xs text-muted-foreground mt-3">
                We respect your privacy. Unsubscribe anytime. No spam, ever.
              </p>
            </Card>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {categories.map((cat) => (
            <Button key={cat} variant="outline" size="sm">
              {cat}
            </Button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="secondary">{article.category}</Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {article.readTime}
                    </span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                
                <a 
                  href={article.slug}
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                >
                  Read Article <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </Card>
          ))}
        </div>

        {/* Coming Soon Note */}
        <div className="text-center bg-muted/30 rounded-2xl p-12">
          <h2 className="text-2xl font-bold mb-4">More Articles Coming Soon</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            We're building a comprehensive library of plain-language legal guides. Subscribe above 
            to be notified when we publish new articles on tenant rights, small claims, family law, 
            human rights, and more.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
            <span>✓ 2 new articles every month</span>
            <span>✓ Written by people who've been there</span>
            <span>✓ Always free, always plain language</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
