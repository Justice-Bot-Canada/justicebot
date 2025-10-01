import { LegalChatbot } from '@/components/LegalChatbot';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

export default function LegalChat() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="AI Legal Assistant - Free Legal Questions"
        description="Get instant answers to your legal questions about Ontario courts and tribunals. Free AI-powered legal chatbot for landlord tenant, human rights, small claims, and more."
        keywords="legal chatbot, AI legal assistant, free legal advice, Ontario legal help, legal questions"
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">AI Legal Assistant</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant answers to your legal questions about Ontario courts and tribunals
          </p>
        </div>
        <LegalChatbot />
      </main>
      <Footer />
    </div>
  );
}
