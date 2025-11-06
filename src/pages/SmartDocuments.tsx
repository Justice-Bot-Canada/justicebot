import { SmartDocumentGenerator } from '@/components/SmartDocumentGenerator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

export default function SmartDocuments() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Smart Document Drafter - AI Legal Document Generation"
        description="Generate professional legal documents with AI. Create demand letters, affidavits, witness statements, and settlement offers with customizable tones."
        keywords="legal document generator, AI legal drafting, demand letter, affidavit generator, witness statement, settlement offer"
      />
      <Header />
      <main className="flex-1">
        <SmartDocumentGenerator />
      </main>
      <Footer />
    </div>
  );
}
