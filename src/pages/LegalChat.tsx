import { LegalChatbot } from '@/components/LegalChatbot';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LegalChat() {
  return (
    <div className="min-h-screen flex flex-col">
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
