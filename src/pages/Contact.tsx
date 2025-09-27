import { ContactForm } from "@/components/ContactForm";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <>
      <SEOHead
        title="Contact Us - Media, Partnership & Government Inquiries | Justice Bot"
        description="Get in touch with Justice Bot for media inquiries, business partnerships, and government collaboration opportunities. Contact our team today."
        keywords="contact justice bot, media inquiries, business partnerships, government collaboration, legal tech contact"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Contact Justice Bot
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're from the media, interested in partnerships, or representing a government organization, 
              we'd love to hear from you. Let's work together to make legal help more accessible.
            </p>
          </div>

          <ContactForm />

          {/* Additional Contact Information */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Media Inquiries</h3>
              <p className="text-sm text-muted-foreground">
                Press releases, interviews, and media coverage opportunities
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 8v10l4-2 4 2V8" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Partnerships</h3>
              <p className="text-sm text-muted-foreground">
                Business collaborations, integrations, and strategic alliances
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Government Relations</h3>
              <p className="text-sm text-muted-foreground">
                Public sector initiatives and government collaboration
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;