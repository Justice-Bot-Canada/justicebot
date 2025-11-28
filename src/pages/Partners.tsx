import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { VideoSchema } from "@/components/VideoSchema";
import { Handshake, Users, Building, TrendingUp, Shield, Mail, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Partners() {
  const partnershipTypes = [
    {
      icon: Users,
      title: "Community Organizations",
      description: "Partner with us to provide your members with affordable legal help",
      benefits: [
        "Discounted group rates for your members",
        "Custom referral portal with tracking",
        "Co-branded resources and materials",
        "Training sessions for your staff"
      ]
    },
    {
      icon: Building,
      title: "Legal Clinics & Aid Organizations",
      description: "Extend your reach by referring appropriate cases to Justice-Bot",
      benefits: [
        "Free premium access for your clients",
        "Seamless referral integration",
        "Case complexity triage support",
        "Regular impact reports"
      ]
    },
    {
      icon: Handshake,
      title: "Advocacy Groups",
      description: "Amplify your impact by helping constituents navigate legal processes",
      benefits: [
        "Affiliate revenue sharing program",
        "Joint public education initiatives",
        "Data insights on common legal issues",
        "Policy research collaboration"
      ]
    },
    {
      icon: TrendingUp,
      title: "Technology Partners",
      description: "Integrate Justice-Bot's capabilities into your platform",
      benefits: [
        "API access for document generation",
        "White-label options available",
        "Technical support and documentation",
        "Revenue sharing opportunities"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Partner With Justice-Bot | Collaboration Opportunities"
        description="Join Justice-Bot as a partner. We work with community organizations, legal clinics, advocacy groups, and tech platforms to expand access to justice in Canada."
        keywords="justice-bot partners, legal partnerships, community organizations, legal aid collaboration"
      />
      <VideoSchema
        name="Justice-Bot Partnership Program Overview"
        description="Learn how partnering with Justice-Bot can help your organization expand access to justice across Canada"
        thumbnailUrl="https://www.justice-bot.com/justice-bot-logo.jpeg"
        uploadDate={new Date().toISOString()}
        duration="PT3M"
        embedUrl="https://app.heygen.com/embedded-player/c45c2ca3bc2d450e9a862a937b2ad9a1"
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Partner With Justice-Bot</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Together, we can bridge the justice gap. Join organizations across Canada working to make legal help accessible and affordable for everyone.
            </p>
          </div>

          <div className="mb-16">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                  <Play className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">See How Partnership Works</h2>
                <p className="text-muted-foreground mb-6">Watch our partnership overview video</p>
              </div>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://app.heygen.com/embedded-player/c45c2ca3bc2d450e9a862a937b2ad9a1" 
                  title="HeyGen video player - Justice-Bot Partnership Program"
                  allow="encrypted-media; fullscreen;" 
                  allowFullScreen
                  style={{ border: 0 }}
                />
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {partnershipTypes.map((type, idx) => {
              const Icon = type.icon;
              return (
                <Card key={idx} className="p-8 hover:shadow-xl transition-shadow">
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h2 className="text-2xl font-bold mb-3">{type.title}</h2>
                  <p className="text-muted-foreground mb-6">{type.description}</p>
                  <h3 className="font-semibold mb-3">Partnership Benefits:</h3>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, benefitIdx) => (
                      <li key={benefitIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Shield className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-12 text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Commitment to Partners</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-8">
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  We never share user data. Your clients' information stays confidential.
                </p>
              </div>
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Transparent Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Regular reports showing how many people you've helped access justice.
                </p>
              </div>
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Sustainable Model</h3>
                <p className="text-sm text-muted-foreground">
                  Fair revenue sharing that supports both organizations long-term.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-12 text-center">
            <Mail className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready to Partner?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how we can work together to expand access to justice in your community. Our team will respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="cta" 
                size="lg"
                onClick={() => window.location.href = '/contact?subject=Partnership Inquiry'}
              >
                Contact Us About Partnerships
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = 'mailto:partnerships@justice-bot.com'}
              >
                Email: partnerships@justice-bot.com
              </Button>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Current Partners & Supporters</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Partner Logo</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
