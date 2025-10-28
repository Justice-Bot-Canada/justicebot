import { DocumentAnalyzer } from '@/components/DocumentAnalyzer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CanonicalURL } from '@/components/CanonicalURL';
import EnhancedSEO from '@/components/EnhancedSEO';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function DocumentAnalysis() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CanonicalURL />
      <EnhancedSEO
        title="AI Document Analyzer"
        description="Upload legal documents, evidence, or correspondence for instant AI-powered analysis. Extract key information, identify relevant legal issues, and get actionable insights."
        keywords="document analysis, legal documents, AI analyzer, evidence analysis, legal tech"
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Document Analyzer</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Upload legal documents, evidence, or correspondence for instant AI-powered analysis. 
            Extract key information, identify relevant legal issues, and get actionable insights.
          </p>
        </div>
        <div className="max-w-4xl">
          <DocumentAnalyzer />
        </div>
      </main>
      <Footer />
    </div>
  );
}
