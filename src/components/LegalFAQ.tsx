import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Filter, Star, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
  featured?: boolean;
}

const faqData: FAQItem[] = [
  {
    id: 'cost-filing',
    question: 'How much does it cost to file a legal case?',
    answer: 'Filing costs vary by tribunal and case type. Small Claims Court fees range from $102-$220, LTB applications are typically $53-$220, and HRTO applications are free. Additional costs may include service fees and hearing preparation.',
    category: 'General',
    tags: ['cost', 'filing', 'fees'],
    helpful: 124,
    notHelpful: 8,
    featured: true
  },
  {
    id: 'lawyer-needed',
    question: 'Do I need a lawyer for my case?',
    answer: 'While you can represent yourself in most tribunals, having legal representation can be beneficial for complex cases. Many tribunals are designed to be accessible without lawyers, and Justice-Bot can help you navigate the process.',
    category: 'General',
    tags: ['lawyer', 'representation', 'self-represent'],
    helpful: 98,
    notHelpful: 12,
    featured: true
  },
  {
    id: 'small-claims-limit',
    question: 'What is the maximum amount I can claim in Small Claims Court?',
    answer: 'In Ontario, you can claim up to $35,000 in Small Claims Court. For amounts over this limit, you would need to file in Superior Court, which has different procedures and may require legal representation.',
    category: 'Small Claims',
    tags: ['limit', 'amount', 'ontario'],
    helpful: 156,
    notHelpful: 4
  },
  {
    id: 'ltb-timeline',
    question: 'How long does an LTB hearing take?',
    answer: 'LTB hearing timelines vary by application type. Simple rent reduction applications (T1) may be scheduled within 2-4 months, while complex cases can take 6-12 months. Emergency applications may be heard sooner.',
    category: 'Landlord & Tenant',
    tags: ['timeline', 'hearing', 'ltb'],
    helpful: 87,
    notHelpful: 15
  },
  {
    id: 'hrto-deadline',
    question: 'How long do I have to file a human rights complaint?',
    answer: 'You generally have one year from the date of the last incident to file an HRTO application. Some exceptions may apply for continuing discrimination or if you were unaware of your rights.',
    category: 'Human Rights',
    tags: ['deadline', 'timeline', 'filing'],
    helpful: 73,
    notHelpful: 6
  },
  {
    id: 'evidence-collection',
    question: 'What evidence do I need for my case?',
    answer: 'Evidence requirements vary by case type, but generally include: documents, photos, witness statements, and expert reports. Keep originals safe and provide clear copies. Our evidence builder can help you organize everything.',
    category: 'General',
    tags: ['evidence', 'documents', 'proof'],
    helpful: 145,
    notHelpful: 7
  },
  {
    id: 'service-documents',
    question: 'How do I serve legal documents?',
    answer: 'Documents can usually be served by mail, courier, fax, or in person. Each tribunal has specific rules about acceptable service methods and timelines. Some may require proof of service.',
    category: 'General',
    tags: ['service', 'delivery', 'documents'],
    helpful: 92,
    notHelpful: 11
  },
  {
    id: 'family-court-fees',
    question: 'What are the fees for family court applications?',
    answer: 'Family court fees vary by application type. Simple applications start at $157, while complex motions can cost $315 or more. Fee waivers may be available for low-income applicants.',
    category: 'Family Law',
    tags: ['fees', 'family', 'court'],
    helpful: 64,
    notHelpful: 9
  },
  {
    id: 'criminal-duty-counsel',
    question: 'What is duty counsel and how can I access it?',
    answer: 'Duty counsel provides free legal advice for people appearing in criminal court without a lawyer. They are available at most courthouses on court days and can provide summary advice about your case.',
    category: 'Criminal Law',
    tags: ['duty-counsel', 'free', 'criminal'],
    helpful: 78,
    notHelpful: 5
  },
  {
    id: 'appeal-process',
    question: 'Can I appeal a tribunal decision?',
    answer: 'Most tribunal decisions can be appealed or reviewed, but there are strict time limits (usually 15-30 days). Appeals may go to a higher tribunal or Divisional Court depending on the original tribunal.',
    category: 'General',
    tags: ['appeal', 'review', 'deadline'],
    helpful: 56,
    notHelpful: 8
  }
];

const categories = ['All', 'General', 'Small Claims', 'Landlord & Tenant', 'Human Rights', 'Family Law', 'Criminal Law'];

const LegalFAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userFeedback, setUserFeedback] = useState<Record<string, 'helpful' | 'not-helpful' | null>>({});

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredFAQs = filteredFAQs.filter(faq => faq.featured);
  const regularFAQs = filteredFAQs.filter(faq => !faq.featured);

  const handleFeedback = (faqId: string, feedback: 'helpful' | 'not-helpful') => {
    setUserFeedback(prev => ({ ...prev, [faqId]: feedback }));
    // In a real app, this would send feedback to the backend
  };

  const FAQCard: React.FC<{ faq: FAQItem; featured?: boolean }> = ({ faq, featured = false }) => (
    <Card className={featured ? 'border-yellow-200 bg-yellow-50' : ''}>
      <CardContent className="p-0">
        <AccordionItem value={faq.id} className="border-none">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
            <div className="flex items-start gap-3 w-full">
              {featured && <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />}
              <div className="flex-1">
                <h3 className="font-medium text-sm">{faq.question}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {faq.category}
                  </Badge>
                  <div className="flex gap-1">
                    {faq.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">
                    {faq.helpful + faq.notHelpful} responses
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={userFeedback[faq.id] === 'helpful' ? 'default' : 'ghost'}
                      className="h-7 px-2"
                      onClick={() => handleFeedback(faq.id, 'helpful')}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {faq.helpful}
                    </Button>
                    <Button
                      size="sm"
                      variant={userFeedback[faq.id] === 'not-helpful' ? 'default' : 'ghost'}
                      className="h-7 px-2"
                      onClick={() => handleFeedback(faq.id, 'not-helpful')}
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      {faq.notHelpful}
                    </Button>
                  </div>
                </div>
                
                <Button size="sm" variant="ghost" className="h-7">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Ask Follow-up
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common legal questions. Can't find what you're looking for? 
          Use our AI assistant for personalized help.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions, answers, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {categories.map(category => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredFAQs.length} of {faqData.length} questions
        {searchTerm && ` matching "${searchTerm}"`}
        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
      </div>

      {/* Featured FAQs */}
      {featuredFAQs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Featured Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {featuredFAQs.map(faq => (
              <FAQCard key={faq.id} faq={faq} featured />
            ))}
          </Accordion>
        </div>
      )}

      {/* Regular FAQs */}
      {regularFAQs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {regularFAQs.map(faq => (
              <FAQCard key={faq.id} faq={faq} />
            ))}
          </Accordion>
        </div>
      )}

      {/* No Results */}
      {filteredFAQs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No questions found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or browse different categories.
            </p>
            <Button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-blue-900 mb-2">Still need help?</h3>
          <p className="text-blue-800 text-sm mb-4">
            Our AI assistant can provide personalized guidance for your specific situation.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <MessageCircle className="h-4 w-4 mr-2" />
            Ask Our AI Assistant
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalFAQ;