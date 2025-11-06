import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink } from "lucide-react";
import EnhancedSEO from "@/components/EnhancedSEO";

export default function Accessibility() {
  const wcagCompliance = [
    { level: "WCAG 2.1 Level AA", status: "Compliant", color: "bg-green-100 text-green-800" },
    { level: "AODA (Ontario)", status: "Compliant", color: "bg-green-100 text-green-800" },
    { level: "ADA (US Standards)", status: "Substantially Compliant", color: "bg-blue-100 text-blue-800" }
  ];

  const features = [
    {
      title: "Keyboard Navigation",
      description: "Full keyboard accessibility with visible focus indicators and logical tab order throughout the platform."
    },
    {
      title: "Screen Reader Support",
      description: "Compatible with JAWS, NVDA, and VoiceOver. All images have descriptive alt text, forms have proper labels."
    },
    {
      title: "Color Contrast",
      description: "Minimum 4.5:1 contrast ratio for text, 3:1 for UI components. Tested with color blindness simulators."
    },
    {
      title: "Text Resizing",
      description: "Content remains readable and functional when text is resized up to 200% without assistive technology."
    },
    {
      title: "Captions & Transcripts",
      description: "All video content includes closed captions. Written transcripts available for all audio/video materials."
    },
    {
      title: "Plain Language",
      description: "Legal content written at Grade 8-10 reading level. Complex terms explained in simple language."
    },
    {
      title: "Adjustable Settings",
      description: "Users can adjust font size, line spacing, and enable high contrast mode through accessibility panel."
    },
    {
      title: "Form Assistance",
      description: "Clear error messages, inline help text, and real-time validation to help users complete forms successfully."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Accessibility Statement - Justice-Bot"
        description="Justice-Bot is committed to providing accessible legal help for all Canadians. WCAG 2.1 AA and AODA compliant. Learn about our accessibility features."
        canonicalUrl="https://justice-bot.com/accessibility"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Accessibility Statement</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Justice-Bot is committed to ensuring digital accessibility for people with disabilities. 
            We continually improve the user experience for everyone and apply relevant accessibility standards.
          </p>
          <p className="text-muted-foreground">
            <strong>Last Updated:</strong> January 2025
          </p>
        </div>

        {/* Compliance Status */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Compliance Status</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {wcagCompliance.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold">{item.level}</h3>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <Badge className={item.color}>
                  {item.status}
                </Badge>
              </Card>
            ))}
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Accessibility Features</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="mb-12">
          <Card className="p-8 bg-muted/30">
            <h2 className="text-2xl font-bold mb-4">Technical Specifications</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Compatible Technologies</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)</li>
                  <li>Screen readers: JAWS 2021+, NVDA 2021+, VoiceOver (iOS/macOS)</li>
                  <li>Keyboard-only navigation</li>
                  <li>Voice control software (Dragon NaturallySpeaking, Voice Control)</li>
                  <li>Browser text resizing and zoom (up to 200%)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Accessibility Standards</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</li>
                  <li>Accessibility for Ontarians with Disabilities Act (AODA)</li>
                  <li>Americans with Disabilities Act (ADA) Title III</li>
                  <li>Section 508 of the Rehabilitation Act</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Limitations & Known Issues */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Known Limitations</h2>
          <Card className="p-6">
            <p className="text-muted-foreground mb-4">
              We strive for full accessibility but acknowledge some current limitations:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Some third-party embedded content (PayPal checkout) may have accessibility limitations outside our control</li>
              <li>• PDF documents downloaded from government sources may vary in accessibility</li>
              <li>• AI chat responses may occasionally use complex language - we're working to improve this</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              We are actively working to address these limitations and welcome feedback.
            </p>
          </Card>
        </section>

        {/* Feedback & Contact */}
        <section className="mb-12">
          <Card className="p-8 bg-primary/5 border-primary/20">
            <h2 className="text-2xl font-bold mb-4">Accessibility Feedback</h2>
            <p className="text-muted-foreground mb-4">
              We welcome your feedback on the accessibility of Justice-Bot. Please let us know if you encounter 
              accessibility barriers:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li><strong>Email:</strong> admin@justice-bot.com</li>
              <li><strong>Contact Form:</strong> <a href="/contact" className="text-primary hover:underline">justice-bot.com/contact</a></li>
              <li><strong>Response Time:</strong> We aim to respond within 2 business days</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              When reporting accessibility issues, please include:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-2">
              <li>Description of the issue</li>
              <li>Page URL where you encountered the problem</li>
              <li>Browser and assistive technology you're using</li>
              <li>Any error messages received</li>
            </ul>
          </Card>
        </section>

        {/* Continuous Improvement */}
        <section>
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10">
            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <p className="text-muted-foreground mb-4">
              Justice-Bot is committed to continuous accessibility improvements. We:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Conduct regular accessibility audits with third-party experts</li>
              <li>✓ Include accessibility in our development process from the start</li>
              <li>✓ Train our team on accessibility best practices</li>
              <li>✓ Test with real users who have disabilities</li>
              <li>✓ Update this statement as we make improvements</li>
            </ul>
            <div className="mt-6 flex gap-4">
              <a 
                href="https://www.w3.org/WAI/WCAG21/quickref/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Learn About WCAG 2.1 <ExternalLink className="w-4 h-4" />
              </a>
              <a 
                href="https://www.ontario.ca/page/about-accessibility-laws"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Ontario AODA Information <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
