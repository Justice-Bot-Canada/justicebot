import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, ArrowRight } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import ReactMarkdown from 'react-markdown';

export default function SEOPage() {
  const { slug } = useParams();
  const { trackEvent } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_pages' as any)
        .select('*')
        .eq('slug', slug)
        .single() as any;

      if (error) throw error;

      setPage(data);

      // Increment view count
      await supabase
        .from('seo_pages' as any)
        .update({ views: (data?.views || 0) + 1 } as any)
        .eq('id', data?.id);

      trackEvent('seo_page_view', { slug, title: data?.title });
    } catch (error) {
      console.error('Error loading SEO page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCTAClick = async () => {
    if (page) {
      await supabase
        .from('seo_pages' as any)
        .update({ conversions: (page.conversions || 0) + 1 } as any)
        .eq('id', page.id);

      trackEvent('seo_page_conversion', { slug, title: page.title });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!page) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={page.title}
        description={page.meta_description}
        keywords={`${page.topic}, ${page.location}, Ontario legal help, ${page.form_type}`}
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.h1}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Complete guide to {page.topic} in {page.location}, Ontario
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <article className="prose prose-lg max-w-none">
                  <ReactMarkdown>{page.content || ''}</ReactMarkdown>
                </article>
              </Card>

              {/* FAQ Section */}
              {page.faq && page.faq.length > 0 && (
                <Card className="p-8 mt-8">
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {page.faq.map((item: { question: string; answer: string }, idx: number) => (
                      <AccordionItem key={idx} value={`item-${idx}`}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
                <h3 className="text-xl font-bold mb-4">Get Started Now</h3>
                <p className="text-sm text-muted-foreground mb-4">{page.cta}</p>
                <Button 
                  onClick={handleCTAClick}
                  className="w-full"
                  size="lg"
                  asChild
                >
                  <a href="/triage">
                    Start Your Case <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-3">Location Served</h3>
                <p className="text-sm">{page.location}, Ontario and surrounding areas</p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-3">Forms & Documents</h3>
                <p className="text-sm mb-4">Access to {page.form_type} and related legal forms</p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/forms">Browse Forms</a>
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-3">Need Help?</h3>
                <p className="text-sm mb-4">Chat with our AI legal assistant for personalized guidance</p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/chat">Start Chat</a>
                </Button>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
